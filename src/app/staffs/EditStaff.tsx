import { useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { ArrowLeft, User as UserIcon, Mail, Phone, Lock, Save } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import { UpdateStaffValidation, type UpdateStaffData } from "~/validation/staff"
import { useUpdateStaffMutation } from "~/services/staff"
import type { User } from "~/types/user"

export default function EditStaff() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  const staffData = (location.state as { staff?: User } | null)?.staff
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateStaffData>({
    resolver: zodResolver(UpdateStaffValidation)
  })

  useEffect(() => {
    if (!staffData) {
      toast.error("Staff data not found.")
      navigate("/dashboard/staffs")
      return
    }

    reset({
      name: staffData.name ?? "",
      email: staffData.email ?? "",
      phoneNumber: staffData.phoneNumber ?? "",
      password: ""
    })
  }, [staffData, reset, navigate])

  const onSubmit = async (data: UpdateStaffData) => {
    if (!id) return

    try {
      const res = await updateStaff({
        id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        ...(data.password ? { password: data.password } : {})
      }).unwrap()

      toast.success(res?.message || "Staff data updated successfully!")
      navigate("/dashboard/staffs")
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Failed to update staff data.")
    }
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/staffs")}
          aria-label="Back"
          className="text-text-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Staff Data</h1>
          <p className="text-text-secondary mt-1 text-[13px]">Update the basic information and contact details for the staff account.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Staff Basic Information</h2>
          <p className="text-text-secondary text-[12px]">Change the staff name, email, phone number, or reset their password.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mt-4">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  placeholder="Enter the name shown on their identification"
                  icon={UserIcon}
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
                type="tel"
                placeholder="081234567890"
                icon={Phone}
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
              />

              <div className="sm:col-span-2">
                <Input
                  label="New Password (Optional)"
                  type="password"
                  placeholder="Leave blank if you do not want to change the password"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/staffs")}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isUpdating}
                leftIcon={!isUpdating && <Save className="h-4 w-4" />}
                className="font-bold"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
