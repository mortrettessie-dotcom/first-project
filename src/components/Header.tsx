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

export function Header() {
  const [open, setOpen] = useState(false)

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
      <div className="flex h-[72px] items-center justify-between px-[50px]">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center text-ink"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-[16px] w-[38px]" />}
        </button>

        <a
          href="#top"
          className="absolute left-1/2 -translate-x-1/2 text-[30px] leading-none tracking-[0.06em] text-ink"
          style={{ fontFamily: '"Cormorant SC", serif', fontWeight: 500 }}
        >
          FLOWLOVE
        </a>

        <div className="flex items-center gap-[28px] text-ink">
          {headerIcons.map((icon) => (
            <HeaderButton key={icon.label} label={icon.label}>
              <img src={icon.src} alt="" className="h-5 w-5" />
            </HeaderButton>
          ))}
        </div>
      </div>

      {open && (
        <nav id="site-menu" className="border-t border-line bg-white" aria-label="Разделы">
          <ul className="flex flex-col px-[50px] py-4">
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

function HeaderButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} className="grid place-items-center">
      {children}
    </button>
  )
}
