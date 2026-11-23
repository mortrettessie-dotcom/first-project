import { findCatalogProduct, type CatalogProduct } from "../src/data/catalogProducts.js"
import { deliveryCost, deliveryMethods, paymentMethods } from "../src/lib/delivery.js"
import type { OrderLine, OrderView } from "../src/lib/orderView.js"
import { loadCatalog } from "./catalog.js"
import { notifyOrder } from "./notify.js"

export class OrderError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export type OrderReceipt = {
  id: string
  createdAt: string
}

type OrderItemInput = {
  id: string
  quantity: number
}

function amount(value: unknown) {
  const number = typeof value === "number" ? value : Number(value)
  return Number.isFinite(number) ? number : 0
}

function orderItems(value: unknown): OrderLine[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const name = typeof row.name === "string" ? row.name : ""
    const quantity = amount(row.quantity)
    if (!name || quantity < 1) return []
    return [
      {
        id: typeof row.id === "string" ? row.id : "",
        name,
        quantity,
        unitPrice: amount(row.unitPrice),
        lineTotal: amount(row.lineTotal),
      },
    ]
  })
}

function text(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, max)
}

function unitPrice(product: CatalogProduct) {
  return Number(product.price.replace(/[^\d]/g, "")) || 0
}

function orderNumber() {
  const group = (length: number) => String(Math.floor(Math.random() * 10 ** length)).padStart(length, "0")
  return `${group(3)}-${group(2)}-${group(2)}`
}

function supabase() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "")
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new OrderError(500, "База заказов недоступна")
  return { url, key, headers: { apikey: key, Authorization: `Bearer ${key}` } }
}

async function numberTaken(number: string) {
  const { url, headers } = supabase()
  const response = await fetch(`${url}/rest/v1/orders?number=eq.${encodeURIComponent(number)}&select=number`, { headers })
  if (!response.ok) {
    console.error("Supabase orders:", response.status, (await response.text()).slice(0, 300))
    throw new OrderError(502, "Не удалось сохранить заказ")
  }
  const rows = (await response.json()) as unknown
  return Array.isArray(rows) && rows.length > 0
}

export async function loadOrder(number: string): Promise<OrderView | null> {
  if (!/^\d{3}-\d{2}-\d{2}$/.test(number)) return null
  const { url, headers } = supabase()
  const response = await fetch(
    `${url}/rest/v1/orders?number=eq.${encodeURIComponent(number)}&select=number,created_at,last_name,first_name,phone,email,delivery,address,slot,payment,comment,promo,items,delivery_cost,goods_total`,
    { headers },
  )
  if (!response.ok) {
    console.error("Supabase orders:", response.status, (await response.text()).slice(0, 300))
    throw new OrderError(502, "Не удалось открыть заказ")
  }
  const rows = (await response.json()) as Record<string, unknown>[]
  const row = rows[0]
  if (!row || typeof row.number !== "string") return null
  return {
    number: row.number,
    createdAt: typeof row.created_at === "string" ? row.created_at : "",
    lastName: text(row.last_name, 80),
    firstName: text(row.first_name, 80),
    phone: text(row.phone, 40),
    email: text(row.email, 120),
    delivery: text(row.delivery, 80),
    address: text(row.address, 200),
    slot: text(row.slot, 80),
    payment: text(row.payment, 80),
    comment: text(row.comment, 1000),
    promo: text(row.promo, 40),
    items: orderItems(row.items),
    deliveryCost: amount(row.delivery_cost),
    goodsTotal: amount(row.goods_total),
  }
}

export async function createOrder(body: unknown, origin: string): Promise<OrderReceipt> {
  if (!body || typeof body !== "object") throw new OrderError(400, "Некорректный заказ")
  const input = body as Record<string, unknown>
  const lastName = text(input.lastName, 80)
  const firstName = text(input.firstName, 80)
  const phone = text(input.phone, 40)
  const email = text(input.email, 120)
  const delivery = text(input.delivery, 20)
  const address = text(input.address, 200)
  const slot = text(input.slot, 80)
  const payment = text(input.payment, 20)
  const comment = text(input.comment, 1000)
  const promo = text(input.promo, 40)
  const deliveryLabel = deliveryMethods.find((item) => item.id === delivery)?.label
  const paymentLabel = paymentMethods.find((item) => item.id === payment)?.label

  if (!lastName || !firstName || !phone || !email.includes("@")) throw new OrderError(400, "Заполните данные получателя")
  if (!deliveryLabel) throw new OrderError(400, "Укажите способ доставки")
  if (delivery === "courier" && !address) throw new OrderError(400, "Укажите адрес доставки")
  if (!slot) throw new OrderError(400, "Укажите дату и время")
  if (!paymentLabel) throw new OrderError(400, "Укажите способ оплаты")
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 30) {
    throw new OrderError(400, "Корзина пуста")
  }

  const requested: OrderItemInput[] = []
  for (const item of input.items) {
    if (!item || typeof item !== "object") throw new OrderError(400, "Некорректный заказ")
    const row = item as Record<string, unknown>
    const id = text(row.id, 80)
    const quantity = typeof row.quantity === "number" ? Math.floor(row.quantity) : 0
    if (!id || quantity < 1 || quantity > 99) throw new OrderError(400, "Некорректный заказ")
    const existing = requested.find((line) => line.id === id)
    if (existing) existing.quantity += quantity
    else requested.push({ id, quantity })
  }
  if (requested.some((line) => line.quantity > 99)) throw new OrderError(400, "Некорректный заказ")

  const catalog = await loadCatalog()
  const items: OrderLine[] = []
  for (const line of requested) {
    const product = catalog.products.find((entry) => entry.id === line.id) ?? findCatalogProduct(line.id)
    if (!product) throw new OrderError(400, "Не удалось найти товар")
    const price = unitPrice(product)
    items.push({
      id: product.id,
      name: product.name,
      quantity: line.quantity,
      unitPrice: price,
      lineTotal: price * line.quantity,
    })
  }

  const goodsTotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const shipping = deliveryCost(goodsTotal, delivery)
  const { url, headers } = supabase()

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const number = orderNumber()
    if (await numberTaken(number)) continue
    const response = await fetch(`${url}/rest/v1/orders`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({
        number,
        last_name: lastName,
        first_name: firstName,
        phone,
        email,
        delivery: deliveryLabel,
        address: delivery === "courier" ? address : "",
        slot,
        payment: paymentLabel,
        comment,
        promo,
        items,
        delivery_cost: shipping,
        goods_total: goodsTotal,
      }),
    })
    if (response.status === 409) continue
    if (!response.ok) {
      console.error("Supabase orders:", response.status, (await response.text()).slice(0, 300))
      throw new OrderError(502, "Не удалось сохранить заказ")
    }
    const rows = (await response.json()) as { number?: string; created_at?: string }[]
    const row = rows[0]
    if (!row?.number || !row.created_at) throw new OrderError(502, "Не удалось сохранить заказ")
    const saved: OrderView = {
      number: row.number,
      createdAt: row.created_at,
      lastName,
      firstName,
      phone,
      email,
      delivery: deliveryLabel,
      address: delivery === "courier" ? address : "",
      slot,
      payment: paymentLabel,
      comment,
      promo,
      items,
      deliveryCost: shipping,
      goodsTotal,
    }
    try {
      await notifyOrder(saved, origin)
    } catch (error) {
      console.error(error)
    }
    return { id: row.number, createdAt: row.created_at }
  }

  throw new OrderError(502, "Не удалось сохранить заказ")
}
