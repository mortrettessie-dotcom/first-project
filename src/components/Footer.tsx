const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Telegram", href: "https://t.me" },
  { label: "ВКонтакте", href: "https://vk.com" },
]

const menu = [
  { label: "Каталог", href: "#catalog", top: "77.2%" },
  { label: "Оплата и доставка", href: "#delivery", top: "80.2%" },
  { label: "Отзывы", href: "#bestsellers", top: "83%" },
  { label: "Контакты", href: "#contacts", top: "86.2%" },
]

export function Footer() {
  return (
    <footer className="bg-white pr-[50px] pb-0 text-ink">
      <div className="relative">
        <img
          src="/flowers/footer-frame.jpg?v=5"
          alt="FLOW with LOVE. Ежедневно с 9:00 до 23:00, г. Минск, +375 (29)-777-78-79, flowlove@gmail.com. Все права защищены."
          className="block w-full"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute block"
          style={{
            left: "51.45%",
            top: "92.45%",
            width: "40%",
            height: "1px",
            backgroundColor: "#e3e3e3",
          }}
        />
        <a
          href="#top"
          aria-label="Наверх"
          className="absolute"
          style={{ left: "93.2%", top: "2%", width: "5.2%", height: "7.2%" }}
        />
        {socials.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className="absolute"
            style={{ left: `${68.2 + index * 2.55}%`, top: "52.6%", width: "2.4%", height: "4.4%" }}
          />
        ))}
        <a
          href="tel:+375297777879"
          aria-label="Позвонить +375 (29)-777-78-79"
          className="absolute"
          style={{ left: "83%", top: "63%", width: "14%", height: "2.2%" }}
        />
        <a
          href="mailto:flowlove@gmail.com"
          aria-label="Написать на flowlove@gmail.com"
          className="absolute"
          style={{ left: "83%", top: "66%", width: "14%", height: "2.2%" }}
        />
        {menu.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className="absolute"
            style={{ left: "82.8%", top: item.top, width: "14%", height: "2.8%" }}
          />
        ))}
      </div>
    </footer>
  )
}
