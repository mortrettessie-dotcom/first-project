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

function BouquetBadge({
  reduce,
  place = badgePlace,
  ringId = "bouquet-ring",
}: {
  reduce: boolean
  place?: { left: string; top: string; width: string }
  ringId?: string
}) {
  return (
    <>
      <img
        src="/flowers/badge-star-still.png?v=1"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-0 block h-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        style={place}
      />
      <motion.a
        href="#catalog"
        aria-label="Выбрать свой букет"
        className="absolute z-0 block"
        style={{ ...place, x: "-50%", y: "-50%" }}
        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
        transition={reduce ? { duration: 0 } : { duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 217 217" className="block h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <path id={ringId} d="M108.5,30.5a78,78 0 1,1 -0.01,0" />
          </defs>
          <text
            fill="#1a1a1a"
            fontFamily='"PT Serif", "Times New Roman", serif'
            fontSize="13.5"
            fontWeight="400"
            letterSpacing="0.01em"
          >
            <textPath href={`#${ringId}`} textLength="490" lengthAdjust="spacing">
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
    <section id="top" className="bg-white px-5 min-[769px]:px-[50px]">
      <div className="min-[769px]:hidden pt-1 pb-3">
        <div className="relative">
          <p
            className="relative z-[1] mb-[-0.34em] text-center text-[#3d392f]"
            style={{
              fontFamily: wordmark,
              fontWeight: 400,
              fontSize: "clamp(62px, 20vw, 156px)",
              lineHeight: 0.78,
              letterSpacing: 0,
            }}
          >
            FLOWERS
          </p>
          <div className="relative z-[2]">
            <div className="relative overflow-hidden" style={{ aspectRatio: "942 / 672" }}>
              <img
                src="/flowers/hero-bouquet.png?v=24"
                alt=""
                draggable={false}
                className="pointer-events-none absolute max-w-none"
                style={{ width: "164.65%", left: "-30.68%", top: "-18.75%" }}
              />
            </div>
            <p
              className="absolute top-[16%] -right-1 z-[3] text-[#3d392f]"
              style={{
                fontFamily: script,
                fontSize: "clamp(42px, 12.4vw, 56px)",
                lineHeight: 1,
              }}
            >
              for you
            </p>
          </div>
          <p
            className="relative z-[3] mx-auto mt-3 max-w-[268px] text-center text-[17px] leading-5 text-[#3a342c]"
            style={{ fontFamily: sans, fontWeight: 300, letterSpacing: 0 }}
          >
            Наши букеты — это не просто цветы, а уникальные композиции, созданные с любовью
          </p>
        </div>
        <SocialLinks className="mt-16 justify-center" iconSize={34} gap={14} />
      </div>

      <div
        className="relative mx-auto hidden w-full min-[769px]:block"
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
