export type ApplicationSource = "Главная — Контакты" | "Окно — Контакты"

export type ApplicationForm = {
  source: ApplicationSource
  name: string
  surname: string
  phone: string
  email: string
  message: string
}

export async function sendApplication(form: ApplicationForm) {
  const response = await fetch("/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  })
  if (!response.ok) {
    throw new Error("Не удалось отправить заявку")
  }
}
