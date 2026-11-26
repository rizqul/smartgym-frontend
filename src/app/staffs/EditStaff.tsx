import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { ArrowLeft, User as UserIcon, Mail, Phone, Lock, Save, Upload, X } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import { getAvatarUrl } from "~/utils/avatar"
import { UpdateStaffValidation, type UpdateStaffData } from "~/validation/staff"
import { useUpdateStaffMutation } from "~/services/staff.service"
import type { User } from "~/types/user.type"

const MAX_PHOTO_SIZE = 2 * 1024 * 1024
const ALLOWED_PHOTO_TYPES = ["image/png", "image/jpg", "image/jpeg"]

export default function EditStaff() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  const staffData = (location.state as { staff?: User } | null)?.staff
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation()

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)

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

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhotoError(null)

    if (!file) return

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Photo must be a PNG, JPG, or JPEG file.")
      e.target.value = ""
      return
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Photo size must not exceed 2MB.")
      e.target.value = ""
      return
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleClearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoError(null)
  }

  const onSubmit = async (data: UpdateStaffData) => {
    if (!id) return

    const formData = new FormData()
    formData.append("name", data.name.trim())
    formData.append("email", data.email.trim())
    formData.append("phoneNumber", data.phoneNumber.trim())

    if (data.password && data.password.trim().length > 0) {
      formData.append("password", data.password.trim())
    }

    if (photoFile) {
      formData.append("photo", photoFile)
    }

    try {
      const res = await updateStaff({ id, data: formData }).unwrap()
      toast.success(res?.message || "Staff data updated successfully!")
      navigate("/dashboard/staffs")
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Failed to update staff data.")
    }
  }

  const currentAvatar = photoPreview || getAvatarUrl(staffData?.name ?? "Staff", staffData?.profileUrl)

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
          <p className="text-text-secondary text-[12px]">Leave the photo and password blank if you do not want to change them.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-col items-start gap-4 rounded-xl border border-white/5 bg-[#0B0C10]/60 p-4 sm:flex-row sm:items-center">
              <img
                src={currentAvatar}
                alt={staffData?.name || "Staff"}
                className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover"
              />
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs font-semibold text-white">Profile Photo (Optional)</span>
                <p className="text-text-muted text-[11px]">PNG, JPG, or JPEG format. Maximum size 2MB.</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10">
                    <Upload className="h-3.5 w-3.5" />
                    Choose New Photo
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoFile && (
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="text-text-muted inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs hover:bg-white/5 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear ({photoFile.name})
                    </button>
                  )}
                </div>
                {photoError && <p className="text-danger text-xs font-medium">{photoError}</p>}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
