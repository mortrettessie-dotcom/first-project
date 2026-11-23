import { loadMetaRows } from "../server/pageMeta.ts"
import { fallbackMeta } from "../src/lib/pageMeta.ts"

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
