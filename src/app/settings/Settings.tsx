import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import {
  CheckCircle,
  Camera,
  Mail,
  Calendar,
  UserCircle,
  History,
  Eye,
  EyeOff,
  Info,
  CloudLightning,
  Copy,
  BadgeCheck
} from "lucide-react"

import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"

const profileSchema = z
  .object({
    fullName: z.string().min(1, "Nama lengkap wajib diisi"),
    username: z.string().min(1, "Username wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    phone: z.string().min(10, "Nomor telepon tidak valid"),
    bio: z.string().optional(),

    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 8) return false
      return true
    },
    {
      message: "Kata sandi baru minimal 8 karakter",
      path: ["newPassword"]
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) return false
      return true
    },
    {
      message: "Konfirmasi kata sandi tidak cocok",
      path: ["confirmPassword"]
    }
  )

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Marcus Vance, S.Kom",
      email: "marcus.vance@smartgym.id",
      phone: "+62 812-9876-5432",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Data Profil Tersimpan:", data)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success("Profil dan akun berhasil diperbarui!")
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("+62 812-9876-5432")
    toast.success("Nomor telepon disalin!")
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pengaturan Profil & Akun</h1>
          <p className="text-text-secondary mt-1 text-[14px]">Kelola informasi profil pribadi dan keamanan kata sandi akun Anda.</p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          className="w-full font-bold sm:w-auto"
          leftIcon={!isSubmitting && <CheckCircle className="h-4 w-4" />}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card className="lg:sticky lg:top-8">
          <CardContent className="flex flex-col items-center pt-8">
            <div className="relative my-5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                alt="Profile Avatar"
                className="h-28 w-28 rounded-2xl border border-white/10 object-cover shadow-lg"
              />
              <button className="bg-primary absolute -right-3 -bottom-3 flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-[#1C1F26] text-white transition-transform hover:scale-105">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-white">Marcus Vance, S.Kom</h2>

            <div className="border-primary/20 bg-primary/10 mt-3 flex items-center gap-1.5 rounded-md border px-2.5 py-1">
              <BadgeCheck className="text-primary h-3.5 w-3.5" />
              <span className="text-primary text-[10px] font-bold tracking-wider uppercase">Administrator</span>
            </div>

            <div className="my-6 w-full border-t border-white/4"></div>

            <div className="w-full space-y-4 text-[13px]">
              <div className="flex items-center gap-3">
                <Mail className="text-text-muted h-4 w-4" />
                <span className="text-text-muted w-20">Email</span>
                <span className="truncate font-medium text-white">marcus.vance@smartgym.id</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-text-muted h-4 w-4" />
                <span className="text-text-muted w-20">Bergabung</span>
                <span className="font-medium text-white">12 Jan 2022</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <form
            id="profile-form"
            className="space-y-6"
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5">
                  <UserCircle className="text-text-secondary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white">Informasi Pribadi</h3>
                  <p className="text-text-secondary text-[12px]">Perbarui rincian kontak dan profil identitas akun Anda.</p>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-5 pt-4 sm:grid-cols-2">
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <Input
                  label="Email Resmi"
                  type="email"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="No. WhatsApp / Telepon"
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

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5">
                  <History className="text-text-secondary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white">Keamanan Kata Sandi</h3>
                  <p className="text-text-secondary text-[12px]">Ubah kata sandi secara berkala untuk menjaga keamanan akun Anda.</p>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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

                <div className="text-text-muted mt-5 flex items-center gap-2 rounded-lg border border-white/5 bg-[#0B0C10] p-3">
                  <Info className="text-primary h-4 w-4 shrink-0" />
                  <span className="text-[12px]">Gunakan kombinasi minimal 8 karakter dengan huruf kapital, angka, dan simbol.</span>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      <div className="text-text-muted flex items-center gap-2 px-2 py-4">
        <CloudLightning className="text-primary h-4 w-4" />
        <span className="text-[12px] font-medium">
          Perubahan terakhir disimpan otomatis pada 25 Okt 2026, 15:45 WIB oleh System Daemon.
        </span>
      </div>
    </div>
  )
}
