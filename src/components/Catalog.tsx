const sans = "var(--font-body)"
const display = "var(--font-heading)"

const species = [
  { name: "Пион", image: "/flowers/cards/pion.jpg", width: "w-full min-[769px]:w-[15%]" },
  { name: "Калла", image: "/flowers/cards/kalla.jpg", width: "w-full min-[769px]:w-[18%]" },
  { name: "Ранункулюс", image: "/flowers/cards/ranunkulyus.jpg", width: "w-full min-[769px]:w-[14%]" },
  { name: "Тюльпан", image: "/flowers/cards/tyulpan.jpg", width: "w-full min-[769px]:w-[14%]" },
  { name: "Мак", image: "/flowers/cards/mak.jpg", width: "w-full min-[769px]:w-[16%]" },
]

const categories = [
  { name: "Монобукеты", image: "/flowers/cards/monobukety.jpg", width: "w-full min-[769px]:w-[16.9%]", inset: "0" },
  { name: "Композиции в коробках", image: "/flowers/cards/kompozicii.jpg?v=2", width: "w-full min-[769px]:w-[20.8%]", inset: "10%" },
  { name: "Букет невесты", image: "/flowers/cards/buket-nevesty.jpg?v=2", width: "w-full min-[769px]:w-[19.6%]", inset: "7%" },
  { name: "Авторские букеты", image: "/flowers/cards/avtorskie.jpg?v=2", width: "w-full min-[769px]:w-[31.5%]", inset: "2%" },
]

function FlowerCard({
  name,
  image,
  width,
  inset = "0",
  plate = false,
  frame = false,
  drop = false,
}: {
  name: string
  image: string
  width: string
  inset?: string
  plate?: boolean
  frame?: boolean
  drop?: boolean
}) {
  return (
    <figure className={plate || frame ? "w-full" : width}>
      {plate ? (
        <div className="flex aspect-[168/173] w-full items-center justify-center overflow-hidden bg-[#f8f7f2]">
          <img src={image} alt={name} className="h-full w-auto max-w-full object-contain" />
        </div>
      ) : frame ? (
        <div
          className={`flex aspect-[168/156] w-full overflow-hidden bg-[#f8f7f2] ${drop ? "items-end justify-start" : "items-center justify-center"}`}
        >
          <img src={image} alt={name} className="max-h-full max-w-full object-contain object-left-bottom" />
        </div>
      ) : (
        <img src={image} alt={name} className="block h-auto w-full" />
      )}
      <figcaption
        className={`mt-2 block w-full p-0 text-left text-[15px] leading-5 whitespace-pre-line text-[#4a453f] max-[768px]:!ml-0 min-[769px]:mt-3 min-[769px]:min-h-0 min-[769px]:text-[13px] min-[769px]:whitespace-normal ${plate || frame ? "max-[768px]:min-h-10" : ""}`}
        style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0, marginLeft: inset }}
      >
        {name}
      </figcaption>
    </figure>
  )
}

export function Catalog() {
  return (
    <section id="catalog" className="scroll-mt-4 bg-white px-4 pt-6 pb-8 min-[769px]:px-[50px] min-[769px]:pt-0">
      <div className="grid grid-cols-2 items-end gap-x-5 pb-10 min-[769px]:hidden">
        <FlowerCard {...species[2]} image="/flowers/cards/ranunkulyus-plate.jpg" plate />
        <FlowerCard {...species[1]} image="/flowers/cards/kalla-plate.jpg" plate />
      </div>
      <div className="hidden min-[769px]:flex min-[769px]:items-start min-[769px]:justify-between">
        {species.map((item) => (
          <FlowerCard key={item.name} {...item} />
        ))}
      </div>

      <div className="pt-16 pb-6 text-center min-[769px]:pt-16">
        <h2
          className="text-[#3c3832] max-[768px]:whitespace-nowrap"
          style={{
            fontFamily: display,
            fontWeight: 400,
            fontSize: "var(--title-catalog, clamp(88px, 7.4vw, 156px))",
            lineHeight: 0.9,
            letterSpacing: 0,
          }}
        >
          Галерея цветов
        </h2>
        <div className="mx-auto w-full min-[769px]:w-[28%]">
          <p
            className="mt-5 text-center text-[14px] leading-6 text-[#5c564e] min-[769px]:mt-8 min-[769px]:text-[15px] min-[769px]:text-left min-[769px]:leading-[1.85]"
            style={{ fontFamily: sans }}
          >
            <span className="gallery-copy block min-[769px]:hidden">
              Эксклюзивные букеты для особых моментов. Идеальные композиции, которые подчеркнут эмоции
              <br />
              и улучшат настроение
            </span>
            <span className="hidden min-[769px]:block" style={{ textAlign: "justify", textAlignLast: "justify" }}>
              Эксклюзивные букеты для особых моментов.
              <br />
              Идеальные композиции, которые подчеркнут
              <br />
              ваши эмоции и улучшат настроение
            </span>
          </p>
          <a
            href="#catalog"
            className="mt-8 flex w-full items-center justify-between rounded-[6px] border border-[#e7c5cb] px-6 py-3.5 text-[15px] text-[#3a342c] min-[769px]:rounded-full min-[769px]:py-2.5"
            style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
          >
            В каталог
            <span aria-hidden="true" className="text-[#d7a8b2]">
              →
            </span>
          </a>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 items-start gap-x-5 min-[769px]:hidden">
        <FlowerCard {...categories[1]} image="/flowers/cards/kompozicii-plate.jpg" name={"Композиции\nв коробках"} inset="0" frame />
        <FlowerCard {...categories[2]} image="/flowers/cards/buket-nevesty-plate.jpg" inset="0" frame drop />
      </div>
      <div className="mt-10 hidden min-[769px]:flex min-[769px]:items-end min-[769px]:justify-between">
        {categories.map((item) => (
          <FlowerCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  )
}
