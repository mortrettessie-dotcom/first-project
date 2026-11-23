import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { findCatalogProduct, type CatalogProduct } from "../data/catalogProducts.ts"
import { absoluteUrl, fallbackMeta, fillProductMeta, metaRowFor, orderPageMeta, type PageMeta } from "../lib/pageMeta.ts"

function setMeta(attr: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attr, key)
    document.head.append(element)
  }
  element.setAttribute("content", content)
}

export function PageMeta() {
  const { pathname } = useLocation()
  const [rows, setRows] = useState<PageMeta[]>(fallbackMeta)
  const [remote, setRemote] = useState<CatalogProduct[]>([])
  const [catalogReady, setCatalogReady] = useState(false)

  useEffect(() => {
    let cancel = false
    fetch("/api/meta")
      .then((response) => response.json())
      .then((data: { rows?: PageMeta[] }) => {
        if (!cancel && Array.isArray(data.rows) && data.rows.length) setRows(data.rows)
      })
      .catch(() => {})
    return () => {
      cancel = true
    }
  }, [])

  useEffect(() => {
    if (!pathname.startsWith("/product/")) return
    let cancel = false
    fetch("/api/catalog")
      .then((response) => response.json())
      .then((data: { products?: CatalogProduct[] }) => {
        if (!cancel && Array.isArray(data.products)) setRemote(data.products)
        if (!cancel) setCatalogReady(true)
      })
      .catch(() => {
        if (!cancel) setCatalogReady(true)
      })
    return () => {
      cancel = true
    }
  }, [pathname])

  useEffect(() => {
    const origin = window.location.origin
    const order = orderPageMeta(pathname, origin)
    if (order) {
      document.title = order.title
      setMeta("name", "description", order.description)
      setMeta("name", "robots", "noindex")
      setMeta("property", "og:title", order.title)
      setMeta("property", "og:description", order.description)
      setMeta("property", "og:image", order.image)
      setMeta("property", "og:url", `${origin}${pathname}`)
      setMeta("property", "og:type", "website")
      setMeta("name", "twitter:card", "summary_large_image")
      setMeta("name", "twitter:title", order.title)
      setMeta("name", "twitter:description", order.description)
      setMeta("name", "twitter:image", order.image)
      return
    }
    document.head.querySelector('meta[name="robots"]')?.remove()
    const row = metaRowFor(rows, pathname)
    if (!row) return
    const id = decodeURIComponent(pathname.replace(/^\/product\/?/, ""))
    const product = pathname.startsWith("/product/") ? remote.find((item) => item.id === id) ?? findCatalogProduct(id) : undefined
    if (pathname.startsWith("/product/") && !product && !catalogReady) return
    const meta = product ? fillProductMeta(row, product, origin) : { ...row, image: absoluteUrl(row.image, origin) }
    const url = `${origin}${pathname}`
    document.title = meta.title
    setMeta("name", "description", meta.description)
    setMeta("property", "og:title", meta.title)
    setMeta("property", "og:description", meta.description)
    setMeta("property", "og:image", meta.image)
    setMeta("property", "og:url", url)
    setMeta("property", "og:type", pathname.startsWith("/product/") ? "product" : "website")
    setMeta("name", "twitter:card", "summary_large_image")
    setMeta("name", "twitter:title", meta.title)
    setMeta("name", "twitter:description", meta.description)
    setMeta("name", "twitter:image", meta.image)
  }, [catalogReady, pathname, remote, rows])

  return null
}
