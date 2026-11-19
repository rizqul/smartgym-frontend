import * as z from "zod"
import * as rules from "./zodRules"

export const CreateTrainerValidation = z.object({
  name: rules.name,
  email: rules.email,
  phoneNumber: rules.phoneNumber,
  specialization: rules.specialization,
  experience: rules.experience,
  rate: rules.rate
})

export type CreateTrainerData = z.infer<typeof CreateTrainerValidation>

export const CreateTrainerSlotValidation = z
  .object({
    trainerId: rules.trainerId,
    slotDate: rules.slotDate,
    startHour: rules.startHour,
    endHour: rules.endHour,
    quota: rules.quota,
    description: rules.description
  })
  .refine(
    (data) => {
      const [sh, sm] = data.startHour.split(":").map(Number)
      const [eh, em] = data.endHour.split(":").map(Number)
      return eh * 60 + em > sh * 60 + sm
    },
    {
      message: "Jam selesai harus lebih besar dari jam mulai.",
      path: ["endHour"]
    }
  )
  .refine(
    (data) => {
      const startDateTime = new Date(`${data.slotDate}T${data.startHour}`)
      return startDateTime.getTime() >= Date.now()
    },
    {
      message: "Waktu mulai harus di masa sekarang atau mendatang.",
      path: ["startHour"]
    }
  )

export type CreateTrainerSlotData = z.infer<typeof CreateTrainerSlotValidation>
