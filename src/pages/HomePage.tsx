import { useEffect, useState } from "react"
import { Bestsellers } from "../components/Bestsellers.tsx"
import { Catalog } from "../components/Catalog.tsx"
import { Contacts } from "../components/Contacts.tsx"
import { Delivery } from "../components/Delivery.tsx"
import { Footer } from "../components/Footer.tsx"
import { Header } from "../components/Header.tsx"
import { Hero } from "../components/Hero.tsx"
import { defaultSiteContent, isSiteContent, type SiteContent } from "../data/siteContent.ts"

export function HomePage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)

  useEffect(() => {
    let ignore = false
    fetch("/api/content")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (!ignore && isSiteContent(data)) setContent(data)
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="min-h-svh max-[768px]:overflow-x-clip bg-paper text-ink">
      <Header />
      <main>
        <Hero title={content.hero.title} text={content.hero.text} />
        <Catalog content={content} />
        <Delivery />
        <Bestsellers content={content} />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}
