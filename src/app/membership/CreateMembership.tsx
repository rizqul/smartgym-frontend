import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { ArrowLeft, Tag, Package, CreditCard, Clock, Info, Save } from "lucide-react"

import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Select } from "../../components/ui/Select"

import { CreateMembershipPackageValidation, type CreateMembershipPackageData } from "~/validation/membership"
import { useCreateMembershipPackageMutation } from "~/services/membershipPackage"

export default function CreateMembership() {
  const [createPackage, { error }] = useCreateMembershipPackageMutation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(CreateMembershipPackageValidation),
    defaultValues: {
      type: "MONTHLY",
      name: "",
      description: "",
      price: 0,
      duration: 30,
      features: ""
    }
  })

  const onSubmit = async (data: CreateMembershipPackageData) => {
    try {
      const featuresArray = data.features.split("\n").filter((f) => f.trim() !== "")
      const combinedDescription = `${data.description} \n\nFasilitas:\n- ${featuresArray.join("\n- ")}`

      const payload = {
        type: data.type,
        name: data.name,
        description: combinedDescription,
        duration: data.duration,
        price: data.price
      }

      await createPackage(payload as any)
      if (error) throw Error

      toast.success("Paket membership baru berhasil ditambahkan!")
      navigate("/dashboard/membership")
    } catch {
      toast.error("Gagal menambahkan paket. Silakan periksa kembali form Anda.")
    }
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
          <h1 className="text-2xl font-bold text-white">Tambah Paket Baru</h1>
          <p className="text-text-secondary mt-1 text-[13px]">Buat katalog paket membership baru untuk ditawarkan kepada member.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Detail Paket Membership</h2>
          <p className="text-text-secondary text-[12px]">Lengkapi informasi harga, fasilitas, dan masa aktif paket.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-text-secondary text-[13px] font-medium">Kategori Tipe (Wajib)</label>
                <div className="relative">
                  <Select
                    {...register("type")}
                    className="pl-10"
                  >
                    <option value="WEEKLY">Mingguan</option>
                    <option value="MONTHLY">Bulanan</option>
                    <option value="YEARLY">Tahunan</option>
                  </Select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Tag className="text-text-muted h-4 w-4" />
                  </div>
                </div>
                {errors.type && <p className="mt-1 text-[12px] text-red-500">{errors.type.message}</p>}
              </div>

              <Input
                label="Nama Paket"
                placeholder="Cth: Year Pro VIP"
                icon={Package}
                error={errors.name?.message}
                {...register("name")}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Deskripsi Singkat"
                  placeholder="Penjelasan singkat mengenai paket ini..."
                  icon={Info}
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              <Input
                label="Harga Paket (Rp)"
                type="number"
                placeholder="Cth: 4200000"
                icon={CreditCard}
                error={errors.price?.message}
                {...register("price", { valueAsNumber: true })}
              />

              <Input
                label="Durasi Aktif (Total Hari)"
                type="number"
                placeholder="Cth: 365"
                icon={Clock}
                error={errors.duration?.message}
                {...register("duration", { valueAsNumber: true })}
              />

              <div className="space-y-1 sm:col-span-2">
                <label className="text-text-secondary text-[13px] font-medium">Fasilitas Termasuk (Pisahkan dengan Enter)</label>
                <textarea
                  {...register("features")}
                  rows={5}
                  className={`placeholder:text-text-muted w-full rounded-xl border bg-[#0B0C10] p-3 text-[13px] text-white transition-all focus:ring-1 focus:outline-none ${
                    errors.features
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "focus:border-primary focus:ring-primary border-white/10"
                  }`}
                  placeholder="Akses Gym 24 jam penuh&#10;Free Locker & Shower room&#10;Diskon 10% SmartGym Cafe"
                />
                {errors.features && <p className="mt-1 text-[12px] text-red-500">{errors.features.message}</p>}
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
                disabled={isSubmitting}
                leftIcon={!isSubmitting && <Save className="h-4 w-4" />}
                className="font-bold"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Paket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
