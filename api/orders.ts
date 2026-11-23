import { OrderError, createOrder, loadOrder } from "../server/orders.js"
import { originOf } from "../server/pageMeta.js"

type HeaderValue = string | string[] | undefined

type Request = {
  method?: string
  body?: unknown
  url?: string
  query?: { number?: string | string[] }
  headers?: Record<string, HeaderValue>
}

type Response = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => { json: (body: unknown) => void }
}

function header(value: HeaderValue) {
  const first = Array.isArray(value) ? value[0] : value
  return first?.split(",")[0]?.trim()
}

function requestOrigin(req: Request) {
  return originOf(header(req.headers?.host), header(req.headers?.["x-forwarded-proto"]))
}

function queryNumber(req: Request) {
  const fromQuery = req.query?.number
  if (typeof fromQuery === "string") return fromQuery
  if (Array.isArray(fromQuery)) return fromQuery[0] ?? ""
  const query = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""
  return new URLSearchParams(query).get("number") ?? ""
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store")

  if (req.method === "GET") {
    try {
      const order = await loadOrder(queryNumber(req))
      res.status(order ? 200 : 404).json({ order })
    } catch (error) {
      console.error(error)
      res.status(error instanceof OrderError ? error.status : 500).json({ order: null })
    }
    return
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false })
    return
  }

  try {
    const order = await createOrder(req.body, requestOrigin(req))
    res.status(200).json({ ok: true, id: order.id, createdAt: order.createdAt })
  } catch (error) {
    const status = error instanceof OrderError ? error.status : 500
    console.error(error)
    res.status(status).json({ ok: false })
  }
}
