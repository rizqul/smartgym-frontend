import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import logoGym from "../../assets/logo.png"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"

const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  rememberMe: z.boolean().optional()
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Form Data Terkirim:", data)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    navigate("/")
  }

  return (
    <div className="w-full max-w-105 rounded-2xl border border-white/4 bg-[#1C1F26] p-8 shadow-2xl sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[10px] border border-primary/25 bg-[#0B0C10] shadow-sm drop-shadow-xl drop-shadow-primary/25">
          <img
            src={logoGym}
            alt="SmartGym Logo"
            className="h-8 w-8 object-contain drop-shadow-md"
          />
        </div>
        <h2 className="mb-1.5 text-[22px] font-semibold text-white">Selamat Datang Kembali</h2>
        <p className="text-text-secondary text-[13px]">Masuk ke portal operasional SmartGym</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          label="Email"
          type="email"
          placeholder="admin@smartgym.id"
          icon={Mail}
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Kata Sandi"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          icon={Lock}
          autoComplete="current-password"
          className="font-mono tracking-wider"
          error={errors.password?.message}
          {...register("password")}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted transition-colors hover:text-white focus:outline-none"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? (
                <EyeOff
                  className="h-4 w-4"
                  strokeWidth={1.5}
                />
              ) : (
                <Eye
                  className="h-4 w-4"
                  strokeWidth={1.5}
                />
              )}
            </button>
          }
        />

        <div className="flex items-center pt-1 pb-1">
          <div className="relative flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...register("rememberMe")}
              className="peer bg-background checked:bg-primary checked:border-primary focus:ring-primary/50 h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 transition-all focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#1C1F26] focus:outline-none"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity peer-checked:opacity-100">
              <div className="h-1.5 w-1.5 rounded-sm bg-white"></div>
            </div>
          </div>
          <label
            htmlFor="remember-me"
            className="text-text-secondary ml-2.5 block cursor-pointer text-[13px] transition-colors hover:text-white"
          >
            Ingat saya di perangkat ini
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="mt-2 w-full text-[14px]"
          isLoading={isSubmitting}
          rightIcon={
            !isSubmitting && (
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={2.5}
              />
            )
          }
        >
          {isSubmitting ? "Memproses..." : "Masuk ke Portal Operasional"}
        </Button>
      </form>
    </div>
  )
}
