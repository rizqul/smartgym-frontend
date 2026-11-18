import * as z from "zod"
import * as rules from "./zodRules"

export const CreateStaffValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: z.string().min(10, "Nomor telepon wajib diisi (min. 10 angka)"),
  password: rules.password
})

export type CreateStaffData = z.infer<typeof CreateStaffValidation>