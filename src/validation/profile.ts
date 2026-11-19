import * as z from "zod"
import { email, name, password, phoneNumber } from "~/validation/zodRules"

export const profileSchema = z
  .object({
    fullName: name,
    email: email,
    phone: phoneNumber,
    currentPassword: z.string().optional(),
    newPassword: z.union([z.literal(""), password]).optional(),
    confirmPassword: z.string().optional()
  })
  .refine((data) => !(data.newPassword && !data.currentPassword), {
    message: "Kata sandi saat ini wajib diisi.",
    path: ["currentPassword"]
  })
  .refine((data) => !(data.currentPassword && !data.newPassword), {
    message: "Kata sandi baru wajib diisi.",
    path: ["newPassword"]
  })
  .refine((data) => !(data.newPassword && data.newPassword !== data.confirmPassword), {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"]
  })

export type ProfileFormValues = z.infer<typeof profileSchema>
