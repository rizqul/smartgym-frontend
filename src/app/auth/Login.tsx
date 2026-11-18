import { useState } from "react"
import { Link } from "react-router"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

import useAuth from "~/hooks/useAuth"

import logoGym from "../../assets/logo.png"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Card, CardHeader, CardContent } from "../../components/ui/Card"

import { LoginValidation, type LoginFormData } from "~/validation/authentication"

export default function Login() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
    } catch (error: any) {
      setError("email", { type: "server", message: error.message })
    }
  }

  return (
    <Card className="mx-auto w-full max-w-105 shadow-2xl">
      <CardHeader className="flex flex-col items-center pb-2 text-center">
        <div className="border-primary/25 drop-shadow-primary/25 mb-5 flex h-12 w-12 items-center justify-center rounded-[10px] border bg-[#0B0C10] shadow-sm drop-shadow-xl">
          <img
            src={logoGym}
            alt="SmartGym Logo"
            className="h-8 w-8 object-contain drop-shadow-md"
          />
        </div>
        <h2 className="mb-1.5 text-[22px] font-semibold text-white">Selamat Datang Kembali</h2>
        <p className="text-text-secondary text-[13px]">Masuk ke portal operasional SmartGym</p>
      </CardHeader>

      <CardContent className="pt-6">
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
                    className="h-5 w-5"
                    strokeWidth={1.5}
                  />
                ) : (
                  <Eye
                    className="h-5 w-5"
                    strokeWidth={1.5}
                  />
                )}
              </button>
            }
          />

          <div className="flex items-center justify-between pt-1 pb-1">
            <div className="relative flex items-center">
              <div className="relative flex h-4 w-4 items-center justify-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register("remember")}
                  className="peer bg-background checked:bg-primary checked:border-primary focus:ring-primary/50 h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 transition-all focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#1C1F26] focus:outline-none"
                />

                <div className="pointer-events-none absolute opacity-0 transition-opacity peer-checked:opacity-100">
                  <div className="h-1.5 w-1.5 rounded-sm bg-white"></div>
                </div>
              </div>

              <label
                htmlFor="remember-me"
                className="text-text-secondary ml-2.5 block cursor-pointer text-[13px] transition-colors hover:text-white"
              >
                Ingat saya
              </label>
            </div>

            <Link
              to="/auth/forgot-password"
              className="text-primary hover:text-primary-hover text-[12px] font-semibold transition-colors"
            >
              Lupa Kata Sandi?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="mt-2 w-full text-[14px] font-bold"
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
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
