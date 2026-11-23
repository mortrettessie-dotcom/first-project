export type ProductSection = "gallery" | "bestsellers"

export type SiteProduct = {
  id: string
  section: ProductSection
  name: string
  price: string
}

export type SiteContent = {
  hero: {
    title: string
    text: string
  }
  products: SiteProduct[]
}

export const defaultSiteContent: SiteContent = {
  hero: {
    title: "FLOWERS",
    text: "Наши букеты — это не просто цветы, а уникальные композиции, созданные с любовью",
  },
  products: [
    { id: "pion", section: "gallery", name: "Пион", price: "" },
    { id: "kalla", section: "gallery", name: "Калла", price: "" },
    { id: "ranunkulyus", section: "gallery", name: "Ранункулюс", price: "" },
    { id: "tyulpan", section: "gallery", name: "Тюльпан", price: "" },
    { id: "mak", section: "gallery", name: "Мак", price: "" },
    { id: "monobukety", section: "gallery", name: "Монобукеты", price: "" },
    { id: "kompozicii", section: "gallery", name: "Композиции в коробках", price: "" },
    { id: "buket-nevesty", section: "gallery", name: "Букет невесты", price: "" },
    { id: "avtorskie", section: "gallery", name: "Авторские букеты", price: "" },
    { id: "belosnezhka", section: "bestsellers", name: "Белоснежка", price: "190 byn" },
    { id: "nezhnye-rozy", section: "bestsellers", name: "Нежные розы", price: "110 byn" },
    { id: "radost-vesny", section: "bestsellers", name: "Радость весны", price: "250 byn" },
    { id: "volshebny-sad", section: "bestsellers", name: "Волшебный сад", price: "150 byn" },
    { id: "set-lyubvi", section: "bestsellers", name: "Сет любви", price: "210 byn" },
    { id: "mechta", section: "bestsellers", name: "Мечта", price: "130 byn" },
    { id: "letniy-sad", section: "bestsellers", name: "Летний сад", price: "220 byn" },
  ],
}

export function productName(content: SiteContent, id: string, fallback: string) {
  return content.products.find((item) => item.id === id)?.name || fallback
}

export function productPrice(content: SiteContent, id: string, fallback: string) {
  return content.products.find((item) => item.id === id)?.price || fallback
}

export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false
  const content = value as SiteContent
  return typeof content.hero?.title === "string" && typeof content.hero?.text === "string" && Array.isArray(content.products)
}
