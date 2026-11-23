import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { readFileSync } from "node:fs"
import type { IncomingMessage, ServerResponse } from "node:http"
import { join } from "node:path"
import { defineConfig, loadEnv, type Plugin } from "vite"
import { ApplicationError, parseApplication, sendApplication } from "./server/mail.ts"
import { fallbackCatalog, loadCatalog } from "./server/catalog.ts"
import { OrderError, createOrder, loadOrder } from "./server/orders.ts"
import { metaForRequest, loadMetaRows, originOf } from "./server/pageMeta.ts"
import { applyHtmlMeta, fallbackMeta } from "./src/lib/pageMeta.ts"
import { loadSiteContent } from "./server/sheets.ts"
import { defaultSiteContent } from "./src/data/siteContent.ts"

function readBody(req: IncomingMessage, limit = 10_000) {
  return new Promise<unknown>((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on("data", (chunk: Buffer) => {
      size += chunk.length
      if (size > limit) {
        reject(new ApplicationError(413, "Слишком большая заявка"))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))
      } catch {
        reject(new ApplicationError(400, "Некорректная заявка"))
      }
    })
    req.on("error", reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(body))
}

function contentApi(): Plugin {
  return {
    name: "content-api",
    configureServer(server) {
      server.middlewares.use("/api/content", (req, res, next) => {
        if (req.method !== "GET") {
          next()
          return
        }
        res.setHeader("Cache-Control", "no-store")
        loadSiteContent()
          .then((content) => sendJson(res, 200, content))
          .catch((error: unknown) => {
            console.error(error)
            sendJson(res, 200, defaultSiteContent)
          })
      })
    },
  }
}

function catalogApi(): Plugin {
  return {
    name: "catalog-api",
    configureServer(server) {
      server.middlewares.use("/api/catalog", (req, res, next) => {
        if (req.method !== "GET") {
          next()
          return
        }
        res.setHeader("Cache-Control", "no-store")
        loadCatalog()
          .then((catalog) => sendJson(res, 200, catalog))
          .catch((error: unknown) => {
            console.error(error)
            sendJson(res, 200, fallbackCatalog())
          })
      })
    },
  }
}

function requestOrigin(req: IncomingMessage) {
  const forwarded = req.headers["x-forwarded-proto"]
  const proto = typeof forwarded === "string" ? forwarded.split(",")[0] : undefined
  return originOf(req.headers.host, proto)
}

function queryNumber(url: string | undefined) {
  const query = url?.includes("?") ? url.slice(url.indexOf("?")) : ""
  return new URLSearchParams(query).get("number") ?? ""
}

function ordersApi(): Plugin {
  return {
    name: "orders-api",
    configureServer(server) {
      server.middlewares.use("/api/orders", (req, res, next) => {
        res.setHeader("Cache-Control", "no-store")
        if (req.method === "GET") {
          loadOrder(queryNumber(req.url))
            .then((order) => sendJson(res, order ? 200 : 404, { order }))
            .catch((error: unknown) => {
              console.error(error)
              const status = error instanceof OrderError ? error.status : 500
              sendJson(res, status, { order: null })
            })
          return
        }
        if (req.method !== "POST") {
          next()
          return
        }
        readBody(req, 64_000)
          .then((body) => createOrder(body, requestOrigin(req)))
          .then((order) => sendJson(res, 200, { ok: true, id: order.id, createdAt: order.createdAt }))
          .catch((error: unknown) => {
            const status = error instanceof OrderError ? error.status : error instanceof ApplicationError ? error.status : 500
            console.error(error)
            sendJson(res, status, { ok: false })
          })
      })
    },
  }
}

function requestApi(): Plugin {
  return {
    name: "request-api",
    configureServer(server) {
      server.middlewares.use("/api/request", (req, res, next) => {
        if (req.method !== "POST") {
          next()
          return
        }
        readBody(req)
          .then((body) => sendApplication(parseApplication(body)))
          .then(() => sendJson(res, 200, { ok: true }))
          .catch((error: unknown) => {
            const status = error instanceof ApplicationError ? error.status : 500
            console.error(error)
            sendJson(res, status, { ok: false })
          })
      })
    },
  }
}

const pagePaths = new Set(["/", "/catalog", "/cart", "/checkout", "/thanks"])

function isDocument(pathname: string) {
  return pagePaths.has(pathname) || pathname.startsWith("/product/") || pathname.startsWith("/order/")
}

function metaApi(): Plugin {
  return {
    name: "meta-api",
    configureServer(server) {
      server.middlewares.use("/api/meta", (req, res, next) => {
        if (req.method !== "GET") {
          next()
          return
        }
        res.setHeader("Cache-Control", "no-store")
        loadMetaRows()
          .then((rows) => sendJson(res, 200, { rows }))
          .catch((error: unknown) => {
            console.error(error)
            sendJson(res, 200, { rows: fallbackMeta })
          })
      })
    },
  }
}

function metaHtml(): Plugin {
  return {
    name: "meta-html",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || "/").split("?")[0]
        if ((req.method !== "GET" && req.method !== "HEAD") || !isDocument(pathname)) {
          next()
          return
        }
        try {
          const proto = typeof req.headers["x-forwarded-proto"] === "string" ? req.headers["x-forwarded-proto"] : "http"
          const origin = originOf(req.headers.host, proto)
          const meta = await metaForRequest(pathname, origin)
          const template = readFileSync(join(process.cwd(), "index.html"), "utf8")
          const html = await server.transformIndexHtml(req.url || "/", applyHtmlMeta(template, meta, `${origin}${pathname}`))
          res.statusCode = 200
          res.setHeader("Content-Type", "text/html; charset=utf-8")
          res.end(html)
        } catch (error) {
          console.error(error)
          next()
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  for (const prefix of ["YANDEX_", "TELEGRAM_", "GOOGLE_", "SUPABASE_"]) {
    const fileEnv = loadEnv(mode, process.cwd(), prefix)
    for (const [key, value] of Object.entries(fileEnv)) {
      if (process.env[key] === undefined) process.env[key] = value
    }
  }

  const flowMode = loadEnv(mode, process.cwd(), "MODE").MODE ?? ""

  return {
    define: {
      __FLOW_MODE__: JSON.stringify(flowMode),
    },
    plugins: [react(), tailwindcss(), metaHtml(), requestApi(), ordersApi(), contentApi(), catalogApi(), metaApi()],
  }
})
