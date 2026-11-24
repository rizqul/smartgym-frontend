import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { ArrowLeft, Dumbbell, Save, UserCircle } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import { Button } from "~/components/ui/Button"
import { useCreateTrainerMutation } from "~/services/trainer"
import { CreateTrainerValidation, type CreateTrainerData } from "~/validation/trainer"

const SPECIALIZATION_OPTIONS = [
  { value: "GENERAL_FITNESS", label: "General Fitness" },
  { value: "WEIGHT_LOSS", label: "Weight Loss" },
  { value: "BODYBUILDING", label: "Bodybuilding" },
  { value: "STRENGTH_CONDITIONING", label: "Strength & Conditioning" },
  { value: "FUNCTIONAL_TRAINING", label: "Functional Training" },
  { value: "CARDIO_ENDURANCE", label: "Cardio & Endurance" },
  { value: "MOBILITY_FLEXIBILITY", label: "Mobility & Flexibility" },
  { value: "CORRECTIVE_REHAB", label: "Corrective & Rehab" },
  { value: "SPORTS_PERFORMANCE", label: "Sports Performance" }
]

export default function CreateTrainer() {
  const navigate = useNavigate()
  const [createTrainer, { isLoading }] = useCreateTrainerMutation()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateTrainerData>({
    resolver: zodResolver(CreateTrainerValidation),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      experience: "",
      rate: ""
    }
  })

  const onSubmit = async (values: CreateTrainerData) => {
    try {
      const res = await createTrainer(values).unwrap()
      toast.success(res?.message || "Trainer added successfully!")
      navigate("/dashboard/trainers")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add trainer.")
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/trainers")}
            className="text-text-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-[#1C1F26] transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white lg:text-2xl">Add New Trainer</h1>
            <p className="text-text-secondary mt-0.5 text-[13px]">Register a new instructor with their specialization and session rate.</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5">
              <UserCircle className="text-text-secondary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">Trainer Information</h3>
              <p className="text-text-secondary text-[12px]">The instructor's basic details and contact information.</p>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Full Name"
                placeholder="Example: Rio Santoso"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="Example: rio@smartgym.id"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="WhatsApp / Phone Number"
              type="tel"
              inputMode="numeric"
              placeholder="Example: 081234567890"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5">
              <Dumbbell className="text-text-secondary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">Training Details &amp; Rate</h3>
              <p className="text-text-secondary text-[12px]">Set the specialization, years of experience, and PT session rate.</p>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-semibold tracking-wider uppercase">Specialization</label>
              <Select
                {...register("specialization")}
                className="focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
              >
                <option value="">Select Specialization</option>
                {SPECIALIZATION_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors.specialization?.message && <span className="text-xs text-red-400">{errors.specialization.message}</span>}
            </div>

            <Input
              label="Experience (Years)"
              type="text"
              inputMode="numeric"
              placeholder="Example: 5"
              error={errors.experience?.message}
              {...register("experience")}
            />

            <Input
              label="Rate per Session (Rp)"
              type="text"
              inputMode="numeric"
              placeholder="Example: 150000"
              error={errors.rate?.message}
              {...register("rate")}
            />

            <div className="col-span-full mt-2 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/trainers")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                isLoading={isLoading}
                className="w-full font-bold sm:w-auto"
                leftIcon={!isLoading && <Save className="h-4 w-4" />}
              >
                {isLoading ? "Saving..." : "Save Trainer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
