import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { ArrowLeft, User, Mail, Phone, Hash, Lock, Eye, EyeOff, Save, Info, Send } from "lucide-react"

import { Card, CardHeader, CardContent } from "~/components/ui/Card"
import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import { CreateMemberValidation, type CreateMemberData } from "~/validation/member"
import { useCreateMemberMutation, useRequestMemberOtpMutation } from "~/services/member"

export default function CreateMember() {
  const navigate = useNavigate()
  const [requestMemberOtp, { isLoading: isSendingOtp }] = useRequestMemberOtpMutation()
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation()

  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<CreateMemberData>({
    resolver: zodResolver(CreateMemberValidation),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      code: "",
      password: ""
    }
  })

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handleSendOtp = async () => {
    if (countdown > 0 || isSendingOtp) return

    const isEmailValid = await trigger(["email"])
    if (!isEmailValid) {
      toast.error("Enter a valid email address before requesting an OTP.")
      return
    }

    try {
      await requestMemberOtp({ email: getValues("email") }).unwrap()
      setCountdown(300)
      toast.success("The OTP was successfully sent to the member's email!")
    } catch {
      toast.error("Failed to send the OTP. Please try again.")
    }
  }

  const onSubmit = async (data: CreateMemberData) => {
    try {
      await createMember(data).unwrap()
      toast.success("New member registered successfully!")
      navigate("/dashboard/members")
    } catch {
      toast.error("Failed to register the member. Please check the OTP or your information.")
    }
  }

  const isBusy = isSubmitting || isCreating

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/members")}
          aria-label="Back to the member list"
          className="text-text-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Member</h1>
          <p className="text-text-secondary mt-1 text-[13px]">Register a new member account in the SmartGym operations system.</p>
        </div>
      </div>

      <Card className="shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <h2 className="text-[16px] font-bold text-white">Basic Member Information</h2>
          <p className="text-text-secondary text-[12px]">Make sure the email address is active to receive the OTP.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  placeholder="Enter the name as shown on the member's ID"
                  icon={User}
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="email@contoh.com"
                icon={Mail}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="WhatsApp / Phone Number"
                inputMode="numeric"
                type="tel"
                placeholder="081234567890"
                icon={Phone}
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
                }}
              />

              <Input
                label="Verification Code (OTP)"
                placeholder="6-digit OTP"
                icon={Hash}
                maxLength={6}
                inputMode="numeric"
                error={errors.code?.message}
                {...register("code")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
                }}
                rightElement={
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || countdown > 0}
                    className="bg-primary/10 text-primary hover:bg-primary/20 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      "Sending..."
                    ) : countdown > 0 ? (
                      `Resend (${formatTime(countdown)})`
                    ) : (
                      <>
                        <Send className="h-3 w-3" />
                        Request OTP
                      </>
                    )}
                  </button>
                }
              />

              <Input
                label="Initial Password"
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                placeholder="Min. 8 karakter"
                icon={Lock}
                error={errors.password?.message}
                {...register("password")}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted cursor-pointer transition-colors hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <div className="bg-primary/10 border-primary/20 flex items-start gap-3 rounded-xl border p-4">
              <Info className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-primary text-[13px] font-semibold">Registration Process (OTP)</span>
                <span className="text-primary/80 mt-1 text-[12px]">
                  Enter the email address first, then click <strong>&quot;Request OTP&quot;</strong>. The system will send a 6-digit code
                  to the prospective member's email. Enter it in the form before saving.
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/members")}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isBusy}
                leftIcon={!isBusy && <Save className="h-4 w-4" />}
                className="font-bold"
              >
                {isBusy ? "Saving..." : "Save Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
