import { useState, type FormEvent } from "react"

const sans = "var(--font-body)"
const display = "var(--font-heading)"

const field =
  "w-full border-0 border-b border-[#e4e0da] bg-transparent py-3 text-[16px] text-[#3a342c] outline-none placeholder:text-[#8a847c]"

export function Contacts() {
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
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
            {sent ? (
            <p className="text-[22px] leading-8" style={{ fontFamily: sans }}>
              Спасибо. Мы ответим вам в ближайшее время.
            </p>
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
                <button
                  type="submit"
                  className="mt-10 w-full cursor-pointer bg-[#e6e2d8] py-4 text-[16px] text-[#3a342c]"
                  style={{ fontFamily: sans, fontWeight: 500 }}
                >
                  Отправить
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
