import type { CatalogProduct } from "../data/catalogProducts.ts"

export type PageMeta = {
  path: string
  title: string
  description: string
  image: string
}

export const fallbackMeta: PageMeta[] = [
  {
    path: "/",
    title: "FLOWLOVE — авторские букеты и цветы в Минске",
    description: "Свежие авторские букеты, цветы поштучно и композиции к празднику. Доставка по Минску за 15 BYN, бесплатно от 100 BYN.",
    image: "/flowers/hero-bouquet.png",
  },
  {
    path: "/catalog",
    title: "Каталог букетов — FLOWLOVE",
    description: "Полная коллекция FLOWLOVE: авторские букеты, монобукеты, цветы поштучно и композиции на праздник. Выберите букет и закажите доставку по Минску.",
    image: "/flowers/cards/avtorskie.jpg",
  },
  {
    path: "/product/[id]",
    title: "{product.name} — {product.price} | FLOWLOVE",
    description: "Закажите «{product.name}» за {product.price}. Свежие цветы с доставкой по Минску или самовывозом. Бесплатная доставка от 100 BYN.",
    image: "{product.image}",
  },
  {
    path: "/cart",
    title: "Корзина — FLOWLOVE",
    description: "Проверьте выбранные букеты, количество и стоимость доставки, затем перейдите к оформлению заказа.",
    image: "/flowers/hero-bouquet.png",
  },
  {
    path: "/checkout",
    title: "Оформление заказа — FLOWLOVE",
    description: "Укажите получателя, адрес в Минске и удобное время доставки. Оплата наличными или картой при получении.",
    image: "/flowers/hero-bouquet.png",
  },
  {
    path: "/thanks",
    title: "Заказ оформлен — FLOWLOVE",
    description: "Ваш заказ успешно оформлен. На странице указаны номер заказа, дата и время оформления.",
    image: "/flowers/thanks-lily.png",
  },
]

export function mainProductPhoto(product: Pick<CatalogProduct, "id" | "image">) {
  if (product.id.replace(/-\d+$/, "") === "piece-farfor") return "/flowers/product/farfor-white.jpg"
  return product.image
}

export function orderPageMeta(pathname: string, origin: string): PageMeta | null {
  if (!pathname.startsWith("/order/") && pathname !== "/order") return null
  const number = decodeURIComponent(pathname.split("/").filter(Boolean)[1] ?? "")
  const valid = /^\d{3}-\d{2}-\d{2}$/.test(number)
  return {
    path: pathname,
    title: valid ? `Заказ № ${number} — FLOWLOVE` : "Статус заказа — FLOWLOVE",
    description: "Статус, состав и доставка заказа FLOWLOVE.",
    image: absoluteUrl("/flowers/thanks-lily.png", origin),
  }
}

export function metaRowFor(rows: PageMeta[], pathname: string) {
  const path = pathname.split("?")[0] || "/"
  return rows.find((row) => row.path === path) ?? (path.startsWith("/product/") ? rows.find((row) => row.path.startsWith("/product/")) : undefined) ?? rows.find((row) => row.path === "/")
}

export function fillProductMeta(row: PageMeta, product: Pick<CatalogProduct, "id" | "name" | "price" | "image">, origin: string): PageMeta {
  const price = product.price.replace(/byn/gi, "BYN")
  const image = absoluteUrl(mainProductPhoto(product), origin)
  const fill = (value: string) => value.replaceAll("{product.name}", product.name).replaceAll("{product.price}", price).replaceAll("{product.image}", image)
  return {
    path: `/product/${product.id}`,
    title: fill(row.title),
    description: fill(row.description),
    image: absoluteUrl(imagePath(fill(row.image)), origin),
  }
}

export function absoluteUrl(src: string, origin: string) {
  const path = imagePath(src)
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (!path.startsWith("/")) return path
  return `${origin.replace(/\/$/, "")}${path}`
}

export function imagePath(value: string) {
  return value.trim().match(/^\S+/)?.[0] ?? ""
}

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

export function applyHtmlMeta(html: string, meta: PageMeta, url: string) {
  const type = meta.path.startsWith("/product/") ? "product" : "website"
  const robots = meta.path.startsWith("/order/") ? `\n    <meta name="robots" content="noindex" />` : ""
  const block = [
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${escapeHtml(meta.image)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`,
  ].join("\n    ")
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace(/\s*<meta\s+(?:property|name)="(?:og:|twitter:)[^>]*>/g, "")
    .replace("</head>", `    ${block}${robots}\n  </head>`)
}
