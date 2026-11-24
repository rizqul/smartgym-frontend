import * as z from "zod"
import * as rules from "./zodRules"

export const CreateMemberValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: z.string().min(10, "Phone number is required (minimum 10 digits)"),
  code: rules.code,
  password: rules.password
})

export type CreateMemberData = z.infer<typeof CreateMemberValidation>
