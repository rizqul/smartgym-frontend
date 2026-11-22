import { useState } from "react"
import { useNavigate } from "react-router"
import { Layers, Wallet, TrendingUp, Plus, CheckCircle2, Edit, Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "~/components/ui/Button"
import { CardStats } from "~/components/ui/CardStats"
import Badge from "~/components/ui/Badge"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import {
  useGetAllMembershipPackagesQuery,
  useGetMembershipCountQuery,
  useDeleteMembershipPackageMutation
} from "~/services/membershipPackage"
import { formatRupiah } from "~/utils/format"
import { Alert } from "~/utils/alert"
import { useAppSelector } from "~/store/hooks"

export default function MembershipPage() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.user.data)
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useGetAllMembershipPackagesQuery()
  const { data: countRes, isLoading: isLoadingCount, refetch: refetchCount } = useGetMembershipCountQuery(undefined, { skip: !isAdmin })

  const [deletePackage] = useDeleteMembershipPackageMutation()

  const packagesList = data?.data ? Object.values(data.data).flat() : []
  const membershipStats = countRes?.data
  const totalPackages = isAdmin ? (membershipStats?.countMembershipPackage ?? packagesList.length) : packagesList.length

  if (isLoading || (isAdmin && isLoadingCount)) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={isAdmin ? 2 : 1}
          contentVariant="list"
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-red-400">Gagal memuat katalog membership.</p>
        <Button
          variant="secondary"
          onClick={() => {
            refetch()
            if (isAdmin) refetchCount()
          }}
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  const handleDelete = async (id: string, name: string) => {
    const result = await Alert.confirm({
      title: "Hapus Paket?",
      text: `Apakah Anda yakin ingin menghapus paket "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Ya, Hapus",
      isDanger: true
    })

    if (!result.isConfirmed) return

    setDeletingId(id)
    try {
      await deletePackage(id).unwrap()
      toast.success(`Paket ${name} berhasil dihapus!`)
    } catch (error: unknown) {
      const apiErr = error as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Gagal menghapus paket membership.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Manajemen Membership</h2>
          <p className="text-text-muted text-[13px] sm:text-[14px]">
            Kelola katalog paket membership dan pantau status langganan member terdaftar secara real-time.
          </p>
        </div>

        {isAdmin && (
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
        )}
      </div>

      <div className={`grid grid-cols-1 gap-3 ${isAdmin ? "sm:grid-cols-2" : "sm:max-w-sm"}`}>
        <CardStats
          topIcon={<Layers className="text-blue-400" />}
          bottomIcon={<TrendingUp className="text-blue-400" />}
          label="Katalog Aktif"
          subLabel="Total Paket Tersedia"
          value={totalPackages}
        />

        {isAdmin && (
          <CardStats
            topIcon={<Wallet className="text-emerald-400" />}
            bottomIcon={<TrendingUp className="text-emerald-400" />}
            label="Total Pendapatan Membership"
            subLabel="Akumulasi Transaksi"
            value={`Rp ${formatRupiah(membershipStats?.totalMembershipIncome ?? 0)}`}
          />
        )}
      </div>

      {packagesList.length === 0 ? (
        <div className="text-text-muted flex w-full justify-center py-20 text-sm">Belum ada paket membership tersedia.</div>
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

            const isDeleting = deletingId === pkg.id

            return (
              <div
                key={pkg.id}
                className="flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-[#1C1F26] p-5 shadow-lg transition-all hover:border-white/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge label={pkg.type || "PACKAGE"} />

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/membership/${pkg.id}/edit`)}
                        title="Edit Paket"
                        aria-label={`Edit ${pkg.name}`}
                        className="text-text-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        disabled={isDeleting}
                        title="Hapus Paket"
                        aria-label={`Hapus ${pkg.name}`}
                        className="text-text-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:border-red-500/30 hover:bg-red-500/15 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="truncate text-lg font-bold text-white">{pkg.name}</h3>
                  <p className="text-text-secondary line-clamp-2 text-[12.5px] leading-relaxed">{cleanDesc}</p>
                </div>

                <div className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/3 px-3.5 py-2.5">
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-xs font-semibold">Rp</span>
                    <span className="text-2xl font-bold tracking-tight">{formatRupiah(pkg.price)}</span>
                  </div>
                  <span className="text-primary text-xs font-semibold whitespace-nowrap">/ {pkg.duration} Hari</span>
                </div>

                <div className="flex flex-1 flex-col gap-2 border-t border-white/5 pt-3">
                  <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">FASILITAS TERMASUK</span>
                  <ul className="flex flex-col gap-1.5">
                    {featuresList.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-[12.5px] text-white/90"
                      >
                        <CheckCircle2 className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
