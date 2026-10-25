const sans = "var(--font-body)"
const display = "var(--font-heading)"

const species = [
  { name: "Пион", image: "/flowers/cards/pion.jpg", width: "w-[15%]" },
  { name: "Калла", image: "/flowers/cards/kalla.jpg", width: "w-[18%]" },
  { name: "Ранункулюс", image: "/flowers/cards/ranunkulyus.jpg", width: "w-[14%]" },
  { name: "Тюльпан", image: "/flowers/cards/tyulpan.jpg", width: "w-[14%]" },
  { name: "Мак", image: "/flowers/cards/mak.jpg", width: "w-[16%]" },
]

const categories = [
  { name: "Монобукеты", image: "/flowers/cards/monobukety.jpg", width: "w-[16.9%]", inset: "0" },
  { name: "Композиции в коробках", image: "/flowers/cards/kompozicii.jpg?v=2", width: "w-[20.8%]", inset: "10%" },
  { name: "Букет невесты", image: "/flowers/cards/buket-nevesty.jpg?v=2", width: "w-[19.6%]", inset: "7%" },
  { name: "Авторские букеты", image: "/flowers/cards/avtorskie.jpg?v=2", width: "w-[31.5%]", inset: "2%" },
]

function FlowerCard({
  name,
  image,
  width,
  inset = "0",
}: {
  name: string
  image: string
  width: string
  inset?: string
}) {
  return (
    <figure className={width}>
      <img src={image} alt={name} className="block h-auto w-full" />
      <figcaption
        className="mt-3 block w-full p-0 text-left text-[13px] text-[#4a453f]"
        style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0, marginLeft: inset }}
      >
        {name}
      </figcaption>
    </figure>
  )
}

export function Catalog() {
  return (
    <section id="catalog" className="scroll-mt-4 bg-white px-[50px] pb-8">
      <div className="flex items-start justify-between">
        {species.map((item) => (
          <FlowerCard key={item.name} {...item} />
        ))}
      </div>

      <div className="pt-16 pb-6 text-center">
        <h2
          className="text-[#3c3832]"
          style={{
            fontFamily: display,
            fontWeight: 400,
            fontSize: "clamp(88px, 7.4vw, 156px)",
            lineHeight: 0.9,
            letterSpacing: 0,
          }}
        >
          Галерея цветов
        </h2>
        <div className="mx-auto w-[28%]">
          <p
            className="mt-8 text-[15px] leading-[1.85] text-[#5c564e]"
            style={{ fontFamily: sans, textAlign: "justify", textAlignLast: "justify" }}
          >
            Эксклюзивные букеты для особых моментов.
            <br />
            Идеальные композиции, которые подчеркнут
            <br />
            ваши эмоции и улучшат настроение
          </p>
          <a
            href="#catalog"
            className="mt-8 flex w-full items-center justify-between rounded-full border border-[#e7c5cb] px-6 py-2.5 text-[15px] text-[#3a342c]"
            style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
          >
            В каталог
            <span aria-hidden="true" className="text-[#d7a8b2]">
              →
            </span>
          </a>
        </div>
      </div>

      <div className="flex items-end justify-between">
        {categories.map((item) => (
          <FlowerCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  )
}
