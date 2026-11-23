import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Link } from "react-router-dom"
import { Footer } from "../components/Footer.tsx"
import { Header } from "../components/Header.tsx"
import {
  catalogCategories,
  catalogProducts,
  pieceProducts,
  toCatalogPages,
  type CatalogCategory,
  type CatalogProduct,
  type CatalogStatus,
} from "../data/catalogProducts.ts"

const sans = "var(--font-body)"
const display = "var(--font-heading)"
const filterStyle = {
  fontFamily: sans,
  fontWeight: 300,
  fontSize: "16px",
  lineHeight: "19px",
  letterSpacing: "0.045em",
  color: "#4a463c",
}

function Chevron() {
  return (
    <svg viewBox="0 0 8 5" aria-hidden="true" className="ml-1 inline-block h-[5px] w-2 -translate-y-px">
      <path d="M0.6 0.8 L4 4.1 L7.4 0.8" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

function priceValue(product: CatalogProduct) {
  const match = product.price.match(/[\d]+(?:[.,]\d+)?/)
  return match ? Number(match[0].replace(",", ".")) : 0
}

function ProductLink({
  product,
  className = "block text-inherit",
  children,
}: {
  product?: CatalogProduct
  className?: string
  children: ReactNode
}) {
  if (!product) return <div className={className}>{children}</div>
  return (
    <Link to={`/product/${product.id}`} className={className}>
      {children}
    </Link>
  )
}

const occasionOptions = [
  { id: "march8", label: "8 марта" },
  { id: "birthday", label: "День рождения" },
  { id: "wedding", label: "Свадьба" },
  { id: "anniversary", label: "Годовщина" },
]

function repeatCatalog(items: CatalogProduct[], count = 18) {
  if (items.length === 0) return []
  return Array.from({ length: count }, (_, index) => {
    const source = items[index % items.length]
    return { ...source, id: `${source.id}-${index}` }
  })
}

type PriceSort = "catalog" | "asc" | "desc"

function SortControl({
  value,
  onChange,
  open,
  onOpenChange,
}: {
  value: PriceSort
  onChange: (value: PriceSort) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  useEffect(() => {
    if (!open) return
    const close = () => onOpenChangeRef.current(false)
    window.addEventListener("pointerdown", close)
    return () => window.removeEventListener("pointerdown", close)
  }, [open])
  const options: { id: PriceSort; label: string }[] = [
    { id: "catalog", label: "Цене" },
    { id: "asc", label: "Сначала дешевле" },
    { id: "desc", label: "Сначала дороже" },
  ]
  return (
    <div className="relative shrink-0" onPointerDown={(event) => event.stopPropagation()}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => onOpenChange(!open)}
        className="cursor-pointer whitespace-nowrap"
        style={filterStyle}
      >
        Сортировать по: Цене
        <Chevron />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Сортировка по цене"
          className="absolute top-full right-0 z-10 mt-2 min-w-full bg-white py-1 text-left shadow-[0_8px_24px_rgba(60,56,50,0.12)]"
        >
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.id}
                onClick={() => {
                  onChange(option.id)
                  onOpenChange(false)
                }}
                className="block w-full cursor-pointer px-3 py-1.5 text-left whitespace-nowrap"
                style={{
                  ...filterStyle,
                  textDecoration: value === option.id ? "underline" : "none",
                  textUnderlineOffset: 4,
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function categoryStyle(active: boolean) {
  return {
    ...filterStyle,
    color: active ? "#2a261f" : filterStyle.color,
    textDecoration: active ? "underline" : "none",
    textUnderlineOffset: "5px",
  }
}

function CategoryMenu({
  label,
  options,
  value,
  open,
  active,
  onOpenChange,
  onSelect,
}: {
  label: string
  options: { id: string; label: string }[]
  value: string | null
  open: boolean
  active: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (id: string) => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  const [place, setPlace] = useState({ top: 0, left: 0 })
  useEffect(() => {
    if (!open) return
    const close = () => onOpenChangeRef.current(false)
    const placeMenu = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const next = { top: rect.bottom + 8, left: rect.left }
      setPlace((current) => (current.top === next.top && current.left === next.left ? current : next))
    }
    placeMenu()
    window.addEventListener("pointerdown", close)
    window.addEventListener("resize", placeMenu)
    window.addEventListener("scroll", placeMenu, true)
    return () => {
      window.removeEventListener("pointerdown", close)
      window.removeEventListener("resize", placeMenu)
      window.removeEventListener("scroll", placeMenu, true)
    }
  }, [open])
  return (
    <div className="relative shrink-0" onPointerDown={(event) => event.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => onOpenChange(!open)}
        className="cursor-pointer whitespace-nowrap"
        style={categoryStyle(active)}
      >
        {label}
        <Chevron />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="fixed z-20 min-w-[180px] bg-white py-1 text-left shadow-[0_8px_24px_rgba(60,56,50,0.12)]"
          style={{ top: place.top, left: place.left }}
        >
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.id}
                onClick={() => onSelect(option.id)}
                className="block w-full cursor-pointer px-3 py-1.5 text-left whitespace-nowrap"
                style={{
                  ...filterStyle,
                  textDecoration: value === option.id ? "underline" : "none",
                  textUnderlineOffset: 4,
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

const statusLabel: Record<CatalogStatus, string> = {
  sale: "скидка",
  soldout: "нет в наличии",
  hit: "хит",
}

function Caption({ product }: { product?: CatalogProduct }) {
  if (!product) return null
  const caption = { fontFamily: sans, fontWeight: 400, letterSpacing: 0 }
  return (
    <p className="mt-3 w-full p-0 text-left text-[13px] leading-5 text-[#4a453f]" style={caption}>
      <span>«{product.name}»</span>
      <span className="ml-3 max-[768px]:mt-0.5 max-[768px]:ml-0 max-[768px]:block">
        {product.status === "soldout" ? (
          statusLabel.soldout
        ) : product.status === "sale" && product.oldPrice ? (
          <>
            <span className="line-through">{product.oldPrice}</span>
            <span className="ml-2">{product.price}</span>
          </>
        ) : (
          product.price
        )}
      </span>
    </p>
  )
}

const cardColor = "#faf9f6"

type PreparedPaper = {
  cutout: HTMLCanvasElement
  source: HTMLImageElement
  subject: { left: number; top: number; right: number; bottom: number }
}

const preparedPapers = new Map<string, PreparedPaper>()

function preparePaper(img: HTMLImageElement): PreparedPaper {
  const cached = preparedPapers.get(img.src)
  if (cached) return cached
  const width = img.naturalWidth
  const height = img.naturalHeight
  const scratch = document.createElement("canvas")
  scratch.width = width
  scratch.height = height
  const context = scratch.getContext("2d", { willReadFrequently: true })
  const full = { left: 0, top: 0, right: width - 1, bottom: height - 1 }
  if (!context) {
    return { cutout: scratch, source: img, subject: full }
  }
  context.drawImage(img, 0, 0)
  const pixels = context.getImageData(0, 0, width, height).data
  const mask = new Uint8Array(width * height)
  const corners = [2, 2, width - 3, 2, 2, height - 3, width - 3, height - 3]
  let red = 0
  let green = 0
  let blue = 0
  for (let index = 0; index < corners.length; index += 2) {
    const offset = (corners[index + 1] * width + corners[index]) * 4
    red += pixels[offset]
    green += pixels[offset + 1]
    blue += pixels[offset + 2]
  }
  red /= 4
  green /= 4
  blue /= 4
  const paperAt = (x: number, y: number) => {
    const offset = (y * width + x) * 4
    const r = pixels[offset]
    const g = pixels[offset + 1]
    const b = pixels[offset + 2]
    return (
      Math.max(r, g, b) - Math.min(r, g, b) <= 22 &&
      Math.abs(r - red) <= 16 &&
      Math.abs(g - green) <= 16 &&
      Math.abs(b - blue) <= 16
    )
  }
  const queue: number[] = []
  const mark = (x: number, y: number) => {
    const index = y * width + x
    if (mask[index] || !paperAt(x, y)) return
    mask[index] = 1
    queue.push(index)
  }
  for (let x = 0; x < width; x++) {
    mark(x, 0)
    mark(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    mark(0, y)
    mark(width - 1, y)
  }
  let head = 0
  while (head < queue.length) {
    const index = queue[head++]
    const x = index % width
    const y = (index - x) / width
    if (x > 0) mark(x - 1, y)
    if (x + 1 < width) mark(x + 1, y)
    if (y > 0) mark(x, y - 1)
    if (y + 1 < height) mark(x, y + 1)
  }
  const expanded = new Uint8Array(mask)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x
      if (!mask[index]) continue
      if (x > 0) expanded[index - 1] = 1
      if (x + 1 < width) expanded[index + 1] = 1
      if (y > 0) expanded[index - width] = 1
      if (y + 1 < height) expanded[index + width] = 1
    }
  }
  const image = context.getImageData(0, 0, width, height)
  const cut = image.data
  const rowCount = new Uint32Array(height)
  const columnCount = new Uint32Array(width)
  for (let index = 0; index < expanded.length; index++) {
    if (expanded[index]) {
      cut[index * 4] = 250
      cut[index * 4 + 1] = 249
      cut[index * 4 + 2] = 246
      cut[index * 4 + 3] = 0
      continue
    }
    const offset = index * 4
    const distance =
      Math.abs(cut[offset] - 250) + Math.abs(cut[offset + 1] - 249) + Math.abs(cut[offset + 2] - 246)
    if (distance <= 36) continue
    columnCount[index % width] += 1
    rowCount[(index - (index % width)) / width] += 1
  }
  const solid = 8
  let left = 0
  let top = 0
  let right = width - 1
  let bottom = height - 1
  while (left < width && columnCount[left] < solid) left += 1
  while (right > left && columnCount[right] < solid) right -= 1
  while (top < height && rowCount[top] < solid) top += 1
  while (bottom > top && rowCount[bottom] < solid) bottom -= 1
  context.putImageData(image, 0, 0)
  const found = left < width && top < height && right >= left && bottom >= top
  const prepared = {
    cutout: scratch,
    source: img,
    subject: found ? { left, top, right, bottom } : full,
  }
  preparedPapers.set(img.src, prepared)
  return prepared
}

function paintCard(canvas: HTMLCanvasElement, prepared: PreparedPaper, width: number, height: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const bitmapWidth = Math.max(1, Math.round(width * dpr))
  const bitmapHeight = Math.max(1, Math.round(height * dpr))
  canvas.width = bitmapWidth
  canvas.height = bitmapHeight
  const context = canvas.getContext("2d")
  if (!context) return
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.fillStyle = cardColor
  context.fillRect(0, 0, bitmapWidth, bitmapHeight)
  const sourceWidth = prepared.source.naturalWidth
  const sourceHeight = prepared.source.naturalHeight
  const scale = Math.min(bitmapWidth / sourceWidth, bitmapHeight / sourceHeight)
  const drawWidth = sourceWidth * scale
  const drawHeight = sourceHeight * scale
  const { left, right, bottom } = prepared.subject
  const offsetX = bitmapWidth / 2 - ((left + right + 1) / 2) * scale
  const offsetY = bitmapHeight - (bottom + 1) * scale
  context.drawImage(prepared.cutout, offsetX, offsetY, drawWidth, drawHeight)
}

function Photo({ product, aspect, fill = false }: { product?: CatalogProduct; aspect?: string; fill?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || !product) return
    let stopped = false
    let prepared: PreparedPaper | null = null
    const image = new Image()
    image.decoding = "async"
    const draw = () => {
      if (stopped || !prepared) return
      const width = wrap.clientWidth
      const height = wrap.clientHeight
      if (width < 2 || height < 2) return
      paintCard(canvas, prepared, width, height)
    }
    image.onload = () => {
      if (stopped) return
      prepared = preparePaper(image)
      draw()
    }
    image.src = product.image
    const observer = new ResizeObserver(draw)
    observer.observe(wrap)
    return () => {
      stopped = true
      observer.disconnect()
    }
  }, [product?.image])

  if (!product) return null
  return (
    <div
      role="img"
      aria-label={product.name}
      className={`relative overflow-hidden bg-[#faf9f6] ${fill ? "h-full w-full" : ""}`}
      style={fill ? undefined : { aspectRatio: aspect }}
      ref={wrapRef}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {product.status ? (
        <span
          className="absolute top-3 left-3 z-10 bg-white/90 px-2 py-0.5 text-[12px] leading-5 text-[#4a453f]"
          style={{ fontFamily: sans, fontWeight: 400, letterSpacing: 0 }}
        >
          {statusLabel[product.status]}
        </span>
      ) : null}
    </div>
  )
}

function MoreBadge({ reduce, onClick }: { reduce: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Смотреть больше"
      className="relative h-[88px] w-[88px] cursor-pointer min-[769px]:h-[13.8vw] min-[769px]:w-[13.8vw]"
    >
      <img
        src="/flowers/badge-star-still.png?v=1"
        alt=""
        draggable={false}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2"
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block"
        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
        transition={reduce ? { duration: 0 } : { duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 199 199" className="block h-full w-full overflow-visible">
          <defs>
            <path id="catalog-more-ring" d="M99.5,26 a73.5,73.5 0 1,1 -0.01,0" />
          </defs>
          <text
            fill="#1a1a1a"
            fontFamily='"PT Serif", "Times New Roman", serif'
            fontSize="13"
            fontWeight="400"
            letterSpacing="0.01em"
          >
            <textPath href="#catalog-more-ring" textLength="460" lengthAdjust="spacing">
              Смотреть больше · Смотреть больше ·
            </textPath>
          </text>
        </svg>
      </motion.span>
    </button>
  )
}

function CatalogGrid({
  products,
  reduce,
  more,
  onMore,
}: {
  products: CatalogProduct[]
  reduce: boolean
  more: boolean
  onMore: () => void
}) {
  const [gracia, izyaschestvo, nezhnostWhite, favorit, klassika, garmoniya, zefir, pudrovaya, belosnezhka] = products

  return (
    <div className="mt-10 flex flex-col gap-14 min-[769px]:mt-[6vw] min-[769px]:gap-[10vw]">
      <div className="min-[769px]:hidden">
        <ProductLink product={gracia}>
          <Photo product={gracia} aspect="170 / 122" />
          <Caption product={gracia} />
        </ProductLink>
        {izyaschestvo || nezhnostWhite ? (
          <div className={`mt-8 grid gap-4 ${izyaschestvo && nezhnostWhite ? "grid-cols-2" : "grid-cols-1"}`}>
            {izyaschestvo ? (
              <ProductLink product={izyaschestvo}>
                <Photo product={izyaschestvo} aspect="80 / 60" />
                <Caption product={izyaschestvo} />
              </ProductLink>
            ) : null}
            {nezhnostWhite ? (
              <ProductLink product={nezhnostWhite}>
                <Photo product={nezhnostWhite} aspect="82 / 60" />
                <Caption product={nezhnostWhite} />
              </ProductLink>
            ) : null}
          </div>
        ) : null}
      </div>

      {izyaschestvo || nezhnostWhite ? (
      <div className="hidden min-[769px]:block">
        <div className="relative w-full" style={{ aspectRatio: "348 / 122" }}>
          <div className="absolute top-0 left-0 h-full w-[48.85%]">
            <ProductLink product={gracia} className="block h-full text-inherit">
              <Photo product={gracia} aspect="170 / 122" fill />
            </ProductLink>
          </div>
          <div className="absolute top-0 left-[51.15%] w-[22.99%]">
            <ProductLink product={izyaschestvo}>
              <Photo product={izyaschestvo} aspect="80 / 60" />
              <Caption product={izyaschestvo} />
            </ProductLink>
          </div>
          <div className="absolute right-0 bottom-0 w-[23.56%]" style={{ aspectRatio: "82 / 60" }}>
            <ProductLink product={nezhnostWhite} className="block h-full text-inherit">
              <Photo product={nezhnostWhite} aspect="82 / 60" fill />
            </ProductLink>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-[48.85%]">
            <ProductLink product={gracia}>
              <Caption product={gracia} />
            </ProductLink>
          </div>
          <div className="w-[23.56%]">
            <ProductLink product={nezhnostWhite}>
              <Caption product={nezhnostWhite} />
            </ProductLink>
          </div>
        </div>
      </div>
      ) : (
        <article className="hidden min-[769px]:block min-[769px]:w-[48.85%]">
          <ProductLink product={gracia}>
            <Photo product={gracia} aspect="170 / 122" />
            <Caption product={gracia} />
          </ProductLink>
        </article>
      )}

      {favorit || klassika ? (
        <div className="grid grid-cols-2 items-end gap-4 min-[769px]:flex min-[769px]:items-end min-[769px]:justify-between min-[769px]:gap-0">
          <article className="min-[769px]:w-[22.99%]">
            <ProductLink product={favorit}>
              <Photo product={favorit} aspect="80 / 60" />
              <Caption product={favorit} />
            </ProductLink>
          </article>
          <article className="min-[769px]:w-[48.85%]">
            <ProductLink product={klassika}>
              <Photo product={klassika} aspect="170 / 120" />
              <Caption product={klassika} />
            </ProductLink>
          </article>
        </div>
      ) : null}

      {garmoniya || zefir ? <div className="grid grid-cols-2 items-end gap-4 min-[769px]:flex min-[769px]:items-end min-[769px]:gap-0">
        <div className="hidden min-[769px]:block min-[769px]:w-[25.29%] min-[769px]:shrink-0" />
        <article className="min-[769px]:w-[23.56%]">
          <ProductLink product={garmoniya}>
            <Photo product={garmoniya} aspect="82 / 104" />
            <Caption product={garmoniya} />
          </ProductLink>
        </article>
        <div className="hidden min-[769px]:block min-[769px]:w-[2.3%] min-[769px]:shrink-0" />
        <article className="min-[769px]:w-[22.99%]">
          <ProductLink product={zefir}>
            <Photo product={zefir} aspect="80 / 68" />
            <Caption product={zefir} />
          </ProductLink>
        </article>
      </div> : null}

      {pudrovaya || belosnezhka || more ? <div className="relative grid grid-cols-2 items-end gap-4 min-[769px]:flex min-[769px]:items-end min-[769px]:justify-between min-[769px]:gap-0">
        <article className="min-[769px]:w-[22.99%]">
          <ProductLink product={pudrovaya}>
            <Photo product={pudrovaya} aspect="80 / 60" />
            <Caption product={pudrovaya} />
          </ProductLink>
        </article>
        <article className="min-[769px]:order-none min-[769px]:w-[48.85%]">
          <ProductLink product={belosnezhka}>
            <Photo product={belosnezhka} aspect="170 / 120" />
            <Caption product={belosnezhka} />
          </ProductLink>
        </article>
        <div className="col-span-2 flex items-end justify-center pt-2 min-[769px]:absolute min-[769px]:right-[48.85%] min-[769px]:bottom-0 min-[769px]:left-[22.99%] min-[769px]:col-auto min-[769px]:pt-0">
          {more ? <MoreBadge reduce={reduce} onClick={onMore} /> : null}
        </div>
      </div> : null}
    </div>
  )
}

export function CatalogPage() {
  const reduce = useReducedMotion() ?? false
  const [pages, setPages] = useState(1)
  const [products, setProducts] = useState<CatalogProduct[]>(() => catalogProducts.map((product) => ({ ...product, categoryId: "2" })))
  const [categories, setCategories] = useState<CatalogCategory[]>(catalogCategories)
  const [selected, setSelected] = useState<string | null>("2")
  const [sort, setSort] = useState<PriceSort>("catalog")
  const [openMenu, setOpenMenu] = useState<null | "sort" | "occasion">(null)
  const [occasionChoice, setOccasionChoice] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    fetch("/api/catalog")
      .then((response) => response.json())
      .then((data: { products?: CatalogProduct[]; categories?: CatalogCategory[] }) => {
        if (cancel || !Array.isArray(data.products) || data.products.length === 0) return
        const nextCategories = Array.isArray(data.categories) && data.categories.length ? data.categories : catalogCategories
        const author = nextCategories.find((category) => category.name === "Авторские букеты")
        const nextProducts = data.products.some((product) => product.categoryId)
          ? data.products
          : data.products.map((product) => ({ ...product, categoryId: "2" }))
        setProducts(nextProducts)
        setCategories(nextCategories)
        setSelected(author?.id ?? nextCategories[0]?.id ?? null)
        setPages(1)
      })
      .catch(() => {})
    return () => {
      cancel = true
    }
  }, [])

  const selectedCategory = categories.find((category) => category.id === selected)
  const occasionLabel = occasionOptions.find((option) => option.id === occasionChoice)?.label
  const chosen =
    selectedCategory?.name === "По поводу" && occasionLabel
      ? occasionLabel
      : selectedCategory && selectedCategory.name !== "Авторские букеты"
        ? selectedCategory.name
        : undefined
  const inCategory = selected ? products.filter((product) => product.categoryId === selected) : products
  const filtered =
    selectedCategory?.name === "Поштучно"
      ? pieceProducts
      : selectedCategory?.name === "По поводу"
        ? repeatCatalog(inCategory)
        : selectedCategory?.name === "Авторские букеты"
          ? repeatCatalog(inCategory)
          : inCategory
  const sorted =
    sort === "catalog"
      ? filtered
      : [...filtered].sort((a, b) => (sort === "asc" ? priceValue(a) - priceValue(b) : priceValue(b) - priceValue(a)))
  const groups = sorted.length > 0 ? toCatalogPages(sorted) : []
  const visible = groups.slice(0, pages)
  const hasMore = pages < groups.length

  return (
    <div className="min-h-svh bg-paper text-ink max-[768px]:overflow-x-clip">
      <Header />
      <main>
        <section className="bg-white px-4 pt-6 pb-16 min-[769px]:px-[50px] min-[769px]:pt-8 min-[769px]:pb-24">
          <nav
            aria-label="Хлебные крошки"
            className="mb-4 text-[13px] leading-5 text-[#9c958c] min-[769px]:mb-5"
            style={{ fontFamily: sans, fontWeight: 300, letterSpacing: "0.045em" }}
          >
            <a href="/#top" className="hover:text-[#4a463c]">
              Главная
            </a>
            <span> - </span>
            {chosen ? (
              <button
                type="button"
                className="cursor-pointer hover:text-[#4a463c]"
                onClick={() => {
                  const author = categories.find((category) => category.name === "Авторские букеты")
                  setSelected(author?.id ?? categories[0]?.id ?? null)
                  setOccasionChoice(null)
                  setPages(1)
                  setOpenMenu(null)
                }}
              >
                Каталог
              </button>
            ) : (
              <span className="text-[#4a463c]">Каталог</span>
            )}
            {chosen ? (
              <>
                <span> - </span>
                <span className="text-[#4a463c]">{chosen}</span>
              </>
            ) : null}
          </nav>
          <h1
            className="text-[#3c3832] uppercase"
            style={{
              fontFamily: display,
              fontWeight: 400,
              fontSize: "clamp(34px, 5.6vw, 80px)",
              lineHeight: 0.95,
              letterSpacing: 0,
            }}
          >
            Авторские букеты
          </h1>
          {categories.length > 0 ? (
            <div className="mt-6 flex flex-col gap-4 min-[769px]:mt-8 min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between">
              <nav aria-label="Категории" className="flex gap-6 overflow-x-auto min-[769px]:overflow-visible">
                {categories.map((category) => {
                  const active = category.id === selected
                  if (category.name === "По поводу") {
                    return (
                      <CategoryMenu
                        key={category.id}
                        label={occasionLabel ?? category.name}
                        options={occasionOptions}
                        value={occasionChoice}
                        open={openMenu === "occasion"}
                        active={active}
                        onOpenChange={(next) => {
                          if (next) {
                            setSelected(category.id)
                            setPages(1)
                            setOpenMenu("occasion")
                          } else {
                            setOpenMenu(null)
                          }
                        }}
                        onSelect={(id) => {
                          setSelected(category.id)
                          setOccasionChoice(id)
                          setPages(1)
                          setOpenMenu(null)
                        }}
                      />
                    )
                  }
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setSelected(category.id)
                        setPages(1)
                        setOpenMenu(null)
                      }}
                      className="shrink-0 cursor-pointer whitespace-nowrap"
                      style={categoryStyle(active)}
                    >
                      {category.name}
                    </button>
                  )
                })}
              </nav>
              <SortControl
                value={sort}
                open={openMenu === "sort"}
                onOpenChange={(next) => setOpenMenu(next ? "sort" : null)}
                onChange={(next) => {
                  setSort(next)
                  setPages(1)
                }}
              />
            </div>
          ) : null}
          {sorted.length === 0 ? (
            <p className="mt-10 text-[16px] leading-[19px] text-[#4a453f]" style={{ fontFamily: sans, fontWeight: 400 }}>
              В этой категории пока нет букетов
            </p>
          ) : null}
          <div className="flex flex-col gap-14 min-[769px]:gap-[10vw]">
            {visible.map((group, index) => (
              <CatalogGrid
                key={group[0]?.id ?? index}
                products={group}
                reduce={reduce}
                more={hasMore && index === visible.length - 1}
                onMore={() => setPages((count) => Math.min(count + 1, groups.length))}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
