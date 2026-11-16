import * as z from "zod"

const name = z.string({
  error: (iss) => (iss.input == undefined ? "The name field is required." : "The name field must be a string.")
})

const email = z.email({
  error: (iss) => (iss.input == undefined ? "The email field is required." : "The email field must be a valid email address.")
})

const password = z
  .string({
    error: (iss) => (iss.input == undefined ? "The password field is required." : "The password field must be a string.")
  })
  .min(8, "The password field must be at least 8 characters.")

const passwordConfirmation = z
  .string({
    error: (iss) =>
      iss.input == undefined ? "The password confirmation field is required." : "The password confirmation field must be a string."
  })
  .min(8, "The password confirmation field must be at least 8 characters.")

const remember = z.boolean().optional()

const code = z
  .string({
    error: (iss) => (iss.input == undefined ? "The code field is required." : "The code field must be a number.")
  })
  .length(6, "The code field must be 6 number length.")

const avatar = z
  .union([
    z.instanceof(FileList, {
      error: "The avatar field is required."
    }),
    z.string().optional()
  ])
  .refine((data) => data instanceof FileList || typeof data === "string", {
    error: "The avatar field is required."
  })

export { avatar, code, email, name, password, passwordConfirmation, remember }
