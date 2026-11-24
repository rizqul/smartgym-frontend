import * as z from "zod"
import * as rules from "./zodRules"

export const CreateMemberValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: rules.phoneNumber,
  code: rules.code,
  password: rules.password
})

export const UpdateMemberValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: rules.phoneNumber,
  password: z.union([z.literal(""), rules.password]).optional()
})

export type CreateMemberData = z.infer<typeof CreateMemberValidation>
export type UpdateMemberData = z.infer<typeof UpdateMemberValidation>