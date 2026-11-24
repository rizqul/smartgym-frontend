import * as z from "zod"
import * as rules from "./zodRules"

export const CreateStaffValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: z.string().min(10, "Phone number is required (min. 10 digits)"),
  password: rules.password
})

export const UpdateStaffValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: rules.phoneNumber,
  password: z
    .string()
    .trim()
    .refine((val) => val === "" || val.length >= 8, {
      message: "Password must contain at least 8 characters."
    })
    .optional()
})

export type CreateStaffData = z.infer<typeof CreateStaffValidation>
export type UpdateStaffData = z.infer<typeof UpdateStaffValidation>
