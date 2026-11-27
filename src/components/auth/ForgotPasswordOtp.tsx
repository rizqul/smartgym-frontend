import { useState, useEffect } from "react"
import { ArrowLeft, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

import useAuth from "~/hooks/useAuth"
import { ForgotPasswordOtpValidation, type ForgotPasswordOtpFormData } from "~/validation/authentication"

import { Button } from "../ui/Button"
import { Card, CardHeader, CardContent } from "../ui/Card"
import logoGym from "../../assets/logo.png"

interface Props {
  email: string
  onSuccess: (code: string) => void
  onBack: () => void
}

export function ForgotPasswordOtp({ email, onSuccess, onBack }: Props) {
  const { requestPasswordReset, verifyOtp } = useAuth()

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300)
  const [isResending, setIsResending] = useState(false)

  const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, "$1***")

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordOtpFormData>({
    resolver: zodResolver(ForgotPasswordOtpValidation),
    defaultValues: { code: "" }
  })

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
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
      toast.success("A new OTP code has been sent!")
      setTimeLeft(300)
      setOtpValues(["", "", "", "", "", ""])
      setValue("code", "")
    } catch (error: any) {
      toast.error("Failed to resend the code. Please try again.")
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

  const handleFormSubmit = async (data: ForgotPasswordOtpFormData) => {
    try {
      await verifyOtp({ email, code: data.code })
      onSuccess(data.code)
    } catch (error: any) {
      setError("code", { type: "server", message: "We couldn't verify the code. Please check it and try again." })
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
        <h1 className="mb-2 text-xl font-bold text-white sm:text-2xl">Verify OTP</h1>
        <p className="text-text-secondary text-[13px] sm:text-[14px]">Enter the 6-digit code we sent to your email.</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] sm:text-[13px]">
          <div className="text-text-secondary flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            <span>{maskedEmail}</span>
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
            {isResending ? "Sending..." : "Resend Code"}
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
              <label className="text-text-muted text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">OTP Code</label>
              <span className={`text-[10px] font-semibold sm:text-[11px] ${timeLeft > 0 ? "text-primary" : "text-danger"}`}>
                {timeLeft > 0 ? `${formatTime(timeLeft)} remaining` : "Time expired"}
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
                      : "focus:border-primary focus:ring-primary border-white/10"
                  } ${timeLeft === 0 ? "opacity-50" : ""}`}
                  placeholder="•"
                />
              ))}
            </div>
            {errors.code && <p className="text-danger mt-2 text-xs font-medium">{errors.code.message}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-full py-3.5 text-[14px] font-bold sm:text-[15px]"
            disabled={timeLeft === 0 || otpValues.join("").length < 6}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Continue"}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-text-secondary inline-flex items-center gap-2 text-[12px] font-medium transition-colors hover:text-white sm:text-[13px]"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Change Email Address
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
