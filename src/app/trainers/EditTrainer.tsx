import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Cropper, { type Area, type Point } from "react-easy-crop"
import toast from "react-hot-toast"
import { ArrowLeft, Camera, Check, Crop, Dumbbell, RotateCcw, Save, UserCircle, X, ZoomIn, ZoomOut } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import { Button } from "~/components/ui/Button"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import { useGetAllTrainerQuery, useUpdateTrainerMutation } from "~/services/trainer.service"
import { UpdateTrainerValidation, type UpdateTrainerData } from "~/validation/trainer"
import type { TrainerItem } from "~/types/trainer.type"
import { getAvatarUrl } from "~/utils/avatar"
import { getCroppedImageFile } from "~/utils/cropImage"

const SPECIALIZATION_OPTIONS = [
  { value: "GENERAL_FITNESS", label: "General Fitness" },
  { value: "WEIGHT_LOSS", label: "Weight Loss" },
  { value: "BODYBUILDING", label: "Bodybuilding" },
  { value: "STRENGTH_CONDITIONING", label: "Strength & Conditioning" },
  { value: "FUNCTIONAL_TRAINING", label: "Functional Training" },
  { value: "CARDIO_ENDURANCE", label: "Cardio & Endurance" },
  { value: "MOBILITY_FLEXIBILITY", label: "Mobility & Flexibility" },
  { value: "CORRECTIVE_REHAB", label: "Corrective & Rehab" },
  { value: "SPORTS_PERFORMANCE", label: "Sports Performance" }
]

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"]

interface LocationState {
  trainer?: TrainerItem
}

