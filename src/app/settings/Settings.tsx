import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Cropper, { type Area } from "react-easy-crop"
import toast from "react-hot-toast"
import {
  CheckCircle,
  Pencil,
  Mail,
  Calendar,
  UserCircle,
  History,
  Eye,
  EyeOff,
  Info,
  CloudLightning,
  Copy,
  BadgeCheck,
  UploadCloud,
  X
} from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import LocalDate from "~/components/ui/LocalDate"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import { getAvatarUrl } from "~/utils/avatar"
import { getCroppedImageFile } from "~/utils/cropImage"
import { useGetProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation } from "~/services/user"
import { profileSchema, type ProfileFormValues } from "~/validation/profile"

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ["image/png", "image/jpeg"]

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessingCrop, setIsProcessingCrop] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profileRes, isLoading, isError, refetch } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation()

  const profile = profileRes?.data
  const isSaving = isUpdatingProfile || isUpdatingPassword
  const isPhotoSubmitting = isUpdatingProfile || isProcessingCrop

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.name || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    }
  }, [profile, reset])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const processSelectedFile = (file?: File) => {
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Photo must be a PNG, JPG, or JPEG file.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Photo size must not exceed 2MB.")
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedPhoto(file)
    setPreviewUrl(URL.createObjectURL(file))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processSelectedFile(e.target.files?.[0])
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    processSelectedFile(e.dataTransfer.files?.[0])
  }

  const handleClosePhotoModal = () => {
    if (isPhotoSubmitting) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedPhoto(null)
    setPreviewUrl(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setIsDragging(false)
    setIsPhotoModalOpen(false)
  }

  const handleSavePhoto = async () => {
    if (!profile || !selectedPhoto || !previewUrl || !croppedAreaPixels) return

    try {
      setIsProcessingCrop(true)

      const isPng = selectedPhoto.type === "image/png"
      const mimeType = isPng ? "image/png" : "image/jpeg"
      const ext = isPng ? ".png" : ".jpg"

      const croppedFile = await getCroppedImageFile(previewUrl, croppedAreaPixels, selectedPhoto.name.replace(/\.[^/.]+$/, ext), mimeType)

      const formData = new FormData()
      formData.append("name", profile.name)
      formData.append("phoneNumber", profile.phoneNumber)
      formData.append("photo", croppedFile)

      await updateProfile(formData).unwrap()
      toast.success("Profile photo updated successfully!")
      setIsProcessingCrop(false)
      handleClosePhotoModal()
    } catch (error: any) {
      setIsProcessingCrop(false)
      toast.error("Failed to update profile photo.")
    }
  }

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return

    const isProfileChanged = values.fullName.trim() !== (profile.name || "") || values.phone.trim() !== (profile.phoneNumber || "")

    const isPasswordFilled = Boolean(values.currentPassword && values.newPassword)

    if (!isProfileChanged && !isPasswordFilled) {
      toast("There are no changes to save.")
      return
    }

    try {
      if (isProfileChanged) {
        const formData = new FormData()
        formData.append("name", values.fullName.trim())
        formData.append("phoneNumber", values.phone.trim())

        await updateProfile(formData).unwrap()
      }

      if (isPasswordFilled) {
        await updatePassword({
          email: profile.email,
          oldPassword: values.currentPassword!,
          newPassword: values.newPassword!
        }).unwrap()
      }

      reset({
        fullName: values.fullName.trim(),
        email: profile.email,
        phone: values.phone.trim(),
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })

      if (isProfileChanged && isPasswordFilled) {
        toast.success("Profile and password updated successfully!")
      } else if (isPasswordFilled) {
        toast.success("Password updated successfully!")
      } else {
        toast.success("Profile updated successfully!")
      }
    } catch (error: any) {
      toast.error("Failed to save changes.")
    }
  }

  const handleCopyPhone = () => {
    if (!profile?.phoneNumber) return
    navigator.clipboard.writeText(profile.phoneNumber)
    toast.success("Phone number copied!")
  }

  const handleCopyEmail = () => {
    if (!profile?.email) return
    navigator.clipboard.writeText(profile.email)
    toast.success("Email address copied!")
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4 lg:p-6">
        <PageSkeleton
          statCount={0}
          contentVariant="profile"
        />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-red-400">Failed to load profile data.</p>
        <Button
          variant="secondary"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white lg:text-2xl">Profile &amp; Account Settings</h1>
          <p className="text-text-secondary mt-0.5 text-[13px]">Manage your personal profile information and account password security.</p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSaving}
          className="w-full font-bold sm:w-auto"
          leftIcon={!isSaving && <CheckCircle className="h-4 w-4" />}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form
        id="profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12"
      >
        <Card className="flex flex-col lg:col-span-6 xl:col-span-4">
          <CardContent className="flex flex-1 flex-col justify-center">
            <div className="flex flex-col items-center pt-6 pb-2">
              <div className="relative mb-4">
                <img
                  src={getAvatarUrl(profile.name, profile.profileUrl)}
                  alt={profile.name}
                  className="h-32 w-32 rounded-2xl border border-white/10 object-cover shadow-lg sm:h-36 sm:w-36"
                />
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  title="Change profile photo"
                  className="bg-primary absolute -right-2.5 -bottom-2.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-[3px] border-[#1C1F26] text-white transition-transform hover:scale-105"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <h2 className="text-center text-base font-bold text-white">{profile.name}</h2>

              <div className="border-primary/20 bg-primary/10 mt-2 flex items-center gap-1.5 rounded-md border px-2.5 py-1">
                <BadgeCheck className="text-primary h-3.5 w-3.5" />
                <span className="text-primary text-[10px] font-bold tracking-wider uppercase">{profile.role}</span>
              </div>

              <div className="my-5 w-full border-t border-white/5" />

              <div className="w-full space-y-3 text-[13px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-muted flex shrink-0 items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>
                  <span className="truncate font-medium text-white">{profile.email}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-muted flex shrink-0 items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined
                  </span>
                  <LocalDate
                    date={profile.createdAt}
                    className="shrink-0 font-medium text-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col lg:col-span-6 xl:col-span-8">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5">
              <UserCircle className="text-text-secondary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">Personal Information</h3>
              <p className="text-text-secondary text-[12px]">Update your account contact details and profile information.</p>
            </div>
          </CardHeader>

          <CardContent className="grid flex-1 grid-cols-1 content-center gap-4 pt-4 xl:grid-cols-2">
            <div className="xl:col-span-2">
              <Input
                label="Full Name"
                autoComplete="name"
                placeholder="Enter your full name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </div>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              disabled
              className="cursor-not-allowed opacity-60"
              error={errors.email?.message}
              {...register("email")}
              rightElement={
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-primary transition-colors hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </button>
              }
            />
            <Input
                label="WhatsApp Number"
              autoComplete="tel"
              inputMode="numeric"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
              }}
              rightElement={
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="text-primary transition-colors hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </button>
              }
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-12">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5">
              <History className="text-text-secondary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">Password Security</h3>
              <p className="text-text-secondary text-[12px]">Change your password regularly to keep your account secure.</p>
            </div>
          </CardHeader>

          <CardContent className="pt-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                error={errors.currentPassword?.message}
                {...register("currentPassword")}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-text-muted hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <Input
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                error={errors.newPassword?.message}
                {...register("newPassword")}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-text-muted hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-text-muted hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <div className="text-text-muted mt-4 flex items-center gap-2 rounded-lg border border-white/5 bg-[#0B0C10] px-3 py-2.5">
              <Info className="text-primary h-4 w-4 shrink-0" />
              <span className="text-[12px]">Use a combination of at least 8 characters, including uppercase letters, numbers, and symbols.</span>
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="text-text-muted flex items-center gap-2 px-1">
        <CloudLightning className="text-primary h-4 w-4 shrink-0" />
        <span className="text-[12px] font-medium">
          Last updated on{" "}
          <LocalDate
            date={profile.updatedAt}
            className="text-white"
          />
          .
        </span>
      </div>

      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 top-16 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm lg:left-64"
          onClick={() => !isPhotoSubmitting && handleClosePhotoModal()}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#1C1F26] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Change Profile Photo</h3>
                <p className="text-text-secondary text-xs">
                  {previewUrl
                    ? "Drag and adjust the zoom to crop your photo."
                    : "Upload a new JPG, PNG, or WebP photo (max. 2MB)."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClosePhotoModal}
                disabled={isPhotoSubmitting}
                aria-label="Close dialog"
                className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              disabled={isPhotoSubmitting}
              className="hidden"
            />

            {previewUrl ? (
              <div className="flex flex-col gap-3">
                <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0B0C10]">
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="rect"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-1 items-center gap-2.5">
                    <span className="text-text-muted text-xs font-medium">Zoom</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      disabled={isPhotoSubmitting}
                      className="accent-primary h-1.5 w-full cursor-pointer rounded-lg bg-white/10"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPhotoSubmitting}
                    className="text-primary hover:text-primary-hover cursor-pointer text-xs font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Change Photo
                  </button>
                </div>

                {selectedPhoto && (
                  <span className="text-text-secondary truncate text-center text-xs">
                    {selectedPhoto.name} ({(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col items-center">
                  <img
                    src={getAvatarUrl(profile.name, profile.profileUrl)}
                    alt="Profile photo preview"
                    className="h-32 w-32 rounded-2xl border border-white/10 object-cover shadow-md"
                  />
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isPhotoSubmitting && fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/10" : "border-white/10 bg-[#0B0C10]/60 hover:border-white/25"
                  }`}
                >
                  <UploadCloud className={`mb-2 h-8 w-8 ${isDragging ? "text-primary" : "text-text-muted"}`} />
                  <p className="text-sm font-medium text-white">
                    Drag and drop a photo here, or <span className="text-primary underline">choose a file</span>
                  </p>
                  <p className="text-text-muted mt-1 text-[11px]">JPG, PNG, WebP • Maximum 2MB</p>
                </div>
              </>
            )}

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClosePhotoModal}
                disabled={isPhotoSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSavePhoto}
                disabled={!selectedPhoto || !croppedAreaPixels || isPhotoSubmitting}
                isLoading={isPhotoSubmitting}
              >
                {isPhotoSubmitting ? "Uploading..." : "Save Photo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
