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
    toast.success("Kode OTP telah dikirim ke email Anda!")
  }

  const handleOtpSuccess = (code: string) => {
    setOtpCode(code)
    setStep(3)
    toast.success("Kode OTP divalidasi! Silakan buat sandi baru.")
  }

  const handleResetSuccess = () => {
    toast.success("Password berhasil diubah! Silakan login kembali.")

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
