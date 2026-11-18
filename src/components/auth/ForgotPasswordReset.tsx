import { useState } from "react"
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react"
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
  otpCode: string
  onSubmit: () => void
}

export function ForgotPasswordReset({ email, onSubmit }: Props) {
  const { resetPassword } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordResetFormData>({
    resolver: zodResolver(ForgotPasswordResetValidation),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const handleFormSubmit = async (data: ForgotPasswordResetFormData) => {
    try {
      await resetPassword({ email, ...data })
      onSubmit()
    } catch (error: any) {
      toast.error(error.message)

      if (error.message.toLowerCase().includes("sandi") || error.message.toLowerCase().includes("password")) {
        setError("password", { type: "server", message: error.message })
      }
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
        <h1 className="mb-2 text-xl font-bold text-white sm:text-2xl">Buat Kata Sandi Baru</h1>
        <p className="text-text-secondary text-[13px] sm:text-[14px]">
          OTP berhasil diverifikasi. Silakan buat kata sandi baru untuk akun Anda.
        </p>
      </CardHeader>

      <CardContent className="mt-2 sm:mt-4">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5"
        >
          <Input
            label="Kata Sandi Baru"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 karakter, ada angka & simbol"
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

          <Button
            type="submit"
            variant="primary"
            className="mt-4 w-full py-3.5 text-[14px] font-bold sm:text-[15px]"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Kata Sandi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
