const sans = "var(--font-body)"

const items = [
  {
    index: "01",
    title: "Территория",
    text: "Доставка осуществляется по всей территории Минска в пределах МКАД",
  },
  {
    index: "02",
    title: "Стоимость",
    text: "Доставка по Минску 15 рублей, бесплатная доставка от 100 рублей",
  },
  {
    index: "03",
    title: "Время",
    text: "Доставка осуществляется ежедневно\nс 9:00 до 21:00 по указанному времени",
  },
]

export function Delivery() {
  return (
    <section id="delivery" className="scroll-mt-4 bg-white px-[50px] pt-16 pb-20 text-[#3a342c]">
      <h2
        className="pb-4 text-[22px] font-normal"
        style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
      >
        Доставка
      </h2>
      <div className="border-t border-[#eceae6]">
        <div className="ml-auto w-[58%]">
          {items.map((item) => (
            <article key={item.index} className="border-b border-[#eceae6] py-8">
              <div className="flex items-start justify-between gap-8">
                <div>
                  <h3 className="text-[18px]" style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}>
                    <span className="mr-2 text-[#8d877f]">/{item.index}</span>
                    {item.title}
                  </h3>
                  <p
                    className="mt-3 max-w-[280px] text-[14px] leading-6 whitespace-pre-line text-[#5c564e]"
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
