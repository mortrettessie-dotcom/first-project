import { formatOrderDate } from "./orderDate.ts"

export type OrderLine = {
  id: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type OrderView = {
  number: string
  createdAt: string
  lastName: string
  firstName: string
  phone: string
  email: string
  delivery: string
  address: string
  slot: string
  payment: string
  comment: string
  promo: string
  items: OrderLine[]
  deliveryCost: number
  goodsTotal: number
}

export const orderStatus = "Оформлен"

function money(value: number) {
  return `${value} BYN`
}

export function orderMessage(order: OrderView) {
  const when = formatOrderDate(order.createdAt) || order.createdAt
  const goods = order.items.map(
    (item, index) => `${index + 1}. ${item.name} — ${item.quantity} шт. × ${money(item.unitPrice)} = ${money(item.lineTotal)}`,
  )
  return [
    "Новый заказ FLOWLOVE",
    `Номер: ${order.number}`,
    `Статус: ${orderStatus}`,
    `Оформлен: ${when}`,
    "",
    "Получатель",
    `${order.firstName} ${order.lastName}`,
    `Телефон: ${order.phone}`,
    `Почта: ${order.email}`,
    "",
    "Доставка",
    order.delivery,
    `Адрес: ${order.address || "—"}`,
    `Дата и время: ${order.slot}`,
    `Оплата: ${order.payment}`,
    `Комментарий: ${order.comment || "—"}`,
    `Промокод: ${order.promo || "—"}`,
    "",
    "Товары",
    ...goods,
    "",
    `Сумма товаров: ${money(order.goodsTotal)}`,
    `Доставка: ${money(order.deliveryCost)}`,
    `Итого: ${money(order.goodsTotal + order.deliveryCost)}`,
  ].join("\n")
}

export function orderLink(origin: string, number: string) {
  return `${origin.replace(/\/$/, "")}/order/${number}`
}
