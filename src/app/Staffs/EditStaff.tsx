import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import { ArrowLeft, User, Mail, Phone, Save, Activity, Info, ShieldCheck } from "lucide-react"

import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Select } from "../../components/ui/Select"

const updateStaffSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  phoneNumber: z.string().min(10, "Nomor telepon wajib diisi (min. 10 angka)"),
  role: z.enum(["ADMIN", "STAFF"]),
  status: z.enum(["Active", "Inactive"])
})

type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>

export default function EditStaff() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isFetching, setIsFetching] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UpdateStaffFormValues>({
    resolver: zodResolver(updateStaffSchema)
  })

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setIsFetching(true)
        console.log(`Mengambil data staf dengan ID: ${id}`)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockDataFromBackend = {
          name: "Siti Rahma",
          email: "siti.frontdesk@smartgym.id",
          phoneNumber: "085678901234",
          role: "STAFF" as const,
          status: "Active" as const
        }

        reset(mockDataFromBackend)
      } catch (error) {
        toast.error("Gagal mengambil data staf.")
        navigate("/dashboard/staffs")
      } finally {
        setIsFetching(false)
      }
    }

    if (id) {
      fetchStaffData()
    }
  }, [id, reset, navigate])

  const onSubmit = async (data: UpdateStaffFormValues) => {
    try {
      console.log("Payload Update ke Backend (DTO):", { id, ...data })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Data staf berhasil diperbarui!")

      setTimeout(() => {
        navigate("/dashboard/staffs")
      }, 1000)
    } catch (error) {
      toast.error("Gagal memperbarui data staf. Silakan coba lagi.")
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <p className="text-text-muted animate-pulse font-medium">Memuat data staf...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/staffs")}
          className="text-text-muted flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Edit Data Staf</h1>
            <span className="bg-primary/20 text-primary border-primary/20 rounded-md border px-2 py-0.5 text-[11px] font-bold">
              ID: {id}
            </span>
          </div>
          <p className="text-text-secondary mt-1 text-[13px]">Perbarui informasi kontak, peran, dan status akun staf.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Informasi Dasar Staf</h2>
          <p className="text-text-secondary text-[12px]">Ubah nama, kontak, peran (role), atau nonaktifkan akun staf.</p>
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
                type="tel"
                placeholder="081234567890"
                icon={Phone}
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
              />

              <div className="space-y-1">
                <label className="text-text-secondary text-[13px] font-medium">Peran / Hak Akses</label>
                <div className="relative">
                  <Select
                    {...register("role")}
                    className="pl-10"
                  >
                    <option value="ADMIN">Administrator</option>
                    <option value="STAFF">Staf / Resepsionis</option>
                  </Select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <ShieldCheck className="text-text-muted h-4 w-4" />
                  </div>
                </div>
                {errors.role && <p className="text-danger mt-1 text-[12px]">{errors.role.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-text-secondary text-[13px] font-medium">Status Akun</label>
                <div className="relative">
                  <Select
                    {...register("status")}
                    className="pl-10"
                  >
                    <option value="Active">Aktif</option>
                    <option value="Inactive">Tidak Aktif</option>
                  </Select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Activity className="text-text-muted h-4 w-4" />
                  </div>
                </div>
                {errors.status && <p className="text-danger mt-1 text-[12px]">{errors.status.message}</p>}
              </div>
            </div>

            <div className="bg-primary/10 border-primary/20 flex items-start gap-3 rounded-xl border p-4">
              <Info className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-primary text-[13px] font-semibold">Terkait Perubahan Password</span>
                <span className="text-primary/80 mt-1 text-[12px]">
                  Untuk alasan keamanan, perubahan kata sandi hanya dapat dilakukan oleh staf secara mandiri melalui menu "Lupa Password" di
                  halaman login.
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/staffs")}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={!isSubmitting && <Save className="h-4 w-4" />}
                className="font-bold"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
