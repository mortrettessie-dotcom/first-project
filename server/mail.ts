import nodemailer from "nodemailer"

const sources = ["Главная — Контакты", "Окно — Контакты"] as const

export type ApplicationSource = (typeof sources)[number]

export type Application = {
  source: ApplicationSource
  name: string
  surname: string
  phone: string
  email: string
  message: string
}

export class ApplicationError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function field(value: unknown, label: string) {
  if (typeof value !== "string") {
    throw new ApplicationError(400, `Укажите поле «${label}»`)
  }
  const text = value.trim().replace(/[\r\n]+/g, " ")
  if (!text || text.length > 120) {
    throw new ApplicationError(400, `Проверьте поле «${label}»`)
  }
  return text
}

export function parseApplication(body: unknown): Application {
  if (!body || typeof body !== "object") {
    throw new ApplicationError(400, "Пустая заявка")
  }
  const input = body as Record<string, unknown>
  const source = input.source
  if (typeof source !== "string" || !sources.includes(source as ApplicationSource)) {
    throw new ApplicationError(400, "Неизвестный источник заявки")
  }
  const email = field(input.email, "Электронная почта")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApplicationError(400, "Проверьте указанную почту")
  }
  const phone = field(input.phone, "Номер телефона")
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 7 || digits.length > 15 || !/^[+\d][\d\s().-]*$/.test(phone)) {
    throw new ApplicationError(400, "Проверьте номер телефона")
  }
  return {
    source: source as ApplicationSource,
    name: field(input.name, "Имя"),
    surname: field(input.surname, "Фамилия"),
    phone,
    email,
    message: messageField(input.message),
  }
}

function messageField(value: unknown) {
  if (value == null || value === "") return ""
  if (typeof value !== "string") {
    throw new ApplicationError(400, "Проверьте поле «Сообщение»")
  }
  const text = value.trim()
  if (text.length > 2000) {
    throw new ApplicationError(400, "Проверьте поле «Сообщение»")
  }
  return text
}

export async function sendApplication(application: Application) {
  const saved = await saveLead(application)
  const mailed = await sendMail(application)
  const text = [
    "Заявка FLOWLOVE",
    `Откуда: ${application.source}`,
    `Имя: ${application.name}`,
    `Фамилия: ${application.surname}`,
    `Телефон: ${application.phone}`,
    `Почта: ${application.email}`,
    `Сообщение: ${application.message || "—"}`,
    saved ? "✅ заявка в базу данных записана" : "❌ заявка в базу данных не записана",
    mailed ? "✅ заявка на почту отправлена" : "❌ заявка на почту не отправлена",
  ].join("\n")

  await postTelegram(text)

  if (!saved) {
    throw new ApplicationError(500, "Заявка в базу данных не записана")
  }
}

async function saveLead(application: Application) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "")
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error("Supabase не настроен")
    return false
  }

  try {
    const response = await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        created_at: new Date().toISOString(),
        name: application.name,
        phone: application.phone,
        email: application.email,
        message: application.message,
      }),
    })
    if (!response.ok) {
      console.error("Supabase:", response.status, (await response.text()).slice(0, 300))
      return false
    }
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function sendPlainMail(message: { subject: string; text: string; replyTo?: string }) {
  const user = process.env.YANDEX_SMTP_USER
  const pass = process.env.YANDEX_SMTP_PASSWORD
  const to = process.env.YANDEX_MAIL_TO
  const host = process.env.YANDEX_SMTP_HOST || "smtp.yandex.ru"
  const port = Number(process.env.YANDEX_SMTP_PORT || 465)

  if (!user || !pass || !to) {
    console.error("Почта не настроена")
    return false
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
    await transporter.sendMail({
      from: user,
      to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

async function sendMail(application: Application) {
  return sendPlainMail({
    subject: `Заявка FLOWLOVE: ${application.name} ${application.surname}`,
    replyTo: application.email,
    text: [
      `Откуда: ${application.source}`,
      `Имя: ${application.name}`,
      `Фамилия: ${application.surname}`,
      `Телефон: ${application.phone}`,
      `Почта: ${application.email}`,
      `Сообщение: ${application.message || "—"}`,
    ].join("\n"),
  })
}

export async function postTelegram(text: string) {
  try {
    await sendTelegram(text)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    throw new ApplicationError(500, "Телеграм не настроен")
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  const result = (await response.json()) as { ok?: boolean; description?: string }
  if (!response.ok || !result.ok) {
    console.error("Telegram:", result.description ?? response.status)
    throw new ApplicationError(500, "Не удалось отправить заявку в Телеграм")
  }
}
