import {
  catalogCategories,
  catalogProducts,
  type CatalogCategory,
  type CatalogProduct,
  type CatalogStatus,
} from "../src/data/catalogProducts.js"

type ProductRow = {
  id?: number | string
  name?: string
  price?: number | string | null
  "old price"?: number | string | null
  status?: string | null
  category_id?: number | string | null
}

type CategoryRow = {
  id?: number | string
  name?: string
  sort?: number | null
}

const images = new Map(catalogProducts.map((product) => [product.name.toLowerCase(), product.image]))

const fallbackRows: ProductRow[] = [
  { id: 1, name: "Грация", price: 165, category_id: 2 },
  { id: 2, name: "Изящество", price: 120, category_id: 2 },
  { id: 3, name: "Нежность", price: 170, category_id: 2 },
  { id: 4, name: "Фаворит", price: 190, category_id: 2 },
  { id: 5, name: "Классика жанра", price: 290, category_id: 2 },
  { id: 6, name: "Гармония", price: 180, category_id: 2 },
  { id: 7, name: "Зефир", price: 100, category_id: 2 },
  { id: 8, name: "Пудровая роза", price: 190, category_id: 2 },
  { id: 9, name: "Белоснежка", price: 200, category_id: 2 },
  { id: 10, name: "Грация", price: 140, status: "хит", category_id: 1 },
  { id: 11, name: "Изящество", price: 90, "old price": 120, status: "скидка", category_id: 1 },
  { id: 12, name: "Нежность", price: 170, status: "нет в наличии", category_id: 3 },
  { id: 13, name: "Фаворит", price: 190, category_id: 3 },
  { id: 14, name: "Классика жанра", price: 240, "old price": 290, status: "скидка", category_id: 4 },
  { id: 15, name: "Гармония", price: 180, status: "нет в наличии", category_id: 4 },
  { id: 16, name: "Зефир", price: 80, "old price": 100, status: "скидка", category_id: 5 },
  { id: 17, name: "Пудровая роза", price: 190, category_id: 5 },
  { id: 18, name: "Белоснежка", price: 200, status: "хит", category_id: 5 },
]

export function fallbackCatalog() {
  return { products: catalogFromRows(fallbackRows), categories: catalogCategories }
}

function statusOf(value: unknown): CatalogStatus | undefined {
  if (typeof value !== "string") return undefined
  const text = value.trim().toLowerCase()
  if (text === "hit" || text === "хит") return "hit"
  if (text === "sale" || text === "скидка") return "sale"
  if (text === "soldout" || text === "нет в наличии" || text === "нет") return "soldout"
  return undefined
}

function money(value: unknown) {
  if (value == null || value === "") return ""
  const number = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(number)) return ""
  const rounded = Math.round(number * 100) / 100
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, "")
  return `${text} byn`
}

export function catalogFromRows(rows: ProductRow[]): CatalogProduct[] {
  return rows.map((row, index) => {
    const name = row.name?.trim() || "Букет"
    const price = money(row.price)
    const oldPrice = money(row["old price"])
    const marked = statusOf(row.status)
    const onSale = marked === "sale" || (marked !== "soldout" && Boolean(oldPrice) && oldPrice !== price)
    const status: CatalogStatus | undefined = marked === "soldout" ? "soldout" : onSale ? "sale" : marked
    return {
      id: String(row.id ?? index),
      name,
      price: price || oldPrice,
      oldPrice: status === "sale" ? oldPrice || undefined : undefined,
      status,
      categoryId: row.category_id == null ? undefined : String(row.category_id),
      image: images.get(name.toLowerCase()) ?? catalogProducts[index % catalogProducts.length].image,
    }
  })
}

export async function loadCatalog(): Promise<{ products: CatalogProduct[]; categories: CatalogCategory[] }> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "")
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return fallbackCatalog()

  const headers = { apikey: key, Authorization: `Bearer ${key}` }
  try {
    const [productResponse, categoryResponse] = await Promise.all([
      fetch(`${url}/rest/v1/products?select=*&order=id.asc`, { headers }),
      fetch(`${url}/rest/v1/categoty?select=*&order=sort.asc,id.asc`, { headers }),
    ])
    if (!productResponse.ok) {
      console.error("Supabase products:", productResponse.status, (await productResponse.text()).slice(0, 300))
      return fallbackCatalog()
    }
    const rows = (await productResponse.json()) as ProductRow[]
    const categoryRows = categoryResponse.ok ? ((await categoryResponse.json()) as CategoryRow[]) : []
    const categories = Array.isArray(categoryRows)
      ? categoryRows.flatMap((row) => {
          const name = row.name?.trim()
          if (!name) return []
          return [{ id: String(row.id), name }]
        })
      : []
    if (!Array.isArray(rows) || rows.length === 0) return { products: catalogProducts, categories }
    return { products: catalogFromRows(rows), categories }
  } catch (error) {
    console.error(error)
    return fallbackCatalog()
  }
}
