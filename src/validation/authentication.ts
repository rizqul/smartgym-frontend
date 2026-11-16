import * as z from "zod"
import * as rules from "./zodRules"

export const LoginValidation = z.object({
  email: rules.email,
  password: rules.password,
  remember: rules.remember
})

export type LoginFormData = z.infer<typeof LoginValidation>
