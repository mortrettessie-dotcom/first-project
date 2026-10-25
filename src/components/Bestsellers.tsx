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

function Card({
  name,
  price,
  image,
  className,
}: {
  name: string
  price: string
  image: string
  className: string
}) {
  return (
    <article className={className}>
      <img src={image} alt="" className="block h-auto w-full" />
      <p
        className="mt-2 w-full p-0 text-left text-[13px] whitespace-nowrap text-[#4a453f]"
        style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
      >
        «{name}»
        <span className="ml-5">{price}</span>
      </p>
    </article>
  )
}

export function Bestsellers() {
  return (
    <section id="bestsellers" className="scroll-mt-4 bg-white px-[50px] pb-16">
      <h2
        className="text-[#3c3832]"
        style={{
          fontFamily: display,
          fontWeight: 400,
          fontSize: "clamp(64px, 6.2vw, 108px)",
          lineHeight: 0.9,
          letterSpacing: 0,
        }}
      >
        Бестселлеры
      </h2>
      <p
        className="mt-6 flex items-center gap-3 border-b border-[#eceae6] pb-3 text-[14px] text-[#5c564e]"
        style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
      >
        <span>Свежие</span>
        <span className="text-[#c98990]">+</span>
        <span>Стильные</span>
        <span className="text-[#c98990]">+</span>
        <span>Надежные</span>
      </p>

      <div className="mt-10 space-y-12">
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
