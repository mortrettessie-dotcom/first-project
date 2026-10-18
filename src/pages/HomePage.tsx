import { Bestsellers } from "../components/Bestsellers.tsx"
import { Catalog } from "../components/Catalog.tsx"
import { Contacts } from "../components/Contacts.tsx"
import { Delivery } from "../components/Delivery.tsx"
import { Footer } from "../components/Footer.tsx"
import { Header } from "../components/Header.tsx"
import { Hero } from "../components/Hero.tsx"

export function HomePage() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Delivery />
        <Bestsellers />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}
