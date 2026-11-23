import { useState, type FormEvent } from "react"
import { sendApplication } from "../lib/applications.ts"

const sans = "var(--font-body)"
const display = "var(--font-heading)"

const field =
  "w-full border-0 border-b border-[#e4e0da] bg-transparent py-3 text-[16px] text-[#3a342c] outline-none placeholder:text-[#8a847c]"

export function Contacts() {
  const [status, setStatus] = useState<"form" | "sending" | "success" | "error">("form")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setStatus("sending")
    try {
      await sendApplication({
        source: "Главная — Контакты",
        name: String(data.get("name") ?? ""),
        surname: String(data.get("surname") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
      })
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contacts" className="scroll-mt-4 bg-white px-5 pt-8 pb-16 text-[#3a342c] min-[769px]:px-[50px] min-[769px]:pb-20">
      <div className="grid grid-cols-1 gap-10 min-[769px]:grid-cols-2 min-[769px]:gap-16">
        <div>
          <h2
            className="whitespace-nowrap"
            style={{
              fontFamily: display,
              fontWeight: 400,
              fontSize: "var(--title-contacts, clamp(72px, 7vw, 128px))",
              lineHeight: 0.9,
              letterSpacing: 0,
            }}
          >
            Контакты
          </h2>
          <div className="mt-8 space-y-1 text-[16px] leading-7 min-[769px]:mt-16" style={{ fontFamily: sans }}>
            <p>г. Минск, ул. Флористов 220</p>
            <p>
              <a href="mailto:flowlove@gmail.com" className="underline-offset-2 hover:underline">
                flowlove@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:+375297777879" className="underline-offset-2 hover:underline">
                +375 (29)-777-78-79
              </a>
            </p>
          </div>
        </div>

        <div className="min-[769px]:border-l min-[769px]:border-[#eceae6] min-[769px]:pl-12">
          <div className="min-[769px]:pt-52">
            {status === "success" ? (
            <FormNotice
              tone="success"
              title="Спасибо за ваш ответ!"
              text="В ближайшее время Вам отправят ответ на указанную почту"
              onClose={() => setStatus("form")}
            />
          ) : status === "error" ? (
            <FormNotice
              tone="error"
              title="К сожалению, что-то пошло не так :("
              text="Проверьте указанную Вами почту"
              onClose={() => setStatus("form")}
            />
          ) : (
            <>
              <h3
                className="max-w-[240px] text-[22px] leading-7 font-medium min-[769px]:max-w-none min-[769px]:text-[22px] min-[769px]:leading-normal"
                style={{ fontFamily: sans, letterSpacing: 0 }}
              >
                Остались вопросы или нужна помощь?
              </h3>
              <p className="mt-4 max-w-[520px] text-[15px] leading-6 text-[#5c564e] min-[769px]:hidden" style={{ fontFamily: sans }}>
                Напишите нам — поможем с выбором букета, уточним детали доставки или ответим<br />на любые вопросы. Рады вам в любое время!
              </p>
              <p className="mt-4 hidden max-w-[520px] text-[15px] leading-7 text-[#5c564e] min-[769px]:block" style={{ fontFamily: sans }}>
                Напишите нам — поможем с выбором букета, уточним детали доставки
                <br />
                или ответим на любые вопросы. Рады вам в любое время!
              </p>
              <form onSubmit={onSubmit} className="mt-10">
                <label className="sr-only" htmlFor="contact-name">
                  Имя
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="given-name"
                  placeholder="Имя*"
                  className={field}
                  style={{ fontFamily: sans }}
                />
                <label className="sr-only" htmlFor="contact-surname">
                  Фамилия
                </label>
                <input
                  id="contact-surname"
                  name="surname"
                  required
                  autoComplete="family-name"
                  placeholder="Фамилия*"
                  className={`${field} mt-6`}
                  style={{ fontFamily: sans }}
                />
                <label className="sr-only" htmlFor="contact-phone">
                  Номер телефона
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="Номер телефона*"
                  className={`${field} mt-6`}
                  style={{ fontFamily: sans }}
                />
                <label className="sr-only" htmlFor="contact-email">
                  Электронная почта
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Электронная почта*"
                  className={`${field} mt-6`}
                  style={{ fontFamily: sans }}
                />
                <label className="sr-only" htmlFor="contact-message">
                  Сообщение
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={3}
                  autoComplete="off"
                  placeholder="Сообщение"
                  className={`${field} mt-6 resize-none`}
                  style={{ fontFamily: sans }}
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-10 w-full cursor-pointer bg-[#e6e2d8] py-4 text-[16px] text-[#3a342c] disabled:cursor-wait"
                  style={{ fontFamily: sans, fontWeight: 500 }}
                >
                  {status === "sending" ? "Отправка..." : "Отправить"}
                </button>
              </form>
            </>
          )}
          </div>
        </div>
      </div>
    </section>
  )
}

function FormNotice({
  tone,
  title,
  text,
  onClose,
}: {
  tone: "success" | "error"
  title: string
  text: string
  onClose: () => void
}) {
  return (
    <div>
      <h3 className="text-[22px] leading-7 font-medium" style={{ fontFamily: sans, letterSpacing: 0 }}>
        {title}
      </h3>
      <p className="mt-4 max-w-[520px] text-[15px] leading-6 text-[#5c564e]" style={{ fontFamily: sans }}>
        {text}
      </p>
      <div className="mt-10 flex justify-center" aria-hidden="true">
        {tone === "success" ? <SuccessMark /> : <ErrorMark />}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-10 w-full cursor-pointer bg-[#e6e2d8] py-4 text-[16px] text-[#3a342c]"
        style={{ fontFamily: sans, fontWeight: 500 }}
      >
        Закрыть
      </button>
    </div>
  )
}

function SuccessMark() {
  return (
    <svg viewBox="0 0 88 88" className="h-28 w-28 text-[#21a84a]">
      <circle cx="44" cy="44" r="34" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M28 46.5 38.5 57 60 33" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ErrorMark() {
  return (
    <svg viewBox="0 0 88 88" className="h-28 w-28 text-[#e1262d]">
      <circle cx="44" cy="44" r="34" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M33 33 55 55M55 33 33 55" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
