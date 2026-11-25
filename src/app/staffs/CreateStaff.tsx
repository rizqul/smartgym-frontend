import { useState } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, Save, Info } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"

import { CreateStaffValidation, type CreateStaffData } from "~/validation/staff"
import { useCreateStaffMutation } from "~/services/staff.service"

export default function CreateStaff() {
  const navigate = useNavigate()
  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateStaffData>({
    resolver: zodResolver(CreateStaffValidation),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: ""
    }
  })

  const onSubmit = async (data: CreateStaffData) => {
    try {
      await createStaff(data).unwrap()
      toast.success("New staff member registered successfully!")
      navigate("/dashboard/staffs")
    } catch {
      toast.error("Failed to register the staff member. Please check your information.")
    }
  }

  const isBusy = isSubmitting || isCreating

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/staffs")}
          aria-label="Back to staff list"
          className="text-text-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Staff Member</h1>
          <p className="text-text-secondary mt-1 text-[13px]">Register a new staff account in the SmartGym operations system.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Basic Staff Information</h2>
          <p className="text-text-secondary text-[12px]">Enter the profile details and initial password for the staff account.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  placeholder="Enter the name as shown on the ID"
                  icon={User}
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="email@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="WhatsApp / Phone Number"
                inputMode="numeric"
                type="tel"
                placeholder="081234567890"
                icon={Phone}
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
                }}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="password"
                  placeholder="Min. 8 characters"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register("password")}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted cursor-pointer transition-colors hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="bg-primary/10 border-primary/20 flex items-start gap-3 rounded-xl border p-4">
              <Info className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex flex-col">
                  <span className="text-primary text-[13px] font-semibold">About System Access</span>
                <span className="text-primary/80 mt-1 text-[12px]">
                  Share this email address and initial password with the staff member. <strong>Admins</strong> have full access,
                  while <strong>Staff/Receptionists</strong> can only access daily operations modules.
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/staffs")}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isBusy}
                disabled={isBusy}
                leftIcon={!isBusy && <Save className="h-4 w-4" />}
                className="font-bold"
              >
                {isBusy ? "Saving..." : "Save Staff Details"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
