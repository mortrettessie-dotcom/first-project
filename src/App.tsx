import { Route, Routes } from "react-router-dom"
import { CartProvider } from "./lib/cart.tsx"
import { PageMeta } from "./components/PageMeta.tsx"
import { CatalogPage } from "./pages/CatalogPage.tsx"
import { CartPage, CheckoutPage, ThanksPage } from "./pages/CartPage.tsx"
import { HomePage } from "./pages/HomePage.tsx"
import { OrderPage } from "./pages/OrderPage.tsx"
import { ProductPage } from "./pages/ProductPage.tsx"

export default function App() {
  return (
    <CartProvider>
      <PageMeta />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thanks" element={<ThanksPage />} />
        <Route path="/order/:number" element={<OrderPage />} />
      </Routes>
    </CartProvider>
  )
}
