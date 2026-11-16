import { useState, useEffect } from "react"
import { Lock, ArrowLeft, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

import useAuth from "~/hooks/useAuth"
import { ForgotPasswordResetValidation, type ForgotPasswordResetFormData } from "~/validation/authentication"

import { Button } from "../ui/Button"
import { Card, CardHeader, CardContent } from "../ui/Card"
import { Input } from "../ui/Input"
import logoGym from "../../assets/logo.png"

interface Props {
  email: string
  onSubmit: () => void
}

export function ForgotPasswordReset({ email, onSubmit }: Props) {
  const { resetPassword, requestPasswordReset } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])

  const [timeLeft, setTimeLeft] = useState(45)
  const [isResending, setIsResending] = useState(false)

  const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, "$1***")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordResetFormData>({
    resolver: zodResolver(ForgotPasswordResetValidation),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleResendOtp = async () => {
    try {
      setIsResending(true)
      await requestPasswordReset({ email })
      toast.success("Kode OTP baru telah dikirim!")
      setTimeLeft(45)

      setOtpValues(["", "", "", "", "", ""])
      setValue("code", "")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsResending(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return

    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)

    setValue("code", newOtp.join(""), { shouldValidate: true })

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleFormSubmit = async (data: ForgotPasswordResetFormData) => {
    try {
      await resetPassword({ email, ...data })

      onSubmit()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Card className="mx-auto max-w-lg shadow-2xl">
      <CardHeader className="flex flex-col items-center pb-2 text-center">
        <div className="border-primary/25 drop-shadow-primary/25 mb-5 flex h-12 w-12 items-center justify-center rounded-[10px] border bg-[#0B0C10] shadow-sm drop-shadow-xl">
          <img
            src={logoGym}
            alt="SmartGym Logo"
            className="h-8 w-8 object-contain drop-shadow-md"
          />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white sm:text-2xl">Reset Password</h1>
        <p className="text-text-secondary text-[13px] sm:text-[14px]">Masukkan kode OTP verifikasi dan buat kata password Anda.</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] sm:text-[13px]">
          <div className="text-text-secondary flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            <span>Kode dikirim ke {maskedEmail}</span>
          </div>
          <span className="text-text-muted hidden sm:inline">•</span>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={timeLeft > 0 || isResending}
            className={`${
              timeLeft > 0 ? "text-text-muted cursor-not-allowed" : "text-primary hover:text-primary-hover font-semibold transition-colors"
            }`}
          >
            {isResending ? "Mengirim..." : "Kirim Ulang"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="mt-2 sm:mt-4">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-text-muted text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">Kode OTP (6-Digit)</label>

              <span className={`text-[10px] font-semibold sm:text-[11px] ${timeLeft > 0 ? "text-primary" : "text-danger"}`}>
                {timeLeft > 0 ? `Kedaluwarsa dlm ${formatTime(timeLeft)}` : "Waktu habis"}
              </span>
            </div>

            <div className="flex justify-between gap-1.5 sm:gap-3">
              {otpValues.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={timeLeft === 0}
                  className={`text-primary placeholder:text-text-muted h-12 w-10 rounded-xl border bg-[#0B0C10] text-center text-xl font-bold transition-all focus:ring-1 focus:outline-none sm:h-16 sm:w-14 sm:text-2xl ${
                    errors.code || timeLeft === 0
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "focus:border-primary focus:ring-primary border-white/4"
                  } ${timeLeft === 0 ? "opacity-50" : ""}`}
                  placeholder="•"
                />
              ))}
            </div>
            {errors.code && <p className="text-danger mt-2 text-xs font-medium">{errors.code.message}</p>}
          </div>

          <div className="space-y-4 pt-2">
            <Input
              label="Kata Sandi Baru"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password baru (min. 8 karakter)"
              icon={Lock}
              error={errors.newPassword?.message}
              {...register("newPassword")}
              disabled={timeLeft === 0}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted transition-colors hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              }
            />

            <Input
              label="Konfirmasi Kata Sandi"
              type={showConfirm ? "text" : "password"}
              placeholder="Ulangi password baru"
              icon={ShieldCheck}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              disabled={timeLeft === 0}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-text-muted transition-colors hover:text-white focus:outline-none"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-full py-3.5 text-[14px] font-bold sm:text-[15px]"
            isLoading={isSubmitting}
            disabled={timeLeft === 0}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Password"}
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/auth/login"
              className="text-text-secondary inline-flex items-center gap-2 text-[12px] font-medium transition-colors hover:text-white sm:text-[13px]"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Kembali ke Halaman Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
