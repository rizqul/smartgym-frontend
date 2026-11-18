import { useNavigate } from "react-router"
import { Layers, Users, Clock, TrendingUp, Plus, CheckCircle2, Edit, Trash } from "lucide-react"

import { Button } from "../../components/ui/Button"
import { CardStats } from "../../components/ui/CardStats"
import Badge from "../../components/ui/Badge"

import { useGetAllMembershipPackagesQuery, useDeleteMembershipPackageMutation } from "../../services/membershipPackage"
import { formatRupiah } from "../../utils/format"
import { Alert } from "~/utils/alert"
import toast from "react-hot-toast"

export default function MembershipPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useGetAllMembershipPackagesQuery()

  const packagesList = data?.data ? Object.values(data.data).flat() : []
  const [deletePackage] = useDeleteMembershipPackageMutation()

  const handleDelete = async (id: string, name: string) => {
    const result = await Alert.confirm({
      title: "Hapus Paket?",
      text: `Apakah Anda yakin ingin menghapus paket "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Ya, Hapus",
      isDanger: true
    })

    if (result.isConfirmed) {
      try {
        await deletePackage(id)
        toast.success(`Paket ${name} berhasil dihapus!`)
      } catch {
        toast.error("Gagal menghapus paket membership.")
      }
    }
  }

  return (
    <div className="border-primary/20 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Manajemen Membership</h2>
          <p className="text-text-muted text-[14px]">
            Kelola katalog paket membership dan pantau status langganan member terdaftar secara real-time.
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/dashboard/membership/create")}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            Tambah Paket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CardStats
          topIcon={<Layers className="text-white" />}
          bottomIcon={<TrendingUp className="text-white" />}
          label="Katalog Aktif"
          subLabel="100% Online"
          value={packagesList.length}
        />
        <CardStats
          topIcon={<Users className="text-blue-400" />}
          bottomIcon={<TrendingUp className="text-blue-400" />}
          label="Langganan Berjalan"
          subLabel="+6.4% MoM"
          value={2350}
        />
        <CardStats
          topIcon={<Clock className="text-red-400" />}
          bottomIcon={<TrendingUp className="text-red-400" />}
          label="Segera Kedaluwarsa"
          subLabel="Members"
          value={48}
        />
      </div>

      {isLoading ? (
        <div className="text-text-muted flex w-full justify-center py-20">Memuat katalog membership...</div>
      ) : packagesList.length === 0 ? (
        <div className="text-text-muted flex w-full justify-center py-20">Belum ada paket membership tersedia.</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packagesList.map((pkg) => {
            let cleanDesc = pkg.description || ""
            let featuresList: string[] = []

            if (pkg.description && pkg.description.includes("Fasilitas:")) {
              const parts = pkg.description.split("Fasilitas:")
              cleanDesc = parts[0].trim()

              featuresList = parts[1]
                .split("-")
                .map((f) => f.trim())
                .filter((f) => f.length > 0)
            }

            if (featuresList.length === 0) {
              featuresList = ["Akses seluruh fasilitas Gym"]
            }

            return (
              <div
                key={pkg.id}
                className="flex h-full flex-col rounded-xl border border-white/10 bg-[#1C1F26] p-6 shadow-lg transition-all hover:border-white/20"
              >
                <div className="mb-4 flex items-start">
                  <Badge label={pkg.type || "PACKAGE"} />
                </div>

                <div className="mb-6 flex flex-col gap-1.5">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-text-secondary line-clamp-2 text-[13px]">{cleanDesc}</p>
                </div>

                <div className="mb-6 flex flex-col gap-1">
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-[14px] font-semibold">Rp</span>
                    <span className="text-3xl font-bold tracking-tight">{formatRupiah(pkg.price)}</span>
                    <span className="text-text-muted text-[13px]">/ {pkg.duration} Hari</span>
                  </div>
                  <span className="text-primary text-[12px] font-medium">Akses Berlaku {pkg.duration} Hari</span>
                </div>

                <div className="mb-8 flex flex-col gap-3">
                  <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">FASILITAS TERMASUK</span>
                  <ul className="flex flex-col gap-2.5">
                    {featuresList.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-[13px] text-white/90"
                      >
                        <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex w-full items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/membership/${pkg.id}/edit`)}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit Paket
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      className="text-text-muted flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-500/20 hover:text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
