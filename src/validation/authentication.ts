import * as z from "zod"
import * as rules from "./zodRules"

export const LoginValidation = z.object({
  email: rules.email,
  password: rules.password,
  remember: rules.remember
})

export type LoginFormData = z.infer<typeof LoginValidation>

export const ForgotPasswordEmailValidation = z.object({
  email: rules.email
})

export type ForgotPasswordEmailFormData = z.infer<typeof ForgotPasswordEmailValidation>

export const ForgotPasswordOtpValidation = z.object({
  code: rules.code
})

export type ForgotPasswordOtpFormData = z.infer<typeof ForgotPasswordOtpValidation>

export const ForgotPasswordResetValidation = z.object({
  password: rules.password,
  confirmPassword: rules.passwordConfirmation
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password confirmation does not match!",
  path: ["confirmPassword"]
})

export type ForgotPasswordResetFormData = z.infer<typeof ForgotPasswordResetValidation>
