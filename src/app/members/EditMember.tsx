import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { ArrowLeft, User, Mail, Phone, Save, Lock, Upload, X, Loader2 } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import { getAvatarUrl } from "~/utils/avatar"
import { useGetAllMemberQuery, useUpdateMemberMutation } from "~/services/member"
import { UpdateMemberValidation, type UpdateMemberData } from "~/validation/member"
import type { User as MemberUser } from "~/types/user"

const MAX_PHOTO_SIZE = 2 * 1024 * 1024
const ALLOWED_PHOTO_TYPES = ["image/png", "image/jpg", "image/jpeg"]

export default function EditMember() {
  const navigate = useNavigate()
  const { id = "" } = useParams()
  const location = useLocation()

  const stateMember = (location.state as { member?: MemberUser } | null)?.member

  const { data: membersRes, isLoading, isError } = useGetAllMemberQuery({ size: 50, page: 1 }, { skip: Boolean(stateMember) || !id })

  const member = stateMember ?? membersRes?.data?.find((m) => m.id === id)
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation()

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateMemberData>({
    resolver: zodResolver(UpdateMemberValidation),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: ""
    }
  })

  useEffect(() => {
    if (member) {
      reset({
        name: member.name ?? "",
        email: member.email ?? "",
        phoneNumber: member.phoneNumber ?? "",
        password: ""
      })
    }
  }, [member, reset])

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhotoError(null)

    if (!file) return

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("File photo harus berupa PNG, JPG, atau JPEG.")
      e.target.value = ""
      return
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Ukuran file photo tidak boleh lebih dari 2MB.")
      e.target.value = ""
      return
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleClearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoError(null)
  }

  const onSubmit = async (data: UpdateMemberData) => {
    if (!id) return

    const formData = new FormData()
    formData.append("name", data.name.trim())
    formData.append("email", data.email.trim())
    formData.append("phoneNumber", data.phoneNumber.trim())

    if (data.password && data.password.trim().length > 0) {
      formData.append("password", data.password.trim())
    }

    if (photoFile) {
      formData.append("photo", photoFile)
    }

    try {
      const res = await updateMember({ id, data: formData }).unwrap()
      toast.success(res?.message || "Berhasil memperbarui data member!")
      navigate("/dashboard/members")
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Gagal memperbarui data member.")
    }
  }

  if (!stateMember && isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center gap-2">
        <Loader2 className="text-primary h-5 w-5 animate-spin" />
        <p className="text-text-muted font-medium">Memuat data member...</p>
      </div>
    )
  }

  if (isError || !member) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-400">Data member tidak ditemukan atau gagal dimuat.</p>
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/members")}
        >
          Kembali ke Daftar Member
        </Button>
      </div>
    )
  }

  const currentAvatar = photoPreview || getAvatarUrl(member.name, member.profileUrl)

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/members")}
          className="text-text-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Edit Data Member</h1>
            <span className="bg-primary/20 text-primary border-primary/20 rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold">
              #{id.slice(0, 8)}
            </span>
          </div>
          <p className="text-text-secondary mt-1 text-[13px]">Perbarui profil, kontak, atau kata sandi member.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Informasi Dasar Member</h2>
          <p className="text-text-secondary text-[12px]">Kosongkan foto dan password jika tidak ingin mengubahnya.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-col items-start gap-4 rounded-xl border border-white/5 bg-[#0B0C10]/60 p-4 sm:flex-row sm:items-center">
              <img
                src={currentAvatar}
                alt={member.name}
                className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover"
              />
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs font-semibold text-white">Foto Profil (Opsional)</span>
                <p className="text-text-muted text-[11px]">Format PNG, JPG, atau JPEG. Maksimal ukuran 2MB.</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10">
                    <Upload className="h-3.5 w-3.5" />
                    Pilih Foto Baru
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoFile && (
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="text-text-muted inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs hover:bg-white/5 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                      Batal pilih ({photoFile.name})
                    </button>
                  )}
                </div>
                {photoError && <p className="text-danger text-xs font-medium">{photoError}</p>}
              </div>
            </div>

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

              <div className="sm:col-span-2">
                <Input
                  label="Password Baru (Opsional)"
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengubah password (min. 8 karakter)"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/members")}
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isUpdating}
                leftIcon={!isUpdating && <Save className="h-4 w-4" />}
                className="font-bold"
              >
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
