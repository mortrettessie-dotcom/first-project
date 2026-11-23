import { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Link, useParams } from "react-router-dom"
import { Footer } from "../components/Footer.tsx"
import { Header } from "../components/Header.tsx"
import { alpinePoppy, catalogProducts, findCatalogProduct, pieceProducts, type CatalogProduct } from "../data/catalogProducts.ts"
import { useCart } from "../lib/cart.tsx"

const script = "var(--font-heading)"
const sans = "var(--font-body)"

const colors = [
  { id: "white", label: "белый", swatch: "#f7f4ee" },
  { id: "rose", label: "пыльная роза", swatch: "#e4c4c0" },
  { id: "sand", label: "песочный", swatch: "#e6d5c0" },
]

const complements = [
  {
    name: "Лилия",
    image: "/flowers/product/lily.jpg",
    text: "Благородные лилии с их выразительной формой идеально дополняют скромную красоту белого мака.",
  },
  {
    name: "Тюльпан",
    image: "/flowers/product/tulip.jpg",
    text: "Тюльпаны с их чистым силуэтом и белые маки создают гармоничный дуэт легкости и изящества.",
  },
  {
    name: "Пион",
    image: "/flowers/product/peony.jpg",
    text: "Пышные пионы с их мягкими лепестками создают роскошный фон для нежных, воздушных белых маков.",
  },
]

function galleryOf(product: CatalogProduct) {
  if (product.id === "piece-farfor") {
    return [
      "/flowers/product/farfor-white.jpg",
      "/flowers/product/farfor-rose.jpg?v=4",
      "/flowers/product/farfor-sand.jpg?v=4",
    ]
  }
  const sharp = ["/flowers/catalog/piece-tyulpan.jpg", "/flowers/catalog/piece-pion.jpg", "/flowers/catalog/piece-kalla.jpg"]
  const pool = product.id === alpinePoppy.id ? sharp : [product.image, ...sharp]
  const images: string[] = []
  for (const src of pool) {
    if (images.includes(src)) continue
    images.push(src)
    if (images.length === 3) break
  }
  return images
}

function resolveProduct(id: string, remote: CatalogProduct[]) {
  const pools = [remote, pieceProducts, [alpinePoppy], catalogProducts]
  for (const pool of pools) {
    const hit = pool.find((product) => product.id === id) ?? pool.find((product) => product.id === id.replace(/-\d+$/, ""))
    if (hit) return hit
  }
  return findCatalogProduct(id)
}

function money(price: string) {
  const number = price.replace(/[^\d]/g, "")
  return number ? `${number} BYN за шт.` : price
}

function othersFor(current: CatalogProduct) {
  return catalogProducts.filter((item) => item.id !== current.id)
}

function SuggestFace({ product }: { product: CatalogProduct }) {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <img src={product.image} alt="" className="aspect-[820/580] w-full bg-[#faf9f6] object-cover" />
    </Link>
  )
}

function SuggestCaption({ product }: { product: CatalogProduct }) {
  return (
    <p className="mt-3 text-left text-[13px] leading-5 text-[#4a453f]" style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}>
      <span>«{product.name}»</span>
      <span className="ml-3 max-[768px]:mt-0.5 max-[768px]:ml-0 max-[768px]:block">{product.price}</span>
    </p>
  )
}

function ScrollArrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const button = "grid h-11 w-11 place-items-center rounded-full border border-[#e4dfd6] text-[#3a342c]"
  return (
    <div className="flex items-center justify-center gap-2 self-center">
      <button type="button" className={button} aria-label="Предыдущие букеты" onClick={onPrev}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M14.5 6.5 9 12l5.5 5.5" />
        </svg>
      </button>
      <button type="button" className={button} aria-label="Следующие букеты" onClick={onNext}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M9.5 6.5 15 12l-5.5 5.5" />
        </svg>
      </button>
    </div>
  )
}

function SuggestSlide({ product, className }: { product: CatalogProduct; className: string }) {
  return (
    <div className={className}>
      <SuggestFace product={product} />
      <SuggestCaption product={product} />
    </div>
  )
}

