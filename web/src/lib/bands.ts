import type { InviteStatus, Role } from "@/lib/api/generated/model"

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Не удалось выполнить запрос к Bands API"
}

export function formatRole(role: Role) {
  switch (role) {
    case "owner":
      return "owner"
    case "admin":
      return "admin"
    case "member":
      return "member"
    default:
      return role
  }
}

export function formatInviteStatus(status: InviteStatus) {
  switch (status) {
    case "pending":
      return "pending"
    case "accepted":
      return "accepted"
    case "expired":
      return "expired"
    case "declined":
      return "declined"
    case "revoked":
      return "revoked"
    default:
      return status
  }
}

export function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getBandInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
