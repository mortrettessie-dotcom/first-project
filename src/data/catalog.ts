export type CatalogCard = {
  name: string
  image: string
  alt: string
  offset: string
  frame: string
}

export const species: CatalogCard[] = [
  {
    name: "Пион",
    image: "/flowers/species-peony.jpg",
    alt: "Розовые пионы",
    offset: "lg:mt-2",
    frame: "aspect-[4/5]",
  },
  {
    name: "Калла",
    image: "/flowers/species-calla.jpg",
    alt: "Белая калла",
    offset: "lg:mt-14",
    frame: "aspect-[3/4]",
  },
  {
    name: "Ранункулюс",
    image: "/flowers/species-ranunculus.jpg",
    alt: "Розовый ранункулюс",
    offset: "lg:mt-6",
    frame: "aspect-square",
  },
  {
    name: "Тюльпан",
    image: "/flowers/species-tulip.jpg",
    alt: "Розовый тюльпан",
    offset: "lg:mt-0",
    frame: "aspect-[4/5]",
  },
  {
    name: "Мак",
    image: "/flowers/species-poppy.jpg",
    alt: "Светлый букет",
    offset: "lg:mt-8",
    frame: "aspect-[4/5]",
  },
]

export const bouquets: CatalogCard[] = [
  {
    name: "Минибукеты",
    image: "/flowers/mini.jpg",
    alt: "Небольшой яркий букет",
    offset: "lg:-mt-4",
    frame: "aspect-[3/4]",
  },
  {
    name: "Композиции в коробке",
    image: "/flowers/arrangement.jpg",
    alt: "Цветочная композиция в вазе",
    offset: "lg:mt-12",
    frame: "aspect-[5/4]",
  },
  {
    name: "Букет невесты",
    image: "/flowers/bridal.jpg",
    alt: "Нежный свадебный букет",
    offset: "lg:mt-16",
    frame: "aspect-[4/5]",
  },
  {
    name: "Авторские букеты",
    image: "/flowers/author.jpg",
    alt: "Авторский букет в упаковке",
    offset: "lg:mt-6",
    frame: "aspect-[5/4]",
  },
]