function Suggestions({ current }: { current: CatalogProduct }) {
  const items = othersFor(current)
  const options = { loop: true, align: "start" as const, duration: 40, watchDrag: false }
  const [deskLeftRef, deskLeft] = useEmblaCarousel(options)
  const [deskRightRef, deskRight] = useEmblaCarousel(options)
  const [mobLeftRef, mobLeft] = useEmblaCarousel(options)
  const [mobRightRef, mobRight] = useEmblaCarousel(options)

  useEffect(() => {
    deskRight?.scrollTo(2, true)
  }, [deskRight])

  useEffect(() => {
    mobRight?.scrollTo(1, true)
  }, [mobRight])

  if (items.length === 0) return null

  const step = (direction: 1 | -1) => {
    const desktop = window.matchMedia("(min-width: 769px)").matches
    const pair = desktop ? [deskLeft, deskRight] : [mobLeft, mobRight]
    pair.forEach((api) => {
      if (direction > 0) api?.scrollNext()
      else api?.scrollPrev()
    })
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-x-3 min-[769px]:hidden">
        <div className="overflow-hidden" ref={mobLeftRef}>
          <div className="flex">
            {items.map((item) => (
              <SuggestSlide key={item.id} product={item} className="min-w-0 flex-[0_0_100%]" />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center self-stretch px-1 pb-8">
          <ScrollArrows onPrev={() => step(-1)} onNext={() => step(1)} />
        </div>
        <div className="overflow-hidden" ref={mobRightRef}>
          <div className="flex">
            {items.map((item) => (
              <SuggestSlide key={item.id} product={item} className="min-w-0 flex-[0_0_100%]" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-x-7 min-[769px]:grid">
        <div className="col-span-2 overflow-hidden" ref={deskLeftRef}>
          <div className="flex w-full -ml-7">
            {items.map((item) => (
              <SuggestSlide key={item.id} product={item} className="min-w-0 shrink-0 grow-0 basis-[calc(50%+0.875rem)] pl-7" />
            ))}
          </div>
        </div>
        <div className="col-start-3 row-start-1 flex items-center justify-center self-stretch px-2 pb-8">
          <ScrollArrows onPrev={() => step(-1)} onNext={() => step(1)} />
        </div>
        <div className="overflow-hidden" ref={deskRightRef}>
          <div className="flex w-full">
            {items.map((item) => (
              <SuggestSlide key={item.id} product={item} className="min-w-0 flex-[0_0_100%]" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function ProductGallery({
  images,
  label,
  onSelect,
}: {
  images: string[]
  label: string
  onSelect: (index: number) => void
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", loop: false, duration: 22 })
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const sync = () => {
      const index = emblaApi.selectedScrollSnap()
      setSelected(index)
      onSelect(index)
    }
    emblaApi.on("select", sync)
    sync()
    return () => {
      emblaApi.off("select", sync)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="relative h-[420px] overflow-hidden bg-[#fbfaf6] min-[769px]:h-full">
      <div className="h-full overflow-hidden" ref={emblaRef} aria-roledescription="карусель" aria-label={label}>
        <div className="flex h-full flex-col">
          {images.map((src, index) => {
            const rose = src.includes("farfor-rose")
            const sand = src.includes("farfor-sand")
            return (
              <div className="relative min-h-0 flex-[0_0_100%]" key={`${src}-${index}`}>
                {rose || sand ? (
                  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-x-0 top-6 bottom-0">
                    <img src={src} alt="" className="h-full w-full object-contain object-bottom" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 flex-col gap-3">
        {images.map((src, index) => (
          <button
            key={`${src}-dot-${index}`}
            type="button"
            aria-label={`Фото ${index + 1}`}
            aria-current={index === selected ? "true" : undefined}
            className="flex h-4 w-4 items-center justify-center"
            onMouseEnter={() => emblaApi?.scrollTo(index)}
            onFocus={() => emblaApi?.scrollTo(index)}
          >
            <span className={`block h-1.5 w-1.5 rounded-full ${index === selected ? "bg-[#3a342c]" : "bg-[#c8c2b8]"}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ProductPage() {
  const { id = "" } = useParams()
  const [remote, setRemote] = useState<CatalogProduct[]>([])
  const [loaded, setLoaded] = useState(false)
  const product = resolveProduct(id, remote)
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [color, setColor] = useState("white")
  const [, setSlide] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    setQty(1)
    setAdded(false)
    setLiked(false)
    setColor("white")
    setSlide(0)
  }, [id])

  useEffect(() => {
    let cancel = false
    fetch("/api/catalog")
      .then((response) => response.json())
      .then((data: { products?: CatalogProduct[] }) => {
        if (!cancel && Array.isArray(data.products)) setRemote(data.products)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancel) setLoaded(true)
      })
    return () => {
      cancel = true
    }
  }, [])

  if (!product && !loaded) {
    return (
      <div className="min-h-svh bg-paper text-ink">
        <Header />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-svh bg-paper text-ink">
        <Header />
        <main className="px-4 py-16 min-[769px]:px-[50px]">
          <p style={{ fontFamily: sans }}>Такого товара нет.</p>
          <Link to="/catalog" className="mt-4 inline-block underline">
            В каталог
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const images = galleryOf(product)
  const farfor = product.id === "piece-farfor"
  const alpine = product.id === alpinePoppy.id
  const portrait = farfor ? "/flowers/product/edge-poppy.jpg" : alpine ? "/flowers/product/poppy.jpg" : product.image
  const titleLines = alpine ? ["Мак", "Альпийский"] : product.name.split(" ")
  const soldOut = product.status === "soldout"
  const colorLabel = colors.find((item) => item.id === color)?.label ?? "белый"
  const lead = farfor ? "Фарфор прекрасен в своей простоте," : alpine ? "Белый мак прекрасен в своей простоте," : `«${product.name}» хорош и сам по себе,`
  const rest =
    farfor || alpine
      ? " но в сочетании с другими цветами смотрится изысканнее. Стильные дополнения придают объём, свежие оттенки дарят гармонию, а вместе они создают надёжную, выразительную красоту."
      : " а рядом с другими цветами звучит ещё точнее. Дополнения дают объём, свежие оттенки собирают гармонию, и вместе получается спокойная, выразительная красота."
  const rows = farfor
    ? complements.map((item) => ({
        ...item,
        text: item.text
          .replace("белого мака", "фарфора")
          .replace("белые маки", "фарфор")
          .replace("нежных, воздушных белых маков", "нежного, воздушного фарфора"),
      }))
    : complements

  return (
    <div className="min-h-svh bg-paper text-ink max-[768px]:overflow-x-clip">
      <Header />
      <main>
        <section className="bg-white px-4 pt-6 pb-16 min-[769px]:pt-0 min-[769px]:pr-0 min-[769px]:pb-20 min-[769px]:pl-[50px]">
          <nav
            aria-label="Хлебные крошки"
            className="mb-5 text-[13px] leading-5 text-[#9c958c] min-[769px]:mb-7"
            style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.045em" }}
          >
            <a href="/#top" className="hover:text-[#4a463c]">
              Главная
            </a>
            <span> - </span>
            <Link to="/catalog" className="hover:text-[#4a463c]">
              Каталог
            </Link>
            <span> - </span>
            <span className="text-[#4a463c]" aria-current="page">
              Страница товара
            </span>
          </nav>

          <div className="grid items-stretch gap-8 min-[769px]:min-h-[560px] min-[769px]:grid-cols-[minmax(0,calc(50vw-50px))_minmax(0,1fr)] min-[769px]:gap-x-0">
            <div className="order-2 flex flex-col border-[#ece8e1] min-[769px]:order-1 min-[769px]:border-b min-[769px]:py-8 min-[769px]:pr-8">
              <h1
                className="text-[#3a342c]"
                style={{
                  fontFamily: script,
                  fontWeight: 400,
                  fontSize: "clamp(64px, 7.4vw, 112px)",
                  lineHeight: 1.05,
                  letterSpacing: 0,
                }}
              >
                {titleLines.map((word, index) => (
                  <span key={`${word}-${index}`} className="block">
                    {word}
                  </span>
                ))}
              </h1>
              <p className="mt-8 text-[18px] text-[#3a342c] min-[769px]:text-[20px]" style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.01em" }}>
                {product.status === "sale" && product.oldPrice ? (
                  <>
                    <span className="mr-3 line-through text-[#b0aaa2]">{money(product.oldPrice)}</span>
                    {money(product.price)}
                  </>
                ) : (
                  money(product.price)
                )}
              </p>
              <div className="mt-5 flex w-full items-center gap-4">
                <div
                  className="flex h-16 w-[188px] shrink-0 items-center justify-between rounded-[8px] border border-[#e4dfd6] px-5 text-[18px] text-[#3a342c]"
                  style={{ fontFamily: sans, fontWeight: 300 }}
                >
                  <button
                    type="button"
                    aria-label="Меньше"
                    className="px-1 text-[22px]"
                    onClick={() => {
                      setQty((value) => Math.max(1, value - 1))
                      setAdded(false)
                    }}
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    aria-label="Больше"
                    className="px-1 text-[22px]"
                    onClick={() => {
                      setQty((value) => value + 1)
                      setAdded(false)
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={soldOut}
                  className="h-16 min-w-0 flex-1 rounded-[8px] bg-[#e4ddd2] px-6 text-[17px] text-[#3a342c] disabled:cursor-default disabled:opacity-50"
                  style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.01em" }}
                  onClick={() => {
                    add(product.id, qty)
                    setQty(1)
                    setAdded(true)
                  }}
                >
                  {soldOut ? "Нет в наличии" : added ? "Добавлено" : "Добавить в корзину"}
                </button>
                <button
                  type="button"
                  aria-label={liked ? "Убрать из избранного" : "В избранное"}
                  aria-pressed={liked}
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-[8px] border border-[#e4dfd6] text-[#3a342c]"
                  onClick={() => setLiked((value) => !value)}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden>
                    <path d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9.1 6.2c1.3 0 2.4.6 2.9 1.6.5-1 1.6-1.6 2.9-1.6 2.3 0 4.1 1.8 4.1 4.7C19 15.6 12 20 12 20z" />
                  </svg>
                </button>
              </div>
              <p className="mt-7 text-[15px] text-[#3a342c]" style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.01em" }}>
                Цвет: {colorLabel}
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                {colors.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.label}
                    aria-pressed={color === item.id}
                    className={`h-7 w-7 rounded-full border ${color === item.id ? "border-[#c8c2b8]" : "border-transparent"}`}
                    style={{ background: item.swatch, boxShadow: item.id === "white" && color !== item.id ? "inset 0 0 0 1px #e4dfd6" : undefined }}
                    onClick={() => setColor(item.id)}
                  />
                ))}
              </div>
              <p
                className="mt-8 max-w-[230px] text-[14px] leading-5 text-[#8d877e] min-[769px]:mt-auto min-[769px]:pt-10"
                style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.01em" }}
              >
                {farfor || alpine ? (
                  <>
                    {farfor ? "Фарфор" : "Альпийский мак"} — грация
                    <br />в каждом лепестке
                  </>
                ) : (
                  product.name
                )}
              </p>
            </div>
            <div className="order-1 min-h-[420px] min-[769px]:order-2 min-[769px]:min-h-0">
              <ProductGallery key={product.id} images={images} label={product.name} onSelect={setSlide} />
            </div>
          </div>

          <p
            className="mt-12 text-[16px] leading-[1.45] text-[#4a463c] min-[769px]:mt-16 min-[769px]:mr-[50px] min-[769px]:text-[28px] min-[769px]:leading-[1.4]"
            style={{ fontFamily: sans, letterSpacing: 0 }}
          >
            <span className="mr-[1.4em] align-baseline text-[12px] text-[#9c968e] min-[769px]:text-[13px]" style={{ fontWeight: 300 }}>
              Чем дополнить
            </span>
            <span style={{ fontWeight: 500 }}>{lead}</span>
            <span style={{ fontWeight: 400 }}>{rest}</span>
          </p>

          <div className="mt-8 grid items-center gap-8 min-[769px]:mt-14 min-[769px]:mr-[50px] min-[769px]:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] min-[769px]:gap-x-8">
            <img src={portrait} alt="" className="w-full max-w-[460px] min-[769px]:-ml-[50px]" />
            <ul>
              {rows.map((item, index) => (
                <li
                  key={item.name}
                  className={`grid grid-cols-[76px_minmax(0,1fr)_92px] items-start gap-3 py-4 min-[769px]:grid-cols-[92px_minmax(0,1fr)_108px] min-[769px]:gap-5 min-[769px]:py-5 ${index > 0 ? "border-t border-[#e6e1d8]" : ""}`}
                >
                  <span className="text-[16px] text-[#3a342c] min-[769px]:text-[18px]" style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}>
                    {item.name}
                  </span>
                  <span
                    className="text-[12px] leading-[1.35] text-[#8a847c] min-[769px]:text-[13px]"
                    style={{ fontFamily: sans, fontWeight: 300, letterSpacing: 0 }}
                  >
                    {item.text}
                  </span>
                  <img src={item.image} alt="" className="aspect-square w-full bg-[#f7f4ef] object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="bg-white px-4 pt-2 pb-16 min-[769px]:px-[50px] min-[769px]:pt-4 min-[769px]:pb-24">
          <h2
            className="text-[#3a342c]"
            style={{
              fontFamily: script,
              fontWeight: 400,
              fontSize: "clamp(36px, 3.5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: 0,
            }}
          >
            Вам может понравиться
          </h2>
          <Suggestions key={product.id} current={product} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
