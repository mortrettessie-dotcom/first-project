import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { Footer } from "../components/Footer.tsx"
import { Header } from "../components/Header.tsx"
import { findCatalogProduct, type CatalogProduct } from "../data/catalogProducts.ts"
import { useCart, type CartLine } from "../lib/cart.tsx"
import { deliveryCost, deliveryMethods, paymentMethods } from "../lib/delivery.ts"
import { formatOrderDate } from "../lib/orderDate.ts"

const script = "var(--font-heading)"
const sans = "var(--font-body)"

const slots = ["14 августа, 12:00–14:00", "14 августа, 16:00–18:00", "15 августа, 10:00–12:00"]

const ORDER_KEY = "flowlove-order"

type CheckoutForm = {
  lastName: string
  firstName: string
  phone: string
  email: string
  delivery: string
  address: string
  slot: string
  payment: string
  comment: string
  save: boolean
}

const emptyForm: CheckoutForm = {
  lastName: "",
  firstName: "",
  phone: "",
  email: "",
  delivery: "courier",
  address: "",
  slot: slots[0],
  payment: "cash",
  comment: "",
  save: false,
}

const sampleForm: CheckoutForm = {
  lastName: "Мельникова",
  firstName: "Арина",
  phone: "+375 (29) 777-78-79",
  email: "flowlove@gmail.com",
  delivery: "courier",
  address: "Минск, ул. Немига, 5",
  slot: slots[0],
  payment: "cash",
  comment: "Позвонить за 15 минут",
  save: false,
}

const PROFILE_KEY = "flowlove-checkout"

function readProfile(): CheckoutForm | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return null
    return { ...emptyForm, ...(parsed as Partial<CheckoutForm>) }
  } catch {
    return null
  }
}

function initialForm() {
  return readProfile() ?? (__FLOW_MODE__ === "DEV" ? sampleForm : emptyForm)
}

function unitPrice(product: CatalogProduct) {
  return Number(product.price.replace(/[^\d]/g, "")) || 0
}

function byn(value: number) {
  return `${value} BYN`
}

function useRemoteProducts() {
  const [remote, setRemote] = useState<CatalogProduct[]>([])
  useEffect(() => {
    let cancel = false
    fetch("/api/catalog")
      .then((response) => response.json())
      .then((data: { products?: CatalogProduct[] }) => {
        if (!cancel && Array.isArray(data.products)) setRemote(data.products)
      })
      .catch(() => {})
    return () => {
      cancel = true
    }
  }, [])
  return remote
}

