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
    message: "Current password is required.",
    path: ["currentPassword"]
  })
  .refine((data) => !(data.currentPassword && !data.newPassword), {
    message: "New password is required.",
    path: ["newPassword"]
  })
  .refine((data) => !(data.currentPassword && data.newPassword && data.currentPassword === data.newPassword), {
    message: "New password cannot be the same as the current password.",
    path: ["newPassword"]
  })
  .refine((data) => !(data.newPassword && data.newPassword !== data.confirmPassword), {
    message: "Password confirmation does not match.",
    path: ["confirmPassword"]
  })

export type ProfileFormValues = z.infer<typeof profileSchema>
