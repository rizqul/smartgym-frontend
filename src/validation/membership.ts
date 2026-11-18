import * as z from "zod"
import * as rules from "./zodRules"

export const CreateMembershipPackageValidation = z.object({
  type: z.string().min(1, "Kategori Tipe wajib dipilih"),
  name: rules.packageName,
  description: rules.description,
  price: rules.price,
  duration: rules.duration,
  features: z.string().min(1, "Minimal satu fasilitas wajib diisi (pisahkan dengan Enter)")
})

export type CreateMembershipPackageData = z.infer<typeof CreateMembershipPackageValidation>
