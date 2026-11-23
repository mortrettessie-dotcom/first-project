import { findCatalogProduct } from "./src/data/catalogProducts.ts"
import { absoluteUrl, applyHtmlMeta, fallbackMeta, fillProductMeta, metaRowFor, orderPageMeta, type PageMeta } from "./src/lib/pageMeta.ts"

export const config = {
  matcher: ["/", "/catalog", "/cart", "/checkout", "/thanks", "/product/:path*", "/order/:path*"],
}

function pageMeta(pathname: string, origin: string): PageMeta {
  const order = orderPageMeta(pathname, origin)
  if (order) return order
  const row = metaRowFor(fallbackMeta, pathname) ?? fallbackMeta[0]
  if (!pathname.startsWith("/product/")) return { ...row, image: absoluteUrl(row.image, origin) }
  const id = decodeURIComponent(pathname.split("?")[0].replace(/^\/product\/?/, ""))
  const product = findCatalogProduct(id)
  if (!product) {
    return {
      path: pathname,
      title: "Товар — FLOWLOVE",
      description: "Свежие цветы FLOWLOVE с доставкой по Минску или самовывозом.",
      image: absoluteUrl("/flowers/hero-bouquet.png", origin),
    }
  }
  return fillProductMeta(row, product, origin)
}

export default async function middleware(request: Request) {
  const url = new URL(request.url)
  const indexUrl = new URL("/index.html", url.origin)
  try {
    const index = await fetch(indexUrl)
    if (!index.ok) return Response.redirect(indexUrl, 307)
    const meta = pageMeta(url.pathname, url.origin)
    const html = applyHtmlMeta(await index.text(), meta, url.href)
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return Response.redirect(indexUrl, 307)
  }
}
