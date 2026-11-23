export function formatOrderDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const parts = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Minsk",
  }).formatToParts(date)
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value
  const day = pick("day")
  const month = pick("month")
  const year = pick("year")
  const hour = pick("hour")
  const minute = pick("minute")
  return day && month && year && hour && minute ? `${day} ${month} ${year} года, ${hour}:${minute}` : ""
}
