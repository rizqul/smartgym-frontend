import * as z from "zod"
import * as rules from "./zodRules"

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"]
const MAX_PHOTO_SIZE = 2 * 1024 * 1024 // 2MB

export const CreateTrainerValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: rules.phoneNumber,
  specialization: rules.specialization,
  experience: rules.experience,
  rate: rules.rate
})

export type CreateTrainerData = z.infer<typeof CreateTrainerValidation>

export const UpdateTrainerValidation = CreateTrainerValidation.extend({
  photo: z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: "Photo must be a PNG, JPG, or JPEG file."
    })
    .refine((file) => file.size <= MAX_PHOTO_SIZE, {
      message: "Photo size must not exceed 2MB."
    })
    .optional()
    .nullable()
})

export type UpdateTrainerData = z.infer<typeof UpdateTrainerValidation>

export const CreateTrainerSlotValidation = z
  .object({
    trainerId: rules.trainerId,
    slotDate: rules.slotDate,
    startHour: rules.startHour,
    endHour: rules.endHour,
    description: z.string().trim().optional()
  })
  .refine(
    (data) => {
      const [sh, sm] = data.startHour.split(":").map(Number)
      const [eh, em] = data.endHour.split(":").map(Number)
      return eh * 60 + em > sh * 60 + sm
    },
    {
      message: "End time must be later than start time.",
      path: ["endHour"]
    }
  )
  .refine(
    (data) => {
      const startDateTime = new Date(`${data.slotDate}T${data.startHour}`)
      return startDateTime.getTime() >= Date.now()
    },
    {
      message: "Start time must be now or in the future.",
      path: ["startHour"]
    }
  )

export type CreateTrainerSlotData = z.infer<typeof CreateTrainerSlotValidation>
