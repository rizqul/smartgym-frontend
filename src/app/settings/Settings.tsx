import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useGetProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation } from "~/services/user"
import { profileSchema, type ProfileFormValues } from "~/validation/profile"

const MAX_FILE_SIZE = 2 * 1024 * 1024

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profileRes, isLoading, isError, refetch } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation()

  const profile = profileRes?.data
  const isSaving = isUpdatingProfile || isUpdatingPassword

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

  const processSelectedFile = (file?: File) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WebP).")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran foto maksimal 2MB.")
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedPhoto(file)
    setPreviewUrl(URL.createObjectURL(file))
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
    if (isUpdatingProfile) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedPhoto(null)
    setPreviewUrl(null)
    setIsDragging(false)
    setIsPhotoModalOpen(false)
  }

  const handleSavePhoto = async () => {
    if (!profile || !selectedPhoto) return

    try {
      const formData = new FormData()
      formData.append("name", profile.name)
      formData.append("phoneNumber", profile.phoneNumber)
      formData.append("photo", selectedPhoto)

      await updateProfile(formData).unwrap()
      toast.success("Foto profil berhasil diperbarui!")
      handleClosePhotoModal()
    } catch (error: any) {
      toast.error(error?.data?.message || "Gagal memperbarui foto profil.")
    }
  }

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return

    const isProfileChanged = values.fullName.trim() !== (profile.name || "") || values.phone.trim() !== (profile.phoneNumber || "")

    const isPasswordFilled = Boolean(values.currentPassword && values.newPassword)

    if (!isProfileChanged && !isPasswordFilled) {
      toast("Tidak ada perubahan untuk disimpan.")
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
        toast.success("Profil dan kata sandi berhasil diperbarui!")
      } else if (isPasswordFilled) {
        toast.success("Kata sandi berhasil diperbarui!")
      } else {
        toast.success("Profil berhasil diperbarui!")
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Gagal menyimpan perubahan.")
    }
  }

  const handleCopyPhone = () => {
    if (!profile?.phoneNumber) return
    navigator.clipboard.writeText(profile.phoneNumber)
    toast.success("Nomor telepon disalin!")
  }

  const handleCopyEmail = () => {
    if (!profile?.email) return
    navigator.clipboard.writeText(profile.email)
    toast.success("Alamat email disalin!")
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
        <p className="text-sm text-red-400">Gagal memuat data profil.</p>
        <Button
          variant="secondary"
          onClick={() => refetch()}
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white lg:text-2xl">Pengaturan Profil &amp; Akun</h1>
          <p className="text-text-secondary mt-0.5 text-[13px]">Kelola informasi profil pribadi dan keamanan kata sandi akun Anda.</p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSaving}
          className="w-full font-bold sm:w-auto"
          leftIcon={!isSaving && <CheckCircle className="h-4 w-4" />}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
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
                  title="Ubah foto profil"
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
                    Bergabung
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
              <h3 className="text-[15px] font-bold text-white">Informasi Pribadi</h3>
              <p className="text-text-secondary text-[12px]">Perbarui rincian kontak dan profil identitas akun Anda.</p>
            </div>
          </CardHeader>

          <CardContent className="grid flex-1 grid-cols-1 content-center gap-4 pt-4 xl:grid-cols-2">
            <div className="xl:col-span-2">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </div>
            <Input
              label="Email"
              type="email"
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
              label="No. WhatsApp"
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
              <h3 className="text-[15px] font-bold text-white">Keamanan Kata Sandi</h3>
              <p className="text-text-secondary text-[12px]">Ubah kata sandi secara berkala untuk menjaga keamanan akun Anda.</p>
            </div>
          </CardHeader>

          <CardContent className="pt-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Kata Sandi Saat Ini"
                type={showCurrentPassword ? "text" : "password"}
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
                label="Kata Sandi Baru"
                type={showNewPassword ? "text" : "password"}
                placeholder="Min. 8 karakter"
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
                label="Konfirmasi Kata Sandi"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi Kata sandi"
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
              <span className="text-[12px]">Gunakan kombinasi minimal 8 karakter dengan huruf kapital, angka, dan simbol.</span>
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="text-text-muted flex items-center gap-2 px-1">
        <CloudLightning className="text-primary h-4 w-4 shrink-0" />
        <span className="text-[12px] font-medium">
          Terakhir diperbarui pada{" "}
          <LocalDate
            date={profile.updatedAt}
            className="text-white"
          />
          .
        </span>
      </div>

      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={handleClosePhotoModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1C1F26] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Ubah Foto Profil</h3>
                <p className="text-text-secondary text-xs">Unggah foto baru dengan format JPG, PNG, atau WebP (maks. 2MB).</p>
              </div>
              <button
                type="button"
                onClick={handleClosePhotoModal}
                className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 flex flex-col items-center">
              <img
                src={previewUrl || getAvatarUrl(profile.name, profile.profileUrl)}
                alt="Preview Foto Profil"
                className="h-32 w-32 rounded-2xl border border-white/10 object-cover shadow-md"
              />
              {selectedPhoto && (
                <span className="text-text-secondary mt-2 max-w-full truncate text-xs">
                  {selectedPhoto.name} ({(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/10" : "border-white/10 bg-[#0B0C10]/60 hover:border-white/25"
              }`}
            >
              <UploadCloud className={`mb-2 h-8 w-8 ${isDragging ? "text-primary" : "text-text-muted"}`} />
              <p className="text-sm font-medium text-white">
                Tarik &amp; lepas foto di sini, atau <span className="text-primary underline">pilih file</span>
              </p>
              <p className="text-text-muted mt-1 text-[11px]">JPG, PNG, WebP • Maksimal 2MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClosePhotoModal}
                disabled={isUpdatingProfile}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSavePhoto}
                disabled={!selectedPhoto}
                isLoading={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Mengunggah..." : "Simpan Foto"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
