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
    <section id="contacts" className="scroll-mt-4 bg-white px-[50px] pt-8 pb-20 text-[#3a342c]">
      <div className="grid grid-cols-2 gap-16">
        <div>
          <h2
            style={{
              fontFamily: display,
              fontWeight: 400,
              fontSize: "clamp(72px, 7vw, 128px)",
              lineHeight: 0.9,
              letterSpacing: 0,
            }}
          >
            Контакты
          </h2>
          <div className="mt-16 space-y-1 text-[16px] leading-7" style={{ fontFamily: sans }}>
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

        <div className="border-l border-[#eceae6] pl-12">
          <div className="pt-52">
            {sent ? (
            <p className="text-[22px] leading-8" style={{ fontFamily: sans }}>
              Спасибо. Мы ответим вам в ближайшее время.
            </p>
          ) : (
            <>
              <h3 className="text-[22px] font-medium" style={{ fontFamily: sans, letterSpacing: 0 }}>
                Остались вопросы или нужна помощь?
              </h3>
              <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-[#5c564e]" style={{ fontFamily: sans }}>
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
                  style={{ fontFamily: sans }}
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
