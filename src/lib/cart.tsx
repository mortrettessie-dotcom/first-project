import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export type CartLine = {
  id: string
  quantity: number
}

const STORAGE_KEY = "flowlove-cart"

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return []
      const id = "id" in item && typeof item.id === "string" ? item.id : ""
      const quantity = "quantity" in item && typeof item.quantity === "number" ? Math.floor(item.quantity) : 0
      return id && quantity > 0 ? [{ id, quantity }] : []
    })
  } catch {
    return []
  }
}

function writeCart(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  promo: string
  add: (id: string, quantity: number) => void
  setQuantity: (id: string, quantity: number) => void
  setPromo: (value: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readCart)
  const [promo, setPromo] = useState("")

  const commit = useCallback((next: CartLine[]) => {
    const cleaned = next.filter((line) => line.quantity > 0)
    writeCart(cleaned)
    setLines(cleaned)
  }, [])

  const add = useCallback(
    (id: string, quantity: number) => {
      const amount = Math.max(1, Math.floor(quantity))
      const current = readCart()
      const existing = current.find((line) => line.id === id)
      const next = existing
        ? current.map((line) => (line.id === id ? { ...line, quantity: line.quantity + amount } : line))
        : [...current, { id, quantity: amount }]
      commit(next)
    },
    [commit],
  )

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      const amount = Math.floor(quantity)
      const next = readCart().flatMap((line) => (line.id === id ? (amount > 0 ? [{ ...line, quantity: amount }] : []) : [line]))
      commit(next)
    },
    [commit],
  )

  const clear = useCallback(() => {
    commit([])
    setPromo("")
  }, [commit])

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const value = useMemo(
    () => ({ lines, count, promo, add, setQuantity, setPromo, clear }),
    [lines, count, promo, add, setQuantity, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error("Корзина недоступна")
  return value
}
