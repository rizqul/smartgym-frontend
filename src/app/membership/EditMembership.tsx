import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import { ArrowLeft, Tag, Package, CreditCard, Clock, Activity, Save, Info } from "lucide-react"

import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Select } from "../../components/ui/Select"

const editPackageSchema = z.object({
  tier: z.string().min(1, "Kategori Tier wajib diisi"),
  name: z.string().min(1, "Nama paket wajib diisi"),
  description: z.string().min(1, "Deskripsi paket wajib diisi"),
  price: z.string().min(1, "Harga wajib diisi"),
  period: z.string().min(1, "Periode wajib diisi"),
  activeInfo: z.string().min(1, "Info masa aktif wajib diisi"),
  features: z.string().min(1, "Minimal satu fasilitas wajib diisi"),
  status: z.enum(["Active", "Inactive"])
})

type EditPackageFormValues = z.infer<typeof editPackageSchema>

export default function EditMembership() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isFetching, setIsFetching] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EditPackageFormValues>({
    resolver: zodResolver(editPackageSchema)
  })

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setIsFetching(true)
        console.log(`Mengambil data paket dengan ID: ${id}`)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData = {
          tier: "ANNUAL VIP PASS",
          name: "Annual Pro VIP",
          description: "Akses tak terbatas seluruh fasilitas & ekosistem.",
          price: "4200000",
          period: "/ tahun",
          activeInfo: "Masa aktif: 365 Hari (Setara Rp 350.000/bln)",
          features: [
            "Akses prioritas 24/7 Gate & Sauna Suite",
            "Guest Pass 4x per tahun (Bawa teman)",
            "Diskon 10% SmartGym Cafe & Suplemen"
          ].join("\n"),
          status: "Active" as const
        }

        reset(mockData)
      } catch (error) {
        toast.error("Gagal mengambil data paket.")
        navigate("/dashboard/membership")
      } finally {
        setIsFetching(false)
      }
    }

    if (id) fetchPackageData()
  }, [id, reset, navigate])

  const onSubmit = async (data: EditPackageFormValues) => {
    try {
      const payload = {
        id,
        ...data,
        features: data.features.split("\n").filter((f) => f.trim() !== "")
      }
      console.log("Payload Update ke Backend (DTO):", payload)

      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success("Perubahan paket berhasil disimpan!")

      setTimeout(() => {
        navigate("/dashboard/membership")
      }, 1000)
    } catch (error) {
      toast.error("Gagal memperbarui paket. Silakan coba lagi.")
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <p className="text-text-muted animate-pulse font-medium">Memuat detail paket...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/membership")}
          className="text-text-muted flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Edit Paket Membership</h1>
            <span className="bg-primary/20 text-primary border-primary/20 rounded-md border px-2 py-0.5 text-[11px] font-bold">
              ID: {id}
            </span>
          </div>
          <p className="text-text-secondary mt-1 text-[13px]">Perbarui informasi harga, fasilitas, atau status publikasi paket.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Detail Paket Membership</h2>
          <p className="text-text-secondary text-[12px]">Hati-hati saat mengubah harga karena dapat memengaruhi pendaftar baru.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Kategori Tier"
                icon={Tag}
                error={errors.tier?.message}
                {...register("tier")}
              />
              <Input
                label="Nama Paket"
                icon={Package}
                error={errors.name?.message}
                {...register("name")}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Deskripsi Singkat"
                  icon={Info}
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              <Input
                label="Harga (Rp)"
                type="number"
                icon={CreditCard}
                error={errors.price?.message}
                {...register("price")}
              />
              <Input
                label="Format Periode"
                icon={Clock}
                error={errors.period?.message}
                {...register("period")}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Teks Masa Aktif"
                  icon={Clock}
                  error={errors.activeInfo?.message}
                  {...register("activeInfo")}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-text-secondary text-[13px] font-medium">Fasilitas Termasuk (Pisahkan dengan Enter)</label>
                <textarea
                  {...register("features")}
                  rows={5}
                  className={`focus:border-primary focus:ring-primary placeholder:text-text-muted w-full rounded-xl border bg-[#0B0C10] p-3 text-[13px] text-white transition-all focus:ring-1 focus:outline-none ${
                    errors.features ? "border-danger focus:ring-danger" : "border-white/10"
                  }`}
                />
                {errors.features && <p className="text-danger mt-1 text-[12px]">{errors.features.message}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2 md:col-span-1">
                <label className="text-text-secondary text-[13px] font-medium">Status Publikasi</label>
                <div className="relative">
                  <Select
                    {...register("status")}
                    className="pl-10"
                  >
                    <option value="Active">Aktif (Ditampilkan)</option>
                    <option value="Inactive">Tidak Aktif (Disembunyikan)</option>
                  </Select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Activity className="text-text-muted h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/membership")}
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
