const sans = "var(--font-body)"
const display = "var(--font-heading)"

const cards = [
  {
    name: "Белоснежка",
    price: "190 byn",
    image: "/flowers/cards/belosnezhka.jpg",
    className: "col-span-6",
  },
  {
    name: "Нежные розы",
    price: "110 byn",
    image: "/flowers/cards/nezhnye-rozy.jpg",
    className: "",
  },
  {
    name: "Радость весны",
    price: "250 byn",
    image: "/flowers/cards/radost-vesny.jpg",
    className: "",
  },
  {
    name: "Волшебный сад",
    price: "150 byn",
    image: "/flowers/cards/volshebny-sad.jpg",
    className: "col-span-3",
  },
  {
    name: "Сет любви",
    price: "210 byn",
    image: "/flowers/cards/set-lyubvi.jpg",
    className: "col-span-6 col-start-7",
  },
  {
    name: "Мечта",
    price: "130 byn",
    image: "/flowers/cards/mechta.jpg",
    className: "col-span-3 col-start-7",
  },
  {
    name: "Летний сад",
    price: "220 byn",
    image: "/flowers/cards/letniy-sad.jpg",
    className: "col-span-3 col-start-10",
  },
]

function Star() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 shrink-0 text-[#c98990]">
      <path fill="currentColor" d="M6 0.4 7.15 4.85 11.6 6 7.15 7.15 6 11.6 4.85 7.15 0.4 6 4.85 4.85Z" />
    </svg>
  )
}

function Card({
  name,
  price,
  image,
  className,
  stacked = false,
  wide = false,
}: {
  name: string
  price: string
  image: string
  className: string
  stacked?: boolean
  wide?: boolean
}) {
  return (
    <article className={className}>
      {stacked && !wide ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-[#f6f5f0]">
          <img src={image} alt="" className="h-full w-full object-cover object-center" />
        </div>
      ) : (
        <img src={image} alt="" className="block h-auto w-full" />
      )}
      {stacked && wide ? (
        <p
          className="mt-2 text-left text-[14px] leading-5 text-[#4a453f]"
          style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
        >
          <span>«{name}»</span>
          <span className="ml-3">{price}</span>
        </p>
      ) : stacked ? (
        <p
          className="mt-2 text-left text-[14px] leading-5 text-[#4a453f]"
          style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
        >
          «{name}»
          <span className="mt-0.5 block">{price}</span>
        </p>
      ) : (
        <p
          className="mt-2 w-full p-0 text-left text-[13px] whitespace-nowrap text-[#4a453f]"
          style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
        >
          «{name}»
          <span className="ml-5">{price}</span>
        </p>
      )}
    </article>
  )
}

export function Bestsellers() {
  return (
    <section id="bestsellers" className="scroll-mt-4 bg-white px-4 pb-14 min-[769px]:px-[50px] min-[769px]:pb-16">
      <h2
        className="text-[#3c3832]"
        style={{
          fontFamily: display,
          fontWeight: 400,
          fontSize: "var(--title-bestsellers, clamp(64px, 6.2vw, 108px))",
          lineHeight: 0.9,
          letterSpacing: 0,
        }}
      >
        Бестселлеры
      </h2>
      <p
        className="mt-4 max-w-[340px] text-[15px] leading-6 text-[#5c564e] min-[769px]:hidden"
        style={{ fontFamily: sans, letterSpacing: 0 }}
      >
        Проверенные букеты для важных моментов:
        <br />
        свиданий, праздников и особых случаев
      </p>
      <p
        className="mt-4 flex w-full items-center justify-between pb-1 text-[15px] text-[#5c564e] min-[769px]:mt-6 min-[769px]:w-auto min-[769px]:justify-start min-[769px]:gap-3 min-[769px]:border-b min-[769px]:border-[#eceae6] min-[769px]:pb-3 min-[769px]:text-[14px]"
        style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
      >
        <span>Свежие</span>
        <Star />
        <span>Стильные</span>
        <Star />
        <span>Надежные</span>
      </p>

      <div className="mt-6 grid grid-cols-2 items-end gap-x-5 gap-y-8 min-[769px]:hidden">
        <Card stacked {...cards[1]} className="" />
        <Card stacked {...cards[2]} className="" />
        <Card stacked wide {...cards[0]} className="col-span-2" />
        <Card stacked {...cards[3]} className="" />
        <Card stacked {...cards[6]} className="" />
        <Card stacked wide {...cards[4]} className="col-span-2" />
      </div>

      <div className="mt-10 hidden space-y-12 min-[769px]:block">
        <div className="grid grid-cols-12 items-stretch gap-x-7">
          <Card {...cards[0]} />
          <div className="col-span-6 flex flex-col">
            <div className="grid grid-cols-2 gap-x-7">
              <Card {...cards[1]} />
            </div>
            <div className="mt-auto grid grid-cols-2 gap-x-7 pt-6">
              <div />
              <Card {...cards[2]} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 items-start gap-x-7">
          <Card {...cards[3]} />
          <Card {...cards[4]} />
        </div>

        <div className="grid grid-cols-12 items-end gap-x-7">
          <p
            className="col-span-4 text-[14px] leading-6 text-[#5c564e]"
            style={{ fontFamily: sans }}
          >
            Цветочная формула идеального свидания, праздника
            <br />
            и важного события
          </p>
          <Card {...cards[5]} />
          <Card {...cards[6]} />
        </div>
      </div>
    </section>
  )
}
