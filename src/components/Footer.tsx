import { SocialLinks } from "./SocialLinks.tsx"

const sans = "var(--font-body)"
const wordmarkFont = '"Cormorant SC", serif'
const script = "var(--font-script)"

const menu = [
  { label: "Каталог", href: "#catalog" },
  { label: "Оплата и доставка", href: "#delivery" },
  { label: "Отзывы", href: "#bestsellers" },
  { label: "Контакты", href: "#contacts" },
]

const wordmark = {
  fontFamily: wordmarkFont,
  fontWeight: 400,
  fontSize: "21.3cqw",
  lineHeight: 0.68,
  letterSpacing: "-0.07em",
} as const

export function Footer() {
  return (
    <>
    <footer className="relative overflow-hidden bg-white px-5 pt-12 pb-6 text-[#3a342c] min-[769px]:hidden">
      <div className="text-[#3d392f]">
        <p
          style={{
            fontFamily: wordmarkFont,
            fontWeight: 400,
            fontSize: "clamp(58px, 16.8vw, 72px)",
            lineHeight: 0.8,
            letterSpacing: "0.06em",
          }}
        >
          FLOW
          <span
            className="relative top-[0.06em] ml-[0.04em] inline-block align-middle"
            style={{
              fontFamily: script,
              fontWeight: 400,
              fontSize: "0.62em",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            with
          </span>
        </p>
        <p
          className="mt-1 text-right"
          style={{
            fontFamily: wordmarkFont,
            fontWeight: 400,
            fontSize: "clamp(58px, 16.8vw, 72px)",
            lineHeight: 0.8,
            letterSpacing: "0.06em",
          }}
        >
          LOVE
        </p>
      </div>

      <SocialLinks className="mt-12 justify-start" iconSize={36} gap={12} />

      <div className="relative mt-10">
        <div
          className="relative z-[2] max-w-[230px] text-[15px] leading-6 text-[#4a453f]"
          style={{ fontFamily: sans, letterSpacing: 0 }}
        >
          <p className="font-medium text-[#3a342c]">Контакты</p>
          <p className="mt-4">Ежедневно с 9:00 до 23:00</p>
          <p>г. Минск</p>
          <p>
            <a href="tel:+375297777879">+ 375 (29)-777-78-79</a>
          </p>
          <p>
            <a href="mailto:flowlove@gmail.com">flowlove@gmail.com</a>
          </p>
          <p className="mt-10 font-medium text-[#3a342c]">Меню</p>
          <ul className="mt-4">
            {menu.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <img
          src="/flowers/footer-lily-edge.png"
          alt=""
          className="pointer-events-none absolute -right-5 bottom-0 z-[1] w-[58%] max-w-none"
        />
      </div>

      <div className="relative z-[2] mt-8 border-t border-[#e6e1da] pt-4">
        <p className="text-[14px] text-[#8a847c]" style={{ fontFamily: sans }}>
          Все права защищены
        </p>
      </div>
    </footer>

    <footer
      className="relative hidden overflow-hidden bg-white text-[#3a342c] min-[769px]:block"
      style={{ aspectRatio: "1798 / 1271", containerType: "inline-size" }}
    >
      <a
        href="#top"
        aria-label="Наверх"
        className="absolute z-10 grid place-items-center rounded-full border border-[#3a342c]"
        style={{ top: "4.7%", right: "3.5%", width: "3.06cqw", height: "3.06cqw", fontSize: "1.15cqw" }}
      >
        ↑
      </a>

      <p className="absolute top-[4.2%] left-[3.4%] z-[3] text-[#3d392f]" style={wordmark}>
        FLOW
        <span
          className="absolute text-[#3d392f]"
          style={{
            left: "100%",
            bottom: "-1.7cqw",
            fontFamily: script,
            fontWeight: 400,
            fontSize: "0.432em",
            lineHeight: 1,
            letterSpacing: 0,
          }}
        >
          with
        </span>
      </p>
      <p className="absolute top-[26.4%] left-[47.5%] z-[3] text-[#3d392f]" style={wordmark}>
        LOVE
      </p>

      <img
        src="/flowers/footer-lily.png?v=7"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-[2] w-[68%] max-w-none"
      />

      <div className="absolute top-[53%] left-[67.8%] z-[3] flex items-start" style={{ gap: "3.5cqw" }}>
        <SocialLinks iconSize="2.5cqw" gap="0.45cqw" />
        <div
          className="text-[#4a453f]"
          style={{
            fontFamily: sans,
            width: "16.5cqw",
            fontSize: "1.08cqw",
            lineHeight: 2,
            letterSpacing: 0,
          }}
        >
          <p className="font-medium text-[#3a342c]">Контакты</p>
          <p style={{ marginTop: "1cqw" }}>Ежедневно с 9:00 до 23:00</p>
          <p>г. Минск</p>
          <p>
            <a href="tel:+375297777879">+ 375 (29)-777-78-79</a>
          </p>
          <p>
            <a href="mailto:flowlove@gmail.com">flowlove@gmail.com</a>
          </p>
          <p className="font-medium text-[#3a342c]" style={{ marginTop: "2.7cqw" }}>
            Меню
          </p>
          <ul style={{ marginTop: "0.95cqw" }}>
            {menu.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute top-[92.4%] left-[51.5%] z-[3] w-[40%]">
        <div className="h-px bg-[#e3e3e3]" />
        <p className="pt-3 text-[14px] text-[#8a847c]" style={{ fontFamily: sans }}>
          Все права защищены
        </p>
      </div>
    </footer>
    </>
  )
}