function resolveLine(id: string, remote: CatalogProduct[]) {
  return remote.find((product) => product.id === id) ?? findCatalogProduct(id)
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-white text-[#3a342c]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

function Crumbs({ tail }: { tail: { label: string; href?: string }[] }) {
  const items = [
    { label: "Главная", href: "/#top" },
    { label: "Каталог", href: "/catalog" },
    { label: "Страница товара", href: "/catalog" },
    ...tail,
  ]
  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-[13px] leading-5 text-[#9c958c]"
      style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.045em" }}
    >
      {items.map((item, index) => {
        const current = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`}>
            {index > 0 ? " - " : null}
            {current || !item.href ? (
              <span className="text-[#4a463c]" aria-current={current ? "page" : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="hover:text-[#4a463c]">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

function Qty({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div
      className="inline-flex h-10 items-center gap-4 rounded-[8px] border border-[#e4dfd6] px-3 text-[15px]"
      style={{ fontFamily: sans, fontWeight: 300 }}
    >
      <button type="button" aria-label="Меньше" className="px-1" onClick={() => onChange(value - 1)}>
        −
      </button>
      <span className="min-w-4 text-center">{value}</span>
      <button type="button" aria-label="Больше" className="px-1" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  )
}

function NewSeal() {
  const reduce = useReducedMotion()
  return (
    <span className="pointer-events-none absolute top-0 right-0 z-10 block aspect-square w-[22%] translate-x-[32%] -translate-y-1/2" aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2">
        <path fill="#4a463c" d="M50 24 L52.4 46.2 L76 50 L52.4 53.8 L50 76 L47.6 53.8 L24 50 L47.6 46.2 Z" />
      </svg>
      <motion.span
        className="absolute inset-0 block"
        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
        transition={reduce ? { duration: 0 } : { duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <defs>
            <path id="cart-new-ring" d="M50,13 a37,37 0 1,1 -0.01,0" />
          </defs>
          <text fill="#4a463c" fontFamily='"PT Serif", "Times New Roman", serif' fontSize="11">
            <textPath href="#cart-new-ring" textLength="214" lengthAdjust="spacing">
              New New New New
            </textPath>
          </text>
        </svg>
      </motion.span>
    </span>
  )
}

function PromoField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <form
      className="mt-5 flex items-center border border-[#e4dfd6] px-3"
      onSubmit={(event) => {
        event.preventDefault()
        onChange(value.trim())
      }}
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ввести промокод"
        aria-label="Промокод"
        className="h-11 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#b0aaa2]"
        style={{ fontFamily: sans, fontWeight: 300 }}
      />
      <button type="submit" aria-label="Применить промокод" className="grid h-11 w-10 place-items-center text-[#3a342c]">
        →
      </button>
    </form>
  )
}

function OrderSummary({
  lines,
  remote,
  detailed,
  align,
  delivery,
  pending = false,
}: {
  lines: CartLine[]
  remote: CatalogProduct[]
  detailed: boolean
  align?: boolean
  delivery: string
  pending?: boolean
}) {
  const { setQuantity, promo, setPromo } = useCart()
  const navigate = useNavigate()
  const rows = lines.flatMap((line) => {
    const product = resolveLine(line.id, remote)
    return product ? [{ line, product, total: unitPrice(product) * line.quantity }] : []
  })
  const goods = rows.reduce((sum, row) => sum + row.total, 0)
  const shipping = deliveryCost(goods, delivery)

  return (
    <aside>
      <div className={`min-[769px]:sticky min-[769px]:top-[88px] min-[769px]:max-h-[calc(100vh-104px)] min-[769px]:overflow-auto ${align ? "min-[769px]:pt-8" : ""}`}>
      <p className="text-[16px]" style={{ fontFamily: sans, fontWeight: 400 }}>
        Ваш заказ:
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {rows.map(({ line, product, total }) =>
          detailed ? (
            <li key={line.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3">
              <img src={product.image} alt="" className="h-16 w-16 bg-[#f7f4ef] object-contain" />
              <div className="min-w-0">
                <p className="truncate text-[14px]" style={{ fontFamily: script }}>
                  «{product.name}»
                </p>
                <p className="text-[13px] text-[#6f675f]" style={{ fontFamily: sans, fontWeight: 300 }}>
                  {byn(total)}
                </p>
              </div>
              <Qty value={line.quantity} onChange={(next) => setQuantity(line.id, next)} />
            </li>
          ) : (
            <li key={line.id} className="flex items-end gap-2 text-[14px]" style={{ fontFamily: sans, fontWeight: 300 }}>
              <span className="shrink-0">«{product.name}»</span>
              <span className="mb-[5px] h-px min-w-4 flex-1 border-b border-dotted border-[#c8c2b8]" />
              <span className="shrink-0">{byn(total)}</span>
            </li>
          ),
        )}
      </ul>
      <PromoField value={promo} onChange={setPromo} />
      <div className="mt-4 flex items-center justify-between text-[14px]" style={{ fontFamily: sans, fontWeight: 300 }}>
        <span>Доставка</span>
        <span>{byn(shipping)}</span>
      </div>
      {detailed ? (
        <div className="mt-2 flex items-center justify-between text-[14px]" style={{ fontFamily: sans, fontWeight: 300 }}>
          <span>Сумма заказа</span>
          <span>{byn(goods)}</span>
        </div>
      ) : null}
      <div
        className={detailed ? "mt-4 flex items-center justify-between bg-[#e7e1d8] px-3 py-2.5 text-[15px]" : "mt-4 flex items-center justify-between text-[14px]"}
        style={{ fontFamily: sans, fontWeight: detailed ? 400 : 300 }}
      >
        <span>ИТОГО:</span>
        <span>{byn(goods + shipping)}</span>
      </div>
      {detailed ? (
        <SubmitOrder pending={pending || rows.length === 0} />
      ) : (
        <button
          type="button"
          className="mt-3 h-12 w-full bg-[#e4ddd2] text-[15px] text-[#3a342c] disabled:opacity-50"
          style={{ fontFamily: sans, fontWeight: 300 }}
          disabled={rows.length === 0}
          onClick={() => navigate("/checkout")}
        >
          Оформить заказ
        </button>
      )}
      </div>
    </aside>
  )
}

function SubmitOrder({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      form="checkout-form"
      disabled={pending}
      className="mt-3 h-12 w-full bg-[#e4ddd2] text-[15px] text-[#3a342c] disabled:opacity-50"
      style={{ fontFamily: sans, fontWeight: 300 }}
    >
      Оформить заказ
    </button>
  )
}

export function CartPage() {
  const { lines, count, setQuantity } = useCart()
  const remote = useRemoteProducts()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Shell>
      <section className="px-4 pt-6 pb-20 min-[769px]:px-[50px] min-[769px]:pt-2">
        <Crumbs tail={[{ label: "Корзина" }]} />
        <div className="mt-8 flex items-start gap-4">
          <h1 className="text-[#3a342c]" style={{ fontFamily: script, fontWeight: 400, fontSize: "clamp(72px, 8vw, 118px)", lineHeight: 0.85 }}>
            КОРЗИНА
          </h1>
          <p className="pt-3 text-[15px] text-[#8d877e]" style={{ fontFamily: sans, fontWeight: 300 }}>
            / {count}шт.
          </p>
        </div>

        {lines.length === 0 ? (
          <p className="mt-12 text-[16px] text-[#6f675f]" style={{ fontFamily: sans, fontWeight: 300 }}>
            В корзине пока пусто.{" "}
            <Link to="/catalog" className="underline">
              Перейти в каталог
            </Link>
          </p>
        ) : (
          <div className="mt-6 grid gap-12 min-[769px]:grid-cols-[minmax(0,1fr)_433px] min-[769px]:gap-x-6">
            <ul>
              {lines.map((line, index) => {
                const product = resolveLine(line.id, remote)
                if (!product) return null
                const last = index === lines.length - 1
                return (
                  <li key={line.id} className="grid grid-cols-1 gap-5 border-b border-[#ece8e1] py-8 min-[769px]:grid-cols-[minmax(0,1fr)_minmax(220px,400px)] min-[769px]:items-stretch min-[769px]:gap-10">
                    <div className="flex flex-col min-[769px]:h-full min-[769px]:justify-between">
                      <div>
                        <p className="text-[13px] text-[#b0aaa2]" style={{ fontFamily: sans, fontWeight: 300 }}>
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-4 text-[36px] leading-none" style={{ fontFamily: script }}>
                          «{product.name}»
                        </p>
                      </div>
                      <div className="mt-8">
                        <p className="text-[16px]" style={{ fontFamily: sans, fontWeight: 300 }}>
                          {byn(unitPrice(product) * line.quantity)}
                        </p>
                        <div className="mt-5">
                          <Qty value={line.quantity} onChange={(next) => setQuantity(line.id, next)} />
                        </div>
                      </div>
                    </div>
                    <div className="relative bg-[#f7f4ef]">
                      <img src={product.image} alt="" className="aspect-square w-full object-contain" />
                      {last ? <NewSeal /> : null}
                    </div>
                  </li>
                )
              })}
            </ul>
            <OrderSummary lines={lines} remote={remote} detailed={false} align delivery="courier" />
          </div>
        )}
      </section>
    </Shell>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block min-w-0">
      <span className="text-[12px] text-[#b0aaa2]" style={{ fontFamily: sans, fontWeight: 300 }}>
        {label}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full border-b border-[#e4dfd6] bg-transparent text-[15px] outline-none"
        style={{ fontFamily: sans, fontWeight: 300 }}
      />
    </label>
  )
}

export function CheckoutPage() {
  const { lines, promo } = useCart()
  const remote = useRemoteProducts()
  const navigate = useNavigate()
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [notice, setNotice] = useState("")
  const [pending, setPending] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (lines.length === 0) return <Navigate to="/cart" replace />

  const patch = (part: Partial<CheckoutForm>) => setForm((current) => ({ ...current, ...part }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (pending) return
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.email.trim()) {
      setNotice("Заполните данные получателя")
      return
    }
    if (form.delivery === "courier" && !form.address.trim()) {
      setNotice("Укажите адрес доставки")
      return
    }
    setNotice("")
    setPending(true)
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastName: form.lastName,
        firstName: form.firstName,
        phone: form.phone,
        email: form.email,
        delivery: form.delivery,
        address: form.address,
        slot: form.slot,
        payment: form.payment,
        comment: form.comment,
        promo,
        items: lines.map((line) => ({ id: line.id, quantity: line.quantity })),
      }),
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { id?: string; createdAt?: string } | null
        if (!response.ok || !data?.id || !data.createdAt) {
          setNotice("Не удалось оформить заказ")
          setPending(false)
          return
        }
        if (form.save) localStorage.setItem(PROFILE_KEY, JSON.stringify(form))
        const receipt = { id: data.id, createdAt: data.createdAt }
        sessionStorage.setItem(ORDER_KEY, JSON.stringify(receipt))
        navigate("/thanks", { state: receipt })
      })
      .catch(() => {
        setNotice("Не удалось оформить заказ")
        setPending(false)
      })
  }

  return (
    <Shell>
      <section className="px-4 pt-6 pb-20 min-[769px]:px-[50px] min-[769px]:pt-2">
        <Crumbs tail={[{ label: "Корзина", href: "/cart" }, { label: "Оформление заказа" }]} />
        <h1
          className="mt-8 text-[#3a342c]"
          style={{ fontFamily: script, fontWeight: 400, fontSize: "clamp(40px, 4.2vw, 64px)", lineHeight: 1 }}
        >
          ОФОРМЛЕНИЕ ЗАКАЗА
        </h1>
        <form id="checkout-form" className="mt-10 grid gap-12 min-[769px]:grid-cols-[minmax(0,1fr)_433px] min-[769px]:gap-16" onSubmit={submit}>
          <div className="flex flex-col">
            <Section index="01" title="ДАННЫЕ ПОЛУЧАТЕЛЯ">
              <div className="grid gap-4 min-[769px]:grid-cols-2">
                <Field label="Фамилия" required value={form.lastName} onChange={(lastName) => patch({ lastName })} />
                <Field label="Имя" required value={form.firstName} onChange={(firstName) => patch({ firstName })} />
                <Field label="Телефон" required value={form.phone} onChange={(phone) => patch({ phone })} />
                <Field label="Электронная почта" required type="email" value={form.email} onChange={(email) => patch({ email })} />
              </div>
            </Section>
            <Section index="02" title="АДРЕС И СПОСОБ ДОСТАВКИ">
              <label className="block">
                <span className="text-[12px] text-[#b0aaa2]" style={{ fontFamily: sans, fontWeight: 300 }}>
                  Способ доставки
                </span>
                <select
                  value={form.delivery}
                  onChange={(event) => patch({ delivery: event.target.value })}
                  className="mt-1 h-10 w-full border-b border-[#e4dfd6] bg-transparent text-[15px] outline-none"
                  style={{ fontFamily: sans, fontWeight: 300 }}
                >
                  {deliveryMethods.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {form.delivery === "courier" ? (
                <div className="mt-4">
                  <Field label="Адрес" required value={form.address} onChange={(address) => patch({ address })} />
                </div>
              ) : null}
            </Section>
            <Section index="03" title="ДАТА И ВРЕМЯ ДОСТАВКИ">
              <select
                value={form.slot}
                onChange={(event) => patch({ slot: event.target.value })}
                className="h-10 w-full border-b border-[#e4dfd6] bg-transparent text-[15px] outline-none"
                style={{ fontFamily: sans, fontWeight: 300 }}
              >
                {slots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </Section>
            <Section index="04" title="СПОСОБ ОПЛАТЫ">
              <select
                value={form.payment}
                onChange={(event) => patch({ payment: event.target.value })}
                className="h-10 w-full border-b border-[#e4dfd6] bg-transparent text-[15px] outline-none"
                style={{ fontFamily: sans, fontWeight: 300 }}
              >
                {paymentMethods.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Section>
            <Section index="05" title="КОММЕНТАРИЙ">
              <label className="block">
                <span className="text-[12px] text-[#b0aaa2]" style={{ fontFamily: sans, fontWeight: 300 }}>
                  Комментарий к заказу
                </span>
                <textarea
                  value={form.comment}
                  onChange={(event) => patch({ comment: event.target.value })}
                  rows={3}
                  className="mt-2 w-full resize-none border-b border-[#e4dfd6] bg-transparent text-[15px] outline-none"
                  style={{ fontFamily: sans, fontWeight: 300 }}
                />
              </label>
              <label className="mt-4 flex items-center gap-2 text-[14px]" style={{ fontFamily: sans, fontWeight: 300 }}>
                <input type="checkbox" checked={form.save} onChange={(event) => patch({ save: event.target.checked })} />
                Сохранить данные для следующих покупок
              </label>
              {notice ? <p className="mt-4 text-[14px] text-[#8d5b55]">{notice}</p> : null}
            </Section>
          </div>
          <OrderSummary lines={lines} remote={remote} detailed delivery={form.delivery} pending={pending} />
        </form>
      </section>
    </Shell>
  )
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[#ece8e1] py-6">
      <h2 className="mb-5 text-[12px] tracking-[0.14em] text-[#8d877e]" style={{ fontFamily: sans, fontWeight: 400 }}>
        {index} {title}
      </h2>
      {children}
    </section>
  )
}

function orderDate(iso: string) {
  return formatOrderDate(iso)
}

function readReceipt(state: unknown) {
  const source = state && typeof state === "object" ? state : null
  const stored = (() => {
    try {
      const raw = sessionStorage.getItem(ORDER_KEY)
      return raw ? (JSON.parse(raw) as unknown) : null
    } catch {
      return null
    }
  })()
  const receipt = source ?? stored
  if (!receipt || typeof receipt !== "object") return null
  const id = "id" in receipt && typeof receipt.id === "string" ? receipt.id : ""
  const createdAt = "createdAt" in receipt && typeof receipt.createdAt === "string" ? receipt.createdAt : ""
  if (!/^\d{3}-\d{2}-\d{2}$/.test(id) || !orderDate(createdAt)) return null
  return { id, createdAt }
}

export function ThanksPage() {
  const { clear } = useCart()
  const location = useLocation()
  const receipt = readReceipt(location.state)

  useEffect(() => {
    clear()
    window.scrollTo(0, 0)
  }, [clear])

  return (
    <Shell>
      <section className="px-4 pt-28 pb-24 text-center min-[769px]:px-[50px] min-[769px]:pt-36 min-[769px]:pb-48">
        <div className="relative mx-auto">
          <h1
            className="text-[#3a342c]"
            style={{ fontFamily: script, fontWeight: 400, fontSize: "clamp(76px, 13vw, 188px)", lineHeight: 0.84 }}
          >
            СП<span className="relative inline-block">А<img
                src="/flowers/thanks-lily.png?v=4"
                alt=""
                className="pointer-events-none absolute bottom-[74%] left-1/2 z-10 w-[clamp(96px,12.4vw,176px)] max-w-none -translate-x-1/2 select-none"
              /></span>СИБО
          </h1>
          <p
            className="mt-1 text-[#3a342c]"
            style={{ fontFamily: script, fontWeight: 400, fontSize: "clamp(46px, 7.1vw, 104px)", lineHeight: 0.9 }}
          >
            ЗА ЗАКАЗ
          </p>
        </div>
        <p className="mx-auto mt-16 text-[16px] leading-8 text-[#4a463c] min-[769px]:mt-20" style={{ fontFamily: sans, fontWeight: 300 }}>
          Ваш заказ успешно оформлен
          {receipt ? (
            <>
              <br />№ {receipt.id}
              <br />
              {orderDate(receipt.createdAt)}
            </>
          ) : null}
          <br />
          Желаете{" "}
          <Link to="/" className="underline decoration-[#4a463c] underline-offset-[3px]">
            вернуться на главную
          </Link>?
        </p>
      </section>
    </Shell>
  )
}
