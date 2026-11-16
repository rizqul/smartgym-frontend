import * as z from "zod"
import * as rules from "./zodRules"

export const CreateMemberValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: z.string().min(10, "Nomor telepon wajib diisi (min. 10 angka)"),
  code: rules.code,
  password: rules.password
})

export type CreateMemberData = z.infer<typeof CreateMemberValidation>
