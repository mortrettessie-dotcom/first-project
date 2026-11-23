export const DELIVERY_FEE = 15
export const FREE_DELIVERY_FROM = 100

export const deliveryMethods = [
  { id: "courier", label: "Курьером по Минску" },
  { id: "pickup", label: "Самовывоз" },
]

export const paymentMethods = [
  { id: "cash", label: "Наличными курьеру" },
  { id: "card", label: "Картой при получении" },
]

export function deliveryCost(goods: number, method: string) {
  if (goods <= 0 || method !== "courier") return 0
  return goods >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE
}
