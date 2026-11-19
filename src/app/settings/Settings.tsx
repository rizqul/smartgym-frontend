import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { CheckCircle, Camera, Mail, Calendar, UserCircle, History, Eye, EyeOff, Info, CloudLightning, Copy, BadgeCheck } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import LocalDate from "~/components/ui/LocalDate"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import { getAvatarUrl } from "~/utils/avatar"
import { useGetProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation } from "~/services/user"
import { profileSchema, type ProfileFormValues } from "~/validation/profile"

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
        await updateProfile({
          name: values.fullName.trim(),
          phoneNumber: values.phone.trim(),
          profileUrl: profile.profileUrl || undefined
        }).unwrap()
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
      <PageSkeleton
        statCount={0}
        contentVariant="list"
      />
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
      {/* Header */}
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

      {/* Main Form Grid */}
      <form
        id="profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12"
      >
        {/* Baris 1 Kiri: Kartu Profil */}
        <Card className="flex flex-col lg:col-span-4">
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
                  className="bg-primary absolute -right-2.5 -bottom-2.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-[3px] border-[#1C1F26] text-white transition-transform hover:scale-105"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <h2 className="text-center text-base font-bold text-white">{profile.name}</h2>

              <div className="border-primary/20 bg-primary/10 mt-2 flex items-center gap-1.5 rounded-md border px-2.5 py-1">
                <BadgeCheck className="text-primary h-3.5 w-3.5" />
                <span className="text-primary text-[10px] font-bold tracking-wider uppercase">{profile.role}</span>
              </div>

              <div className="my-5 w-full border-t border-white/5" />

              <div className="w-full space-y-3 text-[13px]">
                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start lg:gap-1 xl:flex-row xl:items-center xl:gap-3">
                  <span className="text-text-muted flex shrink-0 items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>
                  <span className="w-full truncate font-medium text-white lg:pl-6 xl:w-auto xl:pl-0">{profile.email}</span>
                </div>

                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start lg:gap-1 xl:flex-row xl:items-center xl:gap-3">
                  <span className="text-text-muted flex shrink-0 items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Bergabung
                  </span>
                  <LocalDate
                    date={profile.createdAt}
                    className="w-full truncate font-medium text-white lg:pl-6 xl:w-auto xl:pl-0"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Baris 1 Kanan: Informasi Pribadi */}
        <Card className="flex flex-col lg:col-span-8">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5">
              <UserCircle className="text-text-secondary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">Informasi Pribadi</h3>
              <p className="text-text-secondary text-[12px]">Perbarui rincian kontak dan profil identitas akun Anda.</p>
            </div>
          </CardHeader>

          <CardContent className="grid flex-1 grid-cols-1 content-center gap-4 pt-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </div>
            <Input
              label="Email Resmi"
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
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
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

        {/* Baris 2 Full Width: Keamanan Kata Sandi */}
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
                label="Konfirmasi Sandi"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi sandi"
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

      {/* Footer Info */}
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
    </div>
  )
}
