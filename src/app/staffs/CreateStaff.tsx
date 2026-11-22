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
import { useCreateStaffMutation } from "~/services/staff"

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
      toast.success("Staf baru berhasil didaftarkan!")
      navigate("/dashboard/staffs")
    } catch {
      toast.error("Gagal mendaftarkan staf. Silakan periksa kembali data Anda.")
    }
  }

  const isBusy = isSubmitting || isCreating

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/staffs")}
          aria-label="Kembali ke daftar staf"
          className="text-text-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah Staf Baru</h1>
          <p className="text-text-secondary mt-1 text-[13px]">Daftarkan akun staf baru ke dalam sistem operasional SmartGym.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Informasi Dasar Staf</h2>
          <p className="text-text-secondary text-[12px]">Lengkapi data profil dan kata sandi awal akun staf.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama sesuai identitas"
                  icon={User}
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <Input
                label="Alamat Email"
                type="email"
                placeholder="email@contoh.com"
                icon={Mail}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Nomor WhatsApp / Telepon"
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
                  label="Kata Sandi Awal"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter"
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
                <span className="text-primary text-[13px] font-semibold">Terkait Akses Sistem</span>
                <span className="text-primary/80 mt-1 text-[12px]">
                  Berikan email dan kata sandi awal ini kepada staf yang bersangkutan. Staf <strong>Admin</strong> memiliki hak penuh,
                  sedangkan <strong>Staf/Resepsionis</strong> hanya dapat mengakses modul operasional harian.
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
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isBusy}
                disabled={isBusy}
                leftIcon={!isBusy && <Save className="h-4 w-4" />}
                className="font-bold"
              >
                {isBusy ? "Menyimpan..." : "Simpan Data Staf"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
