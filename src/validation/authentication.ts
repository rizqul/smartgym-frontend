import * as z from "zod"
import * as rules from "./zodRules"

export const LoginValidation = z.object({
  email: rules.email,
  password: rules.password,
  remember: rules.remember
})


export type LoginFormData = z.infer<typeof LoginValidation>

export const ForgotPasswordEmailValidation = z.object({
  email: rules.email, 
})

export type ForgotPasswordEmailFormData = z.infer<typeof ForgotPasswordEmailValidation>

export const ForgotPasswordResetValidation = z.object({
  code: rules.code,
  newPassword: rules.password, 
  confirmPassword: rules.passwordConfirmation,
})

export type ForgotPasswordResetFormData = z.infer<typeof ForgotPasswordResetValidation>