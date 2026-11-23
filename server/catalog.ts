import {
  catalogProducts,
  type CatalogCategory,
  type CatalogProduct,
  type CatalogStatus,
} from "../src/data/catalogProducts.ts"

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
  if (!url || !key) return { products: catalogProducts, categories: [] }

  const headers = { apikey: key, Authorization: `Bearer ${key}` }
  try {
    const [productResponse, categoryResponse] = await Promise.all([
      fetch(`${url}/rest/v1/products?select=*&order=id.asc`, { headers }),
      fetch(`${url}/rest/v1/categoty?select=*&order=sort.asc,id.asc`, { headers }),
    ])
    if (!productResponse.ok) {
      console.error("Supabase products:", productResponse.status, (await productResponse.text()).slice(0, 300))
      return { products: catalogProducts, categories: [] }
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
    return { products: catalogProducts, categories: [] }
  }
}
