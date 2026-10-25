import type { CSSProperties, ReactNode } from "react"

const socials: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.92 9.59H20.08L22.02 11.15 22.41 11.92V20.08L22.02 20.85 20.08 22.41H11.92L9.98 20.85 9.59 20.08V11.92L9.98 11.15 11.54 9.98ZM20.08 11.92 19.3 11.54 18.52 12.7 19.69 13.48 20.46 12.31ZM17.75 13.09 17.36 12.7H14.64L12.7 14.64V17.36L14.64 19.3H17.36L19.3 17.36V14.64L18.14 13.48ZM15.42 13.86H16.58L17.75 14.64 18.14 15.42 17.75 17.36 16.58 18.14H15.42L14.25 17.36 13.86 15.42 14.25 14.64 15.03 14.25Z"
      />
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path
        fill="currentColor"
        d="M16.18 9.58H19.48V11.42H18.02L16.92 12.52V13.98L17.28 14.35H19.48L19.12 16.55H17.28L16.92 16.92V22.42H14.72V16.92L14.35 16.55H12.52V14.35H14.35L14.72 13.98V11.05L15.82 9.95Z"
      />
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me",
    icon: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M21.24 10.37H22.41V13.09L22.02 13.48V15.81L21.63 16.19V18.52L21.24 18.91V20.85L20.85 21.63 18.91 21.24 15.42 18.52V17.75L18.52 14.64 18.91 13.86 18.52 13.48 12.7 17.36 9.59 16.19 9.98 15.42 13.86 13.48H14.64L20.08 10.76H20.85Z"
      />
    ),
  },
  {
    label: "ВКонтакте",
    href: "https://vk.com",
    icon: (
      <path
        fill="currentColor"
        d="M14.18 12.2H16.82L17.16 12.86 16.82 13.52V15.18L17.48 16.16 19.13 14.18 19.8 12.54H22.44L22.1 13.86 20.45 16.16V16.82L21.78 18.14 22.44 19.13V19.79H19.8L19.13 19.46 18.14 18.14 17.16 18.48 16.82 19.79H14.84L13.52 19.13 11.22 16.49 9.57 13.2V12.54H11.88L12.87 14.84 14.18 16.16 14.84 15.18V13.52L14.18 12.54Z"
      />
    ),
  },
]

export function SocialLinks({
  className = "",
  style,
  iconSize = 32,
  gap = 12,
}: {
  className?: string
  style?: CSSProperties
  iconSize?: number | string
  gap?: number | string
}) {
  return (
    <ul className={`flex items-center ${className}`} style={{ gap, ...style }}>
      {socials.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className="block text-[#3a342c]"
          >
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 32 32"
              fill="none"
              shapeRendering="geometricPrecision"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="15.2" fill="none" stroke="currentColor" strokeWidth="0.7" />
              {item.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
