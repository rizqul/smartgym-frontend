import * as z from "zod"
import * as rules from "./zodRules"

export const CreateMembershipPackageValidation = z.object({
  type: z.string().min(1, "Membership type is required"),
  name: rules.packageName,
  description: rules.description,
  price: rules.price,
  duration: rules.duration,
  features: z.string().min(1, "At least one facility is required (separate with Enter)")
})

export type CreateMembershipPackageData = z.infer<typeof CreateMembershipPackageValidation>
