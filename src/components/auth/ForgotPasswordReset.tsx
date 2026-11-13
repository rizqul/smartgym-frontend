import { useState } from "react"
import { Lock, ArrowLeft, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "../ui/Button"
import { Card, CardHeader, CardContent } from "../ui/Card"
import { Input } from "../ui/Input"
import logoGym from "../../assets/logo.png"

const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "Kode OTP harus 6 digit"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"]
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface Props {
  email: string
  onSubmit: () => void
}

export function ForgotPasswordReset({ email, onSubmit }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])

  const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, "$1***")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: ""
    }
  })

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return

    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)

    setValue("otp", newOtp.join(""), { shouldValidate: true })

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

  const handleFormSubmit = async (data: ResetPasswordFormValues) => {
    console.log("Data Reset:", data)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onSubmit()
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
            className="text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Kirim Ulang
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
              <span className="text-primary text-[10px] font-semibold sm:text-[11px]">Kedaluwarsa dlm 00:45</span>
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
                  className={`text-primary placeholder:text-text-muted h-12 w-10 rounded-xl border bg-[#0B0C10] text-center text-xl font-bold transition-all focus:ring-1 focus:outline-none sm:h-16 sm:w-14 sm:text-2xl ${
                    errors.otp
                      ? "border-danger focus:border-danger focus:ring-danger"
                      : "focus:border-primary focus:ring-primary border-white/4"
                  }`}
                  placeholder="•"
                />
              ))}
            </div>
            {errors.otp && <p className="text-danger mt-2 text-xs font-medium">{errors.otp.message}</p>}
          </div>

          <div className="space-y-4 pt-2">
            <Input
              label="Kata Sandi Baru"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password baru (min. 8 karakter)"
              icon={Lock}
              error={errors.password?.message}
              {...register("password")}
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
