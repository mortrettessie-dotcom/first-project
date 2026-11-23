import { defaultSiteContent, type SiteContent, type SiteProduct } from "../src/data/siteContent.ts"

const productsGid = "0"
const heroGid = "1373391784"

const headerAliases: Record<string, string> = {
  ключ: "id",
  id: "id",
  key: "id",
  раздел: "section",
  секция: "section",
  section: "section",
  название: "name",
  имя: "name",
  name: "name",
  цена: "price",
  price: "price",
  заголовок: "title",
  title: "title",
  текст: "text",
  подзаголовок: "text",
  text: "text",
}

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
        } else {
          quoted = false
        }
      } else {
        cell += char
      }
      continue
    }
    if (char === '"') {
      quoted = true
    } else if (char === ",") {
      row.push(cell)
      cell = ""
    } else if (char === "\n") {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
    } else if (char !== "\r") {
      cell += char
    }
  }

  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }

  return rows.filter((item) => item.some((value) => value.trim()))
}

function headerKey(value: string) {
  return headerAliases[value.trim().toLowerCase().replace(/\s+/g, " ")] ?? ""
}

function sheetId(url: string) {
  return url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] ?? ""
}

async function readSheet(id: string, gid: string) {
  const response = await fetch(`https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`, {
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) {
    throw new Error(`Таблица ${gid} ответила ${response.status}`)
  }
  return parseCsv(await response.text())
}

function records(rows: string[][]) {
  if (!rows.length) return []
  const keys = rows[0].map(headerKey)
  if (!keys.some(Boolean)) return []
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {}
    keys.forEach((key, index) => {
      if (key) record[key] = row[index]?.trim() ?? ""
    })
    return record
  })
}

function applyProducts(products: SiteProduct[], rows: string[][]) {
  const byId = new Map(products.map((item) => [item.id, item]))
  const byName = new Map(products.map((item) => [item.name.toLowerCase(), item]))

  for (const record of records(rows)) {
    const key = record.id?.trim() ?? ""
    const item = byId.get(key) ?? byName.get(key.toLowerCase())
    if (!item) continue
    if (record.name) item.name = record.name
    if (item.section === "bestsellers" && record.price) item.price = record.price
  }

  return products
}

function applyHero(content: SiteContent, rows: string[][]) {
  const [first] = records(rows)
  if (!first) return content.hero
  return {
    title: first.title || content.hero.title,
    text: first.text || content.hero.text,
  }
}

const cacheMs = 60_000

let cached: { at: number; content: SiteContent } | null = null
let pending: Promise<SiteContent> | null = null

function copyContent(content: SiteContent): SiteContent {
  return {
    hero: { ...content.hero },
    products: content.products.map((item) => ({ ...item })),
  }
}

async function fetchSiteContent(): Promise<SiteContent> {
  const content = copyContent(defaultSiteContent)
  const id = sheetId(process.env.GOOGLE_SHEET_URL ?? "")
  if (!id) return content

  const [products, hero] = await Promise.allSettled([readSheet(id, productsGid), readSheet(id, heroGid)])
  if (products.status === "fulfilled") applyProducts(content.products, products.value)
  else console.error(products.reason)
  if (hero.status === "fulfilled") content.hero = applyHero(content, hero.value)
  else console.error(hero.reason)
  return content
}

export async function loadSiteContent(): Promise<SiteContent> {
  if (cached && Date.now() - cached.at < cacheMs) return copyContent(cached.content)
  if (!pending) {
    pending = fetchSiteContent()
      .then((content) => {
        cached = { at: Date.now(), content }
        return content
      })
      .finally(() => {
        pending = null
      })
  }
  return copyContent(await pending)
}
