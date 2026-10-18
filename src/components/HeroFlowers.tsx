import { motion, useReducedMotion } from "motion/react"

const flowers = [
  {
    src: "/flowers/hero-bloom.png",
    alt: "Крупный розовый цветок",
    className:
      "left-1/2 top-[8%] w-[min(42%,400px)] -translate-x-1/2",
    duration: 7.4,
    delay: 0,
    drift: 16,
    tilt: 2.4,
  },
  {
    src: "/flowers/hero-tulip.png",
    alt: "Розовый тюльпан",
    className: "left-[0%] top-[48%] w-[min(20%,170px)] sm:left-[6%]",
    duration: 6.2,
    delay: 0.35,
    drift: 12,
    tilt: -3,
  },
  {
    src: "/flowers/hero-tulip.png",
    alt: "",
    className:
      "right-[2%] top-[62%] w-[min(14%,120px)] sm:right-[11%]",
    duration: 8.1,
    delay: 0.7,
    drift: 10,
    tilt: 2.8,
    hidden: true,
  },
]

export function HeroFlowers() {
  const reduce = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden={reduce === true}>
      {flowers.map((flower) => (
        <motion.img
          key={flower.className}
          src={flower.src}
          alt={flower.alt}
          aria-hidden={flower.hidden || undefined}
          className={`absolute ${flower.className}`}
          animate={
            reduce
              ? { y: 0, rotate: 0, scaleX: flower.hidden ? -1 : 1 }
              : {
                  y: [0, -flower.drift, 0, flower.drift * 0.55, 0],
                  rotate: [-flower.tilt, flower.tilt, -flower.tilt],
                  scaleX: flower.hidden ? -1 : 1,
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: flower.duration,
                  delay: flower.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  )
}
