import { applyHtmlMeta } from "./src/lib/pageMeta.ts"
import { metaForRequest, originOf } from "./server/pageMeta.ts"

export const config = {
  matcher: ["/", "/catalog", "/cart", "/checkout", "/thanks", "/product/:path*", "/order/:path*"],
}

export default async function middleware(request: Request) {
  const url = new URL(request.url)
  const origin = originOf(url.host, url.protocol.replace(":", ""))
  const meta = await metaForRequest(url.pathname, origin)
  const index = await fetch(new URL("/index.html", url.origin))
  const html = applyHtmlMeta(await index.text(), meta, `${origin}${url.pathname}`)
  return new Response(html, {
    status: index.status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
