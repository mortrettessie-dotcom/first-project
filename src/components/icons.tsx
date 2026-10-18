type IconProps = {
  className?: string
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 60 28" className={className} aria-hidden="true">
      <path d="M0 1.5h60M0 14h37M0 26.5h25" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" {...stroke} />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="5.4" {...stroke} />
      <path d="M14.1 14.1 18.6 18.6" {...stroke} />
    </svg>
  )
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="7.4" r="3.15" {...stroke} />
      <path d="M5 19.4h14v-2.7c0-2.2-2.8-3.6-7-3.6s-7 1.4-7 3.6v2.7z" {...stroke} />
    </svg>
  )
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 19.4c-.3-.2-6.6-4.1-6.6-8.6A3.5 3.5 0 0 1 8.9 7.2c1.2 0 2.2.6 3.1 1.7.9-1.1 1.9-1.7 3.1-1.7a3.5 3.5 0 0 1 3.5 3.6c0 4.5-6.3 8.4-6.6 8.6z"
        {...stroke}
      />
    </svg>
  )
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3.4 6.2h3.4" {...stroke} />
      <path d="M6.2 6.2 7.5 10.2h12.2L17.8 16.6H8.4L6.6 10" {...stroke} />
      <path d="M9.2 18.2v2.1M15.6 18.2v2.1" {...stroke} />
    </svg>
  )
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 12h15M14 6l6 6-6 6" {...stroke} />
    </svg>
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" {...stroke} />
      <circle cx="12" cy="12" r="3.4" {...stroke} />
      <circle cx="16.6" cy="7.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M14 8h2.2V5.2H14c-2.2 0-3.6 1.4-3.6 3.6V11H8.2V14H10.4v5h3.2v-5H16l.4-3h-2.8V9.1c0-.6.3-1.1 1.2-1.1z" fill="currentColor" />
    </svg>
  )
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5 11.5 18.2 6.2c.6-.2 1.1.3.9.9l-2.2 10.2c-.1.7-.9 1-1.4.6l-3.2-2.4-1.8 1.7c-.4.4-1.1.2-1.2-.4l-.4-2.8 6.4-5.7" {...stroke} />
    </svg>
  )
}

export function VkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M6 8.2h2.1c.1 3.2 1.5 5.1 2.6 5.8V8.2H13v3.4c1.1-.1 2.2-1.7 2.6-3.4H18c-.4 2.2-1.9 3.8-3 4.5 1.1.6 2.8 2 3.4 4.5h-2.3c-.5-1.6-1.7-2.8-3.1-3.2v3.2h-.3c-4.2 0-6.6-2.9-6.7-7.8z"
        fill="currentColor"
      />
    </svg>
  )
}
