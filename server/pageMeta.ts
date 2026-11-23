import { findCatalogProduct } from "../src/data/catalogProducts.ts"
import { absoluteUrl, fallbackMeta, fillProductMeta, metaRowFor, orderPageMeta, type PageMeta } from "../src/lib/pageMeta.ts"
import { loadCatalog } from "./catalog.ts"

const sheetId = "14Qdx9dYpw252BbKlq4icuSNjvkAXs6-VEr9kpSeaju0"
const metaGid = "1910050856"
const cacheMs = 60_000

let cached: { at: number; rows: PageMeta[] } | null = null

function parseCsv(text: string) {
  const source = text.replace(/^\uFEFF/, "")
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          cell += '"'
          index += 1
        } else quoted = false
      } else cell += char
      continue
    }
    if (char === '"') quoted = true
    else if (char === ",") {
      row.push(cell)
      cell = ""
    } else if (char === "\n") {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
    } else if (char !== "\r") cell += char
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter((item) => item.some((value) => value.trim()))
}

function rowsFromCsv(text: string): PageMeta[] {
  const table = parseCsv(text)
  const header = table[0]?.map((value) => value.trim().toLowerCase()) ?? []
  const page = header.findIndex((value) => value.includes("url") || value.includes("страница"))
  const title = header.findIndex((value) => value.includes("title") || value.includes("заголовок"))
  const description = header.findIndex((value) => value.includes("description") || value.includes("описание"))
  const image = header.findIndex((value) => value.includes("image") || value.includes("opengraph") || value.includes("preview"))
  if (page < 0 || title < 0 || description < 0) return []
  return table.slice(1).flatMap((row) => {
    const path = row[page]?.match(/\(([^)]+)\)/)?.[1]?.trim() ?? ""
    if (!path.startsWith("/")) return []
    return [{ path, title: row[title]?.trim() ?? "", description: row[description]?.trim() ?? "", image: row[image]?.trim() ?? "" }]
  })
}

export async function loadMetaRows(): Promise<PageMeta[]> {
  if (cached && Date.now() - cached.at < cacheMs) return cached.rows
  try {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${metaGid}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(String(response.status))
    const rows = rowsFromCsv(await response.text())
    if (!rows.length) throw new Error("empty meta sheet")
    cached = { at: Date.now(), rows }
    return rows
  } catch (error) {
    console.error(error)
    return fallbackMeta
  }
}

export async function metaForRequest(pathname: string, origin: string) {
  const order = orderPageMeta(pathname, origin)
  if (order) return order
  const rows = await loadMetaRows()
  const row = metaRowFor(rows, pathname) ?? fallbackMeta[0]
  const id = decodeURIComponent(pathname.split("?")[0].replace(/^\/product\/?/, ""))
  if (!pathname.startsWith("/product/") || !id) return { ...row, image: absoluteUrl(row.image, origin) }
  const catalog = await loadCatalog()
  const product = catalog.products.find((item) => item.id === id) ?? findCatalogProduct(id)
  if (!product) return { ...row, image: absoluteUrl(row.image, origin) }
  return fillProductMeta(row, product, origin)
}

export function originOf(host: string | undefined, proto: string | undefined) {
  const name = host || "127.0.0.1:5173"
  const protocol = proto || (name.includes("localhost") || name.startsWith("127.") ? "http" : "https")
  return `${protocol}://${name}`
}
