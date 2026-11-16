export type UserRole = "ADMIN" | "STAFF" | "MEMBER"

export type User = {
  id: string
  name: string
  email: string
  profileUrl: string | null
  phoneNumber: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
