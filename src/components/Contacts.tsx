import { useState, type FormEvent } from "react"

const field =
  "absolute border-0 bg-transparent px-1 text-[clamp(14px,1.05vw,18px)] text-ink outline-none placeholder:text-transparent focus:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#cfc8bf] [&:not(:placeholder-shown)]:bg-white"

export function Contacts() {
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section id="contacts" className="scroll-mt-4 bg-white px-[50px] pb-0">
      <div className="relative">
        <img
          src="/flowers/contacts-frame.jpg?v=1"
          alt="Контакты: г. Минск, ул. Флористов 220, flowlove@gmail.com, +375 (29) -777-78-79"
          className="block w-full"
        />
        <a
          href="mailto:flowlove@gmail.com"
          className="absolute"
          style={{ left: "4.5%", top: "40%", width: "16%", height: "2.4%" }}
          aria-label="Написать на flowlove@gmail.com"
        />
        <a
          href="tel:+375297777879"
          className="absolute"
          style={{ left: "4.5%", top: "43.5%", width: "16%", height: "2.4%" }}
          aria-label="Позвонить +375 (29) -777-78-79"
        />

        {sent ? (
          <p
            className="absolute flex items-center bg-white px-2 text-[clamp(16px,1.2vw,22px)] text-ink"
            style={{ left: "51%", top: "58%", width: "45%", height: "38%" }}
          >
            Спасибо. Мы ответим вам в ближайшее время.
          </p>
        ) : (
          <form onSubmit={onSubmit}>
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
              style={{ left: "51.4%", top: "58.8%", width: "44.1%", height: "4.6%" }}
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
              className={field}
              style={{ left: "51.4%", top: "67%", width: "44.1%", height: "4.6%" }}
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
              className={field}
              style={{ left: "51.4%", top: "75.1%", width: "44.1%", height: "4.6%" }}
            />
            <button
              type="submit"
              className="absolute cursor-pointer bg-transparent text-transparent focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#cfc8bf]"
              style={{ left: "51.6%", top: "89.2%", width: "44.8%", height: "5.7%" }}
            >
              Отправить
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
