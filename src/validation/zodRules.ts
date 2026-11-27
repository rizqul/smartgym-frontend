import * as z from "zod"

const name = z.string().trim().min(1, "Full name is required.").max(100, "Full name must be at most 100 characters.")

const email = z.string().trim().min(1, "Email address is required.").email({ error: "Invalid email format (e.g., user@gymmick.my.id)." })

const phoneNumber = z.string().trim().min(10, "Phone number must be at least 10 digits.").max(15, "Phone number must be at most 15 digits.")

const password = z.string().min(8, "Password must be at least 8 characters.")

const passwordConfirmation = z.string().min(1, "Password confirmation is required.")

const remember = z.boolean().optional()

const code = z
  .string()
  .min(1, "OTP code is required.")
  .length(6, "OTP code must be exactly 6 digits.")
  .regex(/^\d+$/, "OTP code must contain only digits.")

const avatar = z
  .any()
  .refine((value) => value === undefined || value === null || value instanceof FileList || typeof value === "string", {
    message: "Please upload a valid image file."
  })
  .optional()

const packageName = z.string().trim().min(1, "Package name is required.").max(100, "Package name must be at most 100 characters.")

const description = z.string().trim().min(1, "Description is required.")

const price = z.coerce.number().min(0, "Price is required and cannot be negative.")

const duration = z.coerce.number().min(1, "Duration is required (minimum 1 day).")

const specialization = z.string().trim().min(1, "Specialization is required.")

const experience = z.string().trim().min(1, "Experience is required.").regex(/^\d+$/, "Experience must be a number.")

const rate = z.string().trim().min(1, "Rate per session is required.").regex(/^\d+$/, "Rate must be a number.")

const trainerId = z.string().trim().min(1, "Please select a trainer.")

const slotDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format.")

const startHour = z.string().trim().min(1, "Start time is required.")

const endHour = z.string().trim().min(1, "End time is required.")

const quota = z
  .string()
  .trim()
  .min(1, "Quota is required.")
  .regex(/^\d+$/, "Quota must be a number.")
  .refine((val) => Number(val) >= 1, "Quota must be at least 1 member.")

export {
  avatar,
  code,
  email,
  name,
  password,
  passwordConfirmation,
  phoneNumber,
  remember,
  packageName,
  description,
  price,
  duration,
  specialization,
  experience,
  rate,
  trainerId,
  slotDate,
  startHour,
  endHour,
  quota
}
