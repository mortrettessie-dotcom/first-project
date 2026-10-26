import type { ReactNode } from "react"

const sans = "var(--font-body)"

const items: { index: string; title: string; text: ReactNode }[] = [
  {
    index: "01",
    title: "Территория",
    text: (
      <>
        Доставка осуществляется <br className="min-[769px]:hidden" />по всей территории Минска <br className="min-[769px]:hidden" />в пределах МКАД
      </>
    ),
  },
  {
    index: "02",
    title: "Стоимость",
    text: (
      <>
        Доставка по Минску 15 рублей, бесплатная доставка <br className="min-[769px]:hidden" />от 100 рублей
      </>
    ),
  },
  {
    index: "03",
    title: "Время",
    text: (
      <>
        Доставка осуществляется ежедневно{"\n"}с 9:00 до 21:00 <br className="min-[769px]:hidden" />по указанному времени
      </>
    ),
  },
]

export function Delivery() {
  return (
    <section id="delivery" className="scroll-mt-4 bg-white px-5 pt-12 pb-14 text-[#3a342c] min-[769px]:px-[50px] min-[769px]:pt-16 min-[769px]:pb-20">
      <h2
        className="pb-2 whitespace-nowrap text-[#3c3832] min-[769px]:hidden"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          fontSize: "var(--title-delivery, 42px)",
          lineHeight: 0.9,
          letterSpacing: 0,
        }}
      >
        Доставка
      </h2>
      <h2
        className="hidden pb-4 text-[22px] font-normal min-[769px]:block"
        style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
      >
        Доставка
      </h2>
      <div className="border-t border-[#eceae6]">
        <div className="w-full min-[769px]:ml-auto min-[769px]:w-[58%]">
          {items.map((item) => (
            <article key={item.index} className="border-b border-[#eceae6] py-8">
              <div className="flex items-end justify-between gap-4 min-[769px]:items-start min-[769px]:gap-8">
                <div>
                  <h3 className="text-[18px]" style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}>
                    <span className="mr-2 text-[#8d877f]">/{item.index}</span>
                    {item.title}
                  </h3>
                  <p
                    className="mt-3 max-w-[220px] text-[14px] leading-5 whitespace-normal text-[#5c564e] min-[769px]:max-w-[280px] min-[769px]:text-[14px] min-[769px]:leading-6 min-[769px]:whitespace-pre-line"
                    style={{ fontFamily: sans }}
                  >
                    {item.text}
                  </p>
                </div>
                <a
                  href="#delivery"
                  className="shrink-0 text-[14px] underline"
                  style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
                >
                  Подробнее
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
