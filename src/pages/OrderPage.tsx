import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Footer } from "../components/Footer.tsx"
import { Header } from "../components/Header.tsx"
import { findCatalogProduct } from "../data/catalogProducts.ts"
import { formatOrderDate } from "../lib/orderDate.ts"
import { orderStatus, type OrderView } from "../lib/orderView.ts"

const script = "var(--font-heading)"
const sans = "var(--font-body)"

function money(value: number) {
  return `${value} BYN`
}

function Crumbs() {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-[13px] leading-5 text-[#9c958c]"
      style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.045em" }}
    >
      <Link to="/#top" className="hover:text-[#4a463c]">
        Главная
      </Link>
      {" - "}
      <span className="text-[#4a463c]" aria-current="page">
        Статус заказа
      </span>
    </nav>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-[#ece8e1] py-4 min-[769px]:grid-cols-[180px_minmax(0,1fr)] min-[769px]:items-baseline min-[769px]:gap-6">
      <p className="text-[13px] text-[#9c958c]" style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.045em" }}>
        {label}
      </p>
      <p className="text-[16px] leading-6 text-[#4a463c]" style={{ fontFamily: sans, fontWeight: 400 }}>
        {value || "—"}
      </p>
    </div>
  )
}

function OrderDetails({ order }: { order: OrderView }) {
  const when = formatOrderDate(order.createdAt)
  const total = order.goodsTotal + order.deliveryCost

  return (
    <>
      <div className="mt-8 flex items-start gap-4">
        <h1 className="text-[#3a342c] leading-[1.35] min-[769px]:leading-[0.85]" style={{ fontFamily: script, fontWeight: 400, fontSize: "clamp(48px, 6.4vw, 96px)" }}>
          СТАТУС ЗАКАЗА
        </h1>
      </div>
      <p className="mt-4 text-[15px] text-[#8d877e]" style={{ fontFamily: sans, fontWeight: 300 }}>
        № {order.number}
        {when ? ` · ${when}` : ""}
      </p>
      <div className="mt-10 grid gap-12 min-[769px]:grid-cols-[minmax(0,1fr)_433px] min-[769px]:gap-x-16">
        <div>
          <Field label="Статус" value={orderStatus} />
          <Field label="Получатель" value={`${order.firstName} ${order.lastName}`.trim()} />
          <Field label="Телефон" value={order.phone} />
          <Field label="Почта" value={order.email} />
          <Field label="Доставка" value={order.delivery} />
          <Field label="Адрес" value={order.address} />
          <Field label="Дата и время" value={order.slot} />
          <Field label="Оплата" value={order.payment} />
          <Field label="Комментарий" value={order.comment} />
          <Field label="Промокод" value={order.promo} />
        </div>
        <aside>
          <p className="text-[16px]" style={{ fontFamily: sans, fontWeight: 400 }}>
            Состав заказа
          </p>
          <ul className="mt-4 flex flex-col gap-4">
            {order.items.map((item) => {
              const product = findCatalogProduct(item.id)
              return (
                <li key={`${item.id}-${item.name}`} className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3">
                  {product ? <img src={product.image} alt="" className="h-16 w-16 bg-[#f7f4ef] object-contain" /> : <span className="h-16 w-16 bg-[#f7f4ef]" />}
                  <div className="min-w-0">
                    <p className="truncate text-[18px] text-[#3a342c]" style={{ fontFamily: script }}>
                      «{item.name}»
                    </p>
                    <p className="text-[14px] text-[#6f675f]" style={{ fontFamily: sans, fontWeight: 300 }}>
                      {item.quantity} шт. × {money(item.unitPrice)} = {money(item.lineTotal)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-6 flex items-center justify-between text-[14px]" style={{ fontFamily: sans, fontWeight: 300 }}>
            <span>Сумма товаров</span>
            <span>{money(order.goodsTotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[14px]" style={{ fontFamily: sans, fontWeight: 300 }}>
            <span>Доставка</span>
            <span>{money(order.deliveryCost)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between bg-[#e7e1d8] px-3 py-2.5 text-[15px]" style={{ fontFamily: sans, fontWeight: 400 }}>
            <span>ИТОГО:</span>
            <span>{money(total)}</span>
          </div>
        </aside>
      </div>
    </>
  )
}

export function OrderPage() {
  const params = useParams()
  const number = params.number ?? ""
  const [order, setOrder] = useState<OrderView | null | undefined>(undefined)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!/^\d{3}-\d{2}-\d{2}$/.test(number)) {
      setOrder(null)
      return
    }
    let cancel = false
    setOrder(undefined)
    fetch(`/api/orders?number=${encodeURIComponent(number)}`)
      .then((response) => response.json())
      .then((data: { order?: OrderView | null }) => {
        if (!cancel) setOrder(data.order ?? null)
      })
      .catch(() => {
        if (!cancel) setOrder(null)
      })
    return () => {
      cancel = true
    }
  }, [number])

  return (
    <div className="min-h-svh bg-white text-[#3a342c]">
      <Header />
      <main>
        <section className="px-4 pt-6 pb-20 min-[769px]:px-[50px] min-[769px]:pt-2 min-[769px]:pb-28">
          <Crumbs />
          {order ? (
            <OrderDetails order={order} />
          ) : order === null ? (
            <div className="mt-8">
              <h1 className="text-[#3a342c] leading-[1.35] min-[769px]:leading-[0.85]" style={{ fontFamily: script, fontWeight: 400, fontSize: "clamp(48px, 6.4vw, 96px)" }}>
                СТАТУС ЗАКАЗА
              </h1>
              <p className="mt-8 text-[16px] text-[#6f675f]" style={{ fontFamily: sans, fontWeight: 300 }}>
                Такого заказа нет.
              </p>
            </div>
          ) : (
            <p className="mt-8 text-[16px] text-[#6f675f]" style={{ fontFamily: sans, fontWeight: 300 }}>
              Открываем заказ
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
