import { ApplicationError, parseApplication, sendApplication } from "../server/mail.ts"

type Request = { method?: string; body?: unknown }
type Response = {
  status: (code: number) => { json: (body: unknown) => void }
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false })
    return
  }

  try {
    await sendApplication(parseApplication(req.body))
    res.status(200).json({ ok: true })
  } catch (error) {
    const status = error instanceof ApplicationError ? error.status : 500
    console.error(error)
    res.status(status).json({ ok: false })
  }
}
