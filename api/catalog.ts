import { fallbackCatalog, loadCatalog } from "../server/catalog.js"

type Request = { method?: string }
type Response = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => { json: (body: unknown) => void }
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false })
    return
  }

  res.setHeader("Cache-Control", "no-store")
  try {
    res.status(200).json(await loadCatalog())
  } catch (error) {
    console.error(error)
    res.status(200).json(fallbackCatalog())
  }
}
