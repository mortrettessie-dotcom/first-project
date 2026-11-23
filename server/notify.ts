import { orderLink, orderMessage, type OrderView } from "../src/lib/orderView.js"
import { postTelegram, sendPlainMail } from "./mail.js"

export async function notifyOrder(order: OrderView, origin: string) {
  const text = orderMessage(order)
  const mailed = await sendPlainMail({
    subject: `Новый заказ FLOWLOVE № ${order.number}`,
    replyTo: order.email,
    text,
  })
  if (!mailed) console.error("Письмо о заказе не отправлено")

  const sent = await postTelegram(`${text}\n\n${orderLink(origin, order.number)}`)
  if (!sent) console.error("Сообщение о заказе в Телеграм не отправлено")
  return { mail: mailed, telegram: sent }
}
