import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import toast from "react-hot-toast"

import { renderWithRouter } from "../../../test/utils/renderWithRouter"
import ForgotPassword from "./ForgotPassword"

const mockNavigate = vi.fn()

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router")
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock("~/components/auth/ForgotPasswordEmail", () => ({
  ForgotPasswordEmail: ({ onSuccess }: { onSuccess: (email: string) => void }) => (
    <div data-testid="step-email">
      <button
        type="button"
        onClick={() => onSuccess("member@smartgym.id")}
      >
        Complete Email Step
      </button>
    </div>
  )
}))

vi.mock("~/components/auth/ForgotPasswordOtp", () => ({
  ForgotPasswordOtp: ({ email, onSuccess, onBack }: { email: string; onSuccess: (code: string) => void; onBack: () => void }) => (
    <div data-testid="step-otp">
      <span data-testid="otp-email">{email}</span>
      <button
        type="button"
        onClick={onBack}
      >
        Back to Email
      </button>
      <button
        type="button"
        onClick={() => onSuccess("654321")}
      >
        Complete OTP Step
      </button>
    </div>
  )
}))

vi.mock("~/components/auth/ForgotPasswordReset", () => ({
  ForgotPasswordReset: ({ email, otpCode, onSubmit }: { email: string; otpCode: string; onSubmit: () => void }) => (
    <div data-testid="step-reset">
      <span data-testid="reset-email">{email}</span>
      <span data-testid="reset-otp">{otpCode}</span>
      <button
        type="button"
        onClick={onSubmit}
      >
        Complete Reset Step
      </button>
    </div>
  )
}))

describe("ForgotPassword Page", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders step 1 (ForgotPasswordEmail) by default", () => {
    renderWithRouter(<ForgotPassword />)

    expect(screen.getByTestId("step-email")).toBeInTheDocument()
    expect(screen.queryByTestId("step-otp")).not.toBeInTheDocument()
    expect(screen.queryByTestId("step-reset")).not.toBeInTheDocument()
  })

  it("moves from step 1 to step 2 with submitted email and shows success toast", async () => {
    const user = userEvent.setup()
    renderWithRouter(<ForgotPassword />)

    await user.click(screen.getByRole("button", { name: /complete email step/i }))

    expect(screen.queryByTestId("step-email")).not.toBeInTheDocument()
    expect(screen.getByTestId("step-otp")).toBeInTheDocument()
    expect(screen.getByTestId("otp-email")).toHaveTextContent("member@smartgym.id")
    expect(toast.success).toHaveBeenCalledWith("The OTP code has been sent to your email!")
  })

  it("returns from step 2 back to step 1 when onBack is triggered", async () => {
    const user = userEvent.setup()
    renderWithRouter(<ForgotPassword />)

    await user.click(screen.getByRole("button", { name: /complete email step/i }))
    expect(screen.getByTestId("step-otp")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /back to email/i }))

    expect(screen.getByTestId("step-email")).toBeInTheDocument()
    expect(screen.queryByTestId("step-otp")).not.toBeInTheDocument()
  })

  it("moves from step 2 to step 3 with email and otpCode and shows success toast", async () => {
    const user = userEvent.setup()
    renderWithRouter(<ForgotPassword />)

    await user.click(screen.getByRole("button", { name: /complete email step/i }))
    await user.click(screen.getByRole("button", { name: /complete otp step/i }))

    expect(screen.queryByTestId("step-otp")).not.toBeInTheDocument()
    expect(screen.getByTestId("step-reset")).toBeInTheDocument()
    expect(screen.getByTestId("reset-email")).toHaveTextContent("member@smartgym.id")
    expect(screen.getByTestId("reset-otp")).toHaveTextContent("654321")
    expect(toast.success).toHaveBeenCalledWith("The OTP code has been verified! Please create a new password.")
  })

  it("shows success toast on reset completion and navigates to login after 1500ms", () => {
    vi.useFakeTimers()
    renderWithRouter(<ForgotPassword />)

    fireEvent.click(screen.getByRole("button", { name: /complete email step/i }))
    fireEvent.click(screen.getByRole("button", { name: /complete otp step/i }))
    fireEvent.click(screen.getByRole("button", { name: /complete reset step/i }))

    expect(toast.success).toHaveBeenCalledWith("Password changed successfully! Please log in again.")
    expect(mockNavigate).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1499)
    expect(mockNavigate).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login")
  })
})
