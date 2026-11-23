export type CatalogStatus = "sale" | "soldout" | "hit"

export type CatalogCategory = {
  id: string
  name: string
}

export type CatalogProduct = {
  id: string
  name: string
  price: string
  image: string
  status?: CatalogStatus
  oldPrice?: string
  categoryId?: string
  focus?: string
  adapt?: boolean
}

export const catalogPageSize = 9

export const catalogProducts: CatalogProduct[] = [
  { id: "gracia", name: "Грация", price: "140 byn", image: "/flowers/catalog/gracia.jpg?v=3" },
  { id: "izyaschestvo", name: "Изящество", price: "120 byn", image: "/flowers/catalog/izyaschestvo.jpg?v=5" },
  { id: "nezhnost-170", name: "Нежность", price: "170 byn", image: "/flowers/catalog/nezhnost-170.jpg?v=5" },
  { id: "favorit", name: "Фаворит", price: "190 byn", image: "/flowers/catalog/favorit.jpg?v=5" },
  { id: "klassika", name: "Классика жанра", price: "290 byn", image: "/flowers/catalog/klassika.jpg?v=4" },
  { id: "garmoniya", name: "Гармония", price: "180 byn", image: "/flowers/catalog/garmoniya.jpg?v=3" },
  { id: "zefir", name: "Зефир", price: "100 byn", image: "/flowers/catalog/zefir.jpg?v=3" },
  { id: "pudrovaya", name: "Пудровая роза", price: "190 byn", image: "/flowers/catalog/pudrovaya.jpg?v=5" },
  { id: "belosnezhka", name: "Белоснежка", price: "200 byn", image: "/flowers/catalog/belosnezhka.jpg?v=4" },
]

export const pieceProducts: CatalogProduct[] = [
  { id: "piece-ivory", name: "Айвори", price: "18 byn", image: "/flowers/catalog/piece-kalla.jpg?v=8", adapt: true },
  { id: "piece-farfor", name: "Фарфор", price: "12 byn", image: "/flowers/catalog/piece-tyulpan.jpg?v=8", adapt: true },
  { id: "piece-oblako", name: "Облако", price: "24 byn", image: "/flowers/catalog/piece-pion.jpg?v=8", adapt: true },
  { id: "piece-vanil", name: "Ваниль", price: "14 byn", image: "/flowers/catalog/piece-tyulpan.jpg?v=8", adapt: true },
  { id: "piece-rumyanets", name: "Румянец", price: "26 byn", image: "/flowers/catalog/piece-pion.jpg?v=8", adapt: true },
  { id: "piece-luna", name: "Лунный свет", price: "20 byn", image: "/flowers/catalog/piece-kalla.jpg?v=8", adapt: true },
  { id: "piece-lebed", name: "Лебедь", price: "15 byn", image: "/flowers/catalog/piece-tyulpan.jpg?v=8", adapt: true },
  { id: "piece-persik", name: "Персик", price: "28 byn", image: "/flowers/catalog/piece-pion.jpg?v=8", adapt: true },
  { id: "piece-shelk", name: "Белый шёлк", price: "22 byn", image: "/flowers/catalog/piece-kalla.jpg?v=8", adapt: true },
]

export const alpinePoppy: CatalogProduct = {
  id: "mak-alpiyskiy",
  name: "Мак Альпийский",
  price: "5 byn",
  image: "/flowers/cards/mak.jpg",
}

const knownProducts = [...catalogProducts, ...pieceProducts, alpinePoppy]

export function findCatalogProduct(id: string) {
  return knownProducts.find((product) => product.id === id) ?? knownProducts.find((product) => product.id === id.replace(/-\d+$/, ""))
}

export function toCatalogPages(products: CatalogProduct[]) {
  const pages: CatalogProduct[][] = []
  for (let index = 0; index < products.length; index += catalogPageSize) {
    pages.push(products.slice(index, index + catalogPageSize))
  }
  return pages.length > 0 ? pages : [catalogProducts]
}
