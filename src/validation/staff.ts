import * as z from "zod"
import * as rules from "./zodRules"

export const CreateStaffValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: z.string().min(10, "Nomor telepon wajib diisi (min. 10 angka)"),
  role: z.enum(["STAFF", "ADMIN"], {
    message: "Role harus dipilih (STAFF atau ADMIN)"
  }),
  password: rules.password
})

export type CreateStaffData = z.infer<typeof CreateStaffValidation>