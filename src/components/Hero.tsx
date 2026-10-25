import { motion, useReducedMotion } from "motion/react"
import { SocialLinks } from "./SocialLinks.tsx"

const badgePlace = {
  left: "20.89%",
  top: "50.92%",
  width: "13.99%",
} as const

const wordmark = '"Cormorant SC", serif'
const script = "var(--font-script)"
const sans = "var(--font-body)"

function BouquetBadge({ reduce }: { reduce: boolean }) {
  return (
    <>
      <img
        src="/flowers/badge-star-still.png?v=1"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-0 block h-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        style={badgePlace}
      />
      <motion.a
        href="#catalog"
        aria-label="Выбрать свой букет"
        className="absolute z-0 block"
        style={{ ...badgePlace, x: "-50%", y: "-50%" }}
        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
        transition={reduce ? { duration: 0 } : { duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 217 217" className="block h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <path id="bouquet-ring" d="M108.5,30.5a78,78 0 1,1 -0.01,0" />
          </defs>
          <text
            fill="#1a1a1a"
            fontFamily='"PT Serif", "Times New Roman", serif'
            fontSize="13.5"
            fontWeight="400"
            letterSpacing="0.01em"
          >
            <textPath href="#bouquet-ring" textLength="490" lengthAdjust="spacing">
              Выбрать свой букет · Выбрать свой букет ·
            </textPath>
          </text>
        </svg>
      </motion.a>
    </>
  )
}

export function Hero() {
  const reduce = useReducedMotion() ?? false

  return (
    <section id="top" className="bg-white px-[50px]">
      <div
        className="relative mx-auto w-full"
        style={{ aspectRatio: "1551 / 982", containerType: "inline-size" }}
      >
        <p
          className="absolute text-[#3d392f]"
          style={{
            left: "2.6%",
            top: "1.6%",
            fontFamily: wordmark,
            fontWeight: 500,
            fontSize: "19.15cqw",
            lineHeight: 0.7,
            letterSpacing: "0.09em",
          }}
        >
          FLOWERS
        </p>
        <BouquetBadge reduce={reduce} />
        <img
          src="/flowers/hero-bouquet.png?v=24"
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        />
        <p
          className="absolute z-[3] text-[#3d392f]"
          style={{
            left: "69.2%",
            top: "27.6%",
            fontFamily: script,
            fontSize: "5.6cqw",
            lineHeight: 1,
          }}
        >
          for you
        </p>
        <p
          className="absolute z-[3] text-center text-[#3a342c]"
          style={{
            left: "37%",
            top: "80%",
            width: "26%",
            fontFamily: sans,
            fontWeight: 300,
            fontSize: "1.05cqw",
            lineHeight: 1.35,
            letterSpacing: 0,
          }}
        >
          Наши букеты — это не просто цветы, а уникальные композиции, созданные с любовью
        </p>
        <SocialLinks
          className="absolute z-[3]"
          style={{ left: "43.9%", top: "92.2%" }}
          iconSize="2.64cqw"
          gap="0.56cqw"
        />
      </div>
    </section>
  )
}
