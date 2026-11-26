import { useState } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"

import { ForgotPasswordEmail } from "../../components/auth/ForgotPasswordEmail"
import { ForgotPasswordOtp } from "~/components/auth/ForgotPasswordOtp"
import { ForgotPasswordReset } from "../../components/auth/ForgotPasswordReset"

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2 | 3>(1)

  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")

  const handleEmailSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail)
    setStep(2)
    toast.success("The OTP code has been sent to your email!")
  }

  const handleOtpSuccess = (code: string) => {
    setOtpCode(code)
    setStep(3)
    toast.success("The OTP code has been verified! Please create a new password.")
  }

  const handleResetSuccess = () => {
    toast.success("Password changed successfully! Please log in again.")

    setTimeout(() => {
      navigate("/auth/login")
    }, 1500)
  }

  return (
    <div className="w-full">
      {step === 1 && <ForgotPasswordEmail onSuccess={handleEmailSuccess} />}

      {step === 2 && (
        <ForgotPasswordOtp
          email={email}
          onSuccess={handleOtpSuccess}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ForgotPasswordReset
          email={email}
          otpCode={otpCode}
          onSubmit={handleResetSuccess}
        />
      )}
    </div>
  )
}
