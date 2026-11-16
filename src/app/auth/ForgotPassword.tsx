import { useState } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"


import { ForgotPasswordEmail } from "../../components/auth/ForgotPasswordEmail"
import { ForgotPasswordReset } from "../../components/auth/ForgotPasswordReset"

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")

  const handleEmailSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail)
    setStep(2)
    toast.success("Kode OTP telah dikirim ke email Anda!")
  }

  const handleResetSuccess = () => {
    toast.success("Password berhasil diubah! Silakan login.")

    setTimeout(() => {
      navigate("/auth/login")
    }, 1500)
  }

  return (
    <div className="w-full">

      {step === 1 ? (
        <ForgotPasswordEmail onSuccess={handleEmailSuccess} />
      ) : (
        <ForgotPasswordReset
          email={email}
          onSubmit={handleResetSuccess}
        />
      )}
    </div>
  )
}
