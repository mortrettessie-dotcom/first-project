import { loadMetaRows } from "../server/pageMeta.js"
import { fallbackMeta } from "../src/lib/pageMeta.js"

type Request = { method?: string }
type Response = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => { json: (body: unknown) => void }
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    res.status(405).json({ rows: fallbackMeta })
    return
  }
  res.setHeader("Cache-Control", "no-store")
  res.status(200).json({ rows: await loadMetaRows() })
}
