import { motion, useReducedMotion } from "motion/react"

const badgePlace = {
  left: "20.89%",
  top: "50.92%",
  width: "13.99%",
} as const

function BouquetBadge({ reduce }: { reduce: boolean }) {
  return (
    <>
      <img
        src="/flowers/badge-star-still.png?v=1"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-[1] block h-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        style={badgePlace}
      />
      <motion.a
        href="#catalog"
        aria-label="Выбрать свой букет"
        className="absolute z-[1] block"
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
      <div className="relative mx-auto w-full" style={{ aspectRatio: "1551 / 982" }}>
        <img
          src="/flowers/hero-still.jpg?v=1"
          alt="FLOWERS for you. Наши букеты — это не просто цветы, а уникальные композиции, созданные с любовью"
          className="block h-auto w-full"
        />
        <BouquetBadge reduce={reduce} />
        <img
          src="/flowers/badge-flowers.png?v=4"
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        />
      </div>
    </section>
  )
}
