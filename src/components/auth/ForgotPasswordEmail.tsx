import { Mail, ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "../ui/Button"
import { Card, CardHeader, CardContent } from "../ui/Card"
import { Input } from "../ui/Input"
import logoGym from "../../assets/logo.png"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid")
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

interface Props {
  onSuccess: (email: string) => void
}

export function ForgotPasswordEmail({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onSuccess(data.email)
  }

  return (
    <Card className="mx-auto max-w-md shadow-2xl">
      <CardHeader className="flex flex-col items-center pb-2 text-center">
        <div className="border-primary/25 drop-shadow-primary/25 mb-5 flex h-12 w-12 items-center justify-center rounded-[10px] border bg-[#0B0C10] shadow-sm drop-shadow-xl">
          <img
            src={logoGym}
            alt="SmartGym Logo"
            className="h-8 w-8 object-contain drop-shadow-md"
          />
        </div>
        <h1 className="text-2xl font-bold text-white">Lupa Password?</h1>
        <p className="text-text-secondary mt-2 text-[14px]">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan kode OTP untuk mereset kata sandi Anda.
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Input
            label="Alamat Email"
            type="email"
            placeholder="admin@smartgym.id"
            icon={Mail}
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 font-bold"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Kirim Kode OTP"}
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/auth/login"
              className="text-text-secondary inline-flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Halaman Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
