import { useEffect, useState, type ReactNode } from "react"
import { CloseIcon, MenuIcon } from "./icons.tsx"

const headerIcons = [
  { src: "/flowers/icon-search.png", label: "Поиск" },
  { src: "/flowers/icon-user.png", label: "Аккаунт" },
  { src: "/flowers/icon-heart.png", label: "Избранное" },
  { src: "/flowers/icon-cart.png", label: "Корзина" },
]

const links = [
  { href: "#top", label: "Главная" },
  { href: "#catalog", label: "Галерея" },
]

function isPhone() {
  return window.matchMedia("(max-width: 768px), (max-device-width: 768px)").matches
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState(isPhone)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px), (max-device-width: 768px)")
    const update = () => setPhone(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="relative z-30 bg-white">
      <div className="grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-5 min-[769px]:flex min-[769px]:h-[72px] min-[769px]:items-center min-[769px]:justify-between min-[769px]:gap-0 min-[769px]:px-[50px]">
        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center text-ink"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-[16px] w-[38px]" />}
        </button>

        <a
          href="#top"
          className="justify-self-center text-center text-[18px] leading-none tracking-[0.08em] whitespace-nowrap text-ink min-[769px]:absolute min-[769px]:left-1/2 min-[769px]:-translate-x-1/2 min-[769px]:text-[30px] min-[769px]:tracking-[0.06em]"
          style={{ fontFamily: '"Cormorant SC", serif', fontWeight: 500 }}
        >
          FLOWLOVE
        </a>

        <div className="flex shrink-0 items-center gap-3 text-ink min-[769px]:gap-[28px]">
          {headerIcons.map((icon, index) =>
            phone && index < 2 ? null : (
              <HeaderButton key={icon.label} label={icon.label} desktopOnly={index < 2}>
                <img src={icon.src} alt="" className="h-[18px] w-[18px] min-[769px]:h-5 min-[769px]:w-5" />
              </HeaderButton>
            ),
          )}
        </div>
      </div>

      {open && (
        <nav id="site-menu" className="border-t border-line bg-white" aria-label="Разделы">
          <ul className="flex flex-col px-5 py-4 min-[769px]:px-[50px]">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2 font-heading text-3xl text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

function HeaderButton({
  label,
  desktopOnly = false,
  children,
}: {
  label: string
  desktopOnly?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-desktop-only={desktopOnly ? "" : undefined}
      className="grid place-items-center"
    >
      {children}
    </button>
  )
}