export default function EditTrainer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const stateTrainer = (location.state as LocationState | null)?.trainer

  const { data: trainersRes, isLoading: isFetchingFallback } = useGetAllTrainerQuery(
    { page: 1, size: 100 },
    { skip: Boolean(stateTrainer) || !id }
  )

  const trainer = useMemo(() => {
    if (stateTrainer) return stateTrainer
    return trainersRes?.data?.find((item) => item.id === id)
  }, [stateTrainer, trainersRes?.data, id])

  const [updateTrainer, { isLoading }] = useUpdateTrainerMutation()

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null)
  const [rawFileMeta, setRawFileMeta] = useState<{ name: string; type: "image/png" | "image/jpeg" }>({
    name: "profile-photo.jpg",
    type: "image/jpeg"
  })
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UpdateTrainerData>({
    resolver: zodResolver(UpdateTrainerValidation),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      experience: "",
      rate: "",
      photo: null
    }
  })

  const watchedName = watch("name")
  const watchedPhoto = watch("photo")

  useEffect(() => {
    if (!trainer) return

    reset({
      name: trainer.name ?? "",
      email: trainer.email ?? "",
      phoneNumber: trainer.phoneNumber ?? "",
      specialization: trainer.specialization ?? "",
      experience: String(trainer.experience ?? ""),
      rate: String(trainer.rate ?? ""),
      photo: null
    })
  }, [trainer, reset])

  useEffect(() => {
    if (!(watchedPhoto instanceof File)) {
      setPhotoPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(watchedPhoto)
    setPhotoPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [watchedPhoto])

  useEffect(() => {
    return () => {
      if (rawImageSrc) URL.revokeObjectURL(rawImageSrc)
    }
  }, [rawImageSrc])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""

    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Photo must be a PNG, JPG, or JPEG file.")
      return
    }

    if (rawImageSrc) {
      URL.revokeObjectURL(rawImageSrc)
    }

    const mimeType: "image/png" | "image/jpeg" = file.type === "image/png" ? "image/png" : "image/jpeg"
    const baseName = file.name.replace(/\.[^/.]+$/, "") || "profile-photo"
    const fileName = `${baseName}.${mimeType === "image/png" ? "png" : "jpg"}`

    setRawImageSrc(URL.createObjectURL(file))
    setRawFileMeta({ name: fileName, type: mimeType })
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setIsCropOpen(true)
  }

  const handleApplyCrop = async () => {
    if (!rawImageSrc || !croppedAreaPixels) return

    setIsCropping(true)
    try {
      const croppedFile = await getCroppedImageFile(rawImageSrc, croppedAreaPixels, rawFileMeta.name, rawFileMeta.type)
      setValue("photo", croppedFile, { shouldValidate: true })
      setIsCropOpen(false)
    } catch {
      toast.error("Failed to crop image.")
    } finally {
      setIsCropping(false)
    }
  }

  const handleRemoveSelectedPhoto = () => {
    setValue("photo", null, { shouldValidate: true })
    if (rawImageSrc) {
      URL.revokeObjectURL(rawImageSrc)
      setRawImageSrc(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (values: UpdateTrainerData) => {
    if (!id) return

    const formData = new FormData()
    formData.append("name", values.name.trim())
    formData.append("email", values.email.trim())
    formData.append("phoneNumber", values.phoneNumber.trim())
    formData.append("specialization", values.specialization)
    formData.append("experience", values.experience.trim())
    formData.append("rate", values.rate.trim())

    if (values.photo instanceof File) {
      formData.append("photo", values.photo)
    }

    try {
      const res = await updateTrainer({ id, data: formData }).unwrap()
      toast.success(res?.message || "Trainer updated successfully!")
      navigate("/dashboard/trainers")
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message || "Failed to update trainer."
      toast.error(message)
    }
  }

  if (!trainer && isFetchingFallback) {
    return (
      <div className="mx-auto w-full max-w-5xl p-4 lg:p-6">
        <PageSkeleton
          statCount={0}
          contentVariant="list"
        />
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-red-400">Trainer data not found.</p>
        <Button
          variant="secondary"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/dashboard/trainers")}
        >
          Back to Trainers
        </Button>
      </div>
    )
  }

  const currentAvatar = photoPreview || getAvatarUrl(watchedName || trainer.name, trainer.profileUrl)

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 lg:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/trainers")}
              className="text-text-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-[#1C1F26] transition-colors hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white lg:text-2xl">Edit Trainer</h1>
              <p className="text-text-secondary mt-0.5 text-[13px]">
                Update instructor profile photo, contact details, specialization, and session rate.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5">
                <UserCircle className="text-text-secondary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white">Trainer Information</h3>
                <p className="text-text-secondary text-[12px]">The instructor&apos;s basic details and contact information.</p>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-text-secondary text-xs font-semibold tracking-wider uppercase">Profile Photo</label>
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-[#0B0C10]/60 p-3.5">
                  <img
                    src={currentAvatar}
                    alt={trainer.name}
                    className="h-16 w-16 shrink-0 rounded-xl border border-white/10 object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        leftIcon={<Camera className="h-3.5 w-3.5" />}
                        onClick={() => fileInputRef.current?.click()}
                        className="py-1.5 text-xs"
                      >
                        Change Photo
                      </Button>

                      {watchedPhoto instanceof File && rawImageSrc && (
                        <button
                          type="button"
                          onClick={() => setIsCropOpen(true)}
                          className="text-text-secondary inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Crop className="h-3.5 w-3.5" />
                          Re-crop
                        </button>
                      )}

                      {watchedPhoto instanceof File && (
                        <button
                          type="button"
                          onClick={handleRemoveSelectedPhoto}
                          className="text-text-muted inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reset
                        </button>
                      )}
                    </div>

                    <p className="text-text-muted truncate text-[11px]">
                      {watchedPhoto instanceof File ? watchedPhoto.name : "PNG, JPG, or JPEG. Max size 2MB (1:1 square crop)."}
                    </p>
                  </div>
                </div>
                {errors.photo?.message && <span className="text-xs text-red-400">{errors.photo.message}</span>}
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  placeholder="Example: Rio Santoso"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="Example: rio@smartgym.id"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="WhatsApp / Phone Number"
                type="tel"
                inputMode="numeric"
                placeholder="Example: 081234567890"
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5">
                <Dumbbell className="text-text-secondary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white">Training Details &amp; Rate</h3>
                <p className="text-text-secondary text-[12px]">Set the specialization, years of experience, and PT session rate.</p>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary text-xs font-semibold tracking-wider uppercase">Specialization</label>
                <Select
                  {...register("specialization")}
                  className="focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
                >
                  <option value="">Select Specialization</option>
                  {SPECIALIZATION_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {errors.specialization?.message && <span className="text-xs text-red-400">{errors.specialization.message}</span>}
              </div>

              <Input
                label="Experience (Years)"
                type="text"
                inputMode="numeric"
                placeholder="Example: 5"
                error={errors.experience?.message}
                {...register("experience")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
                }}
              />

              <Input
                label="Rate per Session (Rp)"
                type="text"
                inputMode="numeric"
                placeholder="Example: 150000"
                error={errors.rate?.message}
                {...register("rate")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
                }}
              />

              <div className="col-span-full mt-2 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isLoading}
                  onClick={() => navigate("/dashboard/trainers")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full font-bold sm:w-auto"
                  leftIcon={!isLoading && <Save className="h-4 w-4" />}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {isCropOpen && rawImageSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!isCropping) setIsCropOpen(false)
          }}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#161920] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/15 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Crop className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Crop Profile Photo</h3>
                  <p className="text-text-muted text-[11px]">Drag to reposition and use slider to zoom</p>
                </div>
              </div>

              <button
                type="button"
                disabled={isCropping}
                onClick={() => setIsCropOpen(false)}
                aria-label="Close crop modal"
                className="text-text-muted cursor-pointer rounded-lg p-1 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative h-72 w-full bg-[#0B0C10] sm:h-80">
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_croppedArea, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <div className="flex items-center gap-3 border-t border-white/5 bg-[#121419] px-5 py-3.5">
              <ZoomOut className="text-text-muted h-4 w-4 shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label="Zoom level"
                className="accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
              />
              <ZoomIn className="text-text-muted h-4 w-4 shrink-0" />
              <button
                type="button"
                onClick={() => {
                  setCrop({ x: 0, y: 0 })
                  setZoom(1)
                }}
                className="text-text-muted ml-1 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-white/5 px-5 py-3.5">
              <Button
                type="button"
                variant="secondary"
                disabled={isCropping}
                onClick={() => setIsCropOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                isLoading={isCropping}
                onClick={handleApplyCrop}
                leftIcon={!isCropping && <Check className="h-4 w-4" />}
              >
                {isCropping ? "Cropping..." : "Apply Crop"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
