import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import toast from "react-hot-toast"

import { renderWithRouter } from "../../../test/utils/renderWithRouter"
import CreateMember from "./CreateMember"

const mockNavigate = vi.fn()
const mockRequestOtpUnwrap = vi.fn()
const mockCreateMemberUnwrap = vi.fn()
const mockRequestMemberOtp = vi.fn()
const mockCreateMember = vi.fn()
const mockUseRequestMemberOtpMutation = vi.fn()
const mockUseCreateMemberMutation = vi.fn()

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

vi.mock("~/services/member.service", () => ({
  useRequestMemberOtpMutation: () => mockUseRequestMemberOtpMutation(),
  useCreateMemberMutation: () => mockUseCreateMemberMutation()
}))

const validMemberPayload = {
  name: "Budi Santoso",
  email: "budi@smartgym.id",
  phoneNumber: "081234567890",
  code: "123456",
  password: "Password123!"
}

describe("CreateMember Page", () => {
  beforeEach(() => {
    vi.resetAllMocks()

    mockRequestMemberOtp.mockReturnValue({ unwrap: mockRequestOtpUnwrap })
    mockCreateMember.mockReturnValue({ unwrap: mockCreateMemberUnwrap })

    mockUseRequestMemberOtpMutation.mockReturnValue([mockRequestMemberOtp, { isLoading: false }])
    mockUseCreateMemberMutation.mockReturnValue([mockCreateMember, { isLoading: false }])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders form fields, OTP info banner, and action buttons", () => {
    renderWithRouter(<CreateMember />)

    expect(screen.getByRole("heading", { name: /add new member/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter the name as shown on the member's ID")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("email@contoh.com")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("081234567890")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("6-digit OTP")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Min. 8 karakter")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /request otp/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /save member/i })).toBeInTheDocument()
  })

  it("navigates back to member list when clicking back or cancel button", async () => {
    const user = userEvent.setup()
    renderWithRouter(<CreateMember />)

    await user.click(screen.getByRole("button", { name: /back to the member list/i }))
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/members")

    await user.click(screen.getByRole("button", { name: /cancel/i }))
    expect(mockNavigate).toHaveBeenCalledTimes(2)
    expect(mockNavigate).toHaveBeenLastCalledWith("/dashboard/members")
  })

  it("strips non-numeric characters from phone number and OTP inputs", async () => {
    const user = userEvent.setup()
    renderWithRouter(<CreateMember />)

    const phoneInput = screen.getByPlaceholderText("081234567890")
    const otpInput = screen.getByPlaceholderText("6-digit OTP")

    await user.type(phoneInput, "0812-abc-3456")
    await user.type(otpInput, "12ab34cd56")

    expect(phoneInput).toHaveValue("08123456")
    expect(otpInput).toHaveValue("123456")
  })

  it("toggles initial password visibility when clicking the eye button", async () => {
    const user = userEvent.setup()
    renderWithRouter(<CreateMember />)

    const passwordInput = screen.getByPlaceholderText("Min. 8 karakter")
    const toggleButton = passwordInput.parentElement?.querySelector("button")

    if (!toggleButton) {
      throw new Error("Password visibility toggle button not found")
    }

    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("shows validation toast and does not request OTP when email is invalid", async () => {
    const user = userEvent.setup()
    renderWithRouter(<CreateMember />)

    await user.type(screen.getByPlaceholderText("email@contoh.com"), "invalid-email")
    await user.click(screen.getByRole("button", { name: /request otp/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Enter a valid email address before requesting an OTP.")
    })
    expect(mockRequestMemberOtp).not.toHaveBeenCalled()
  })

  it("sends OTP, starts 5-minute countdown, and re-enables button after timer finishes", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] })
    const user = userEvent.setup()
    mockRequestOtpUnwrap.mockResolvedValueOnce({})

    renderWithRouter(<CreateMember />)

    await user.type(screen.getByPlaceholderText("email@contoh.com"), validMemberPayload.email)
    await user.click(screen.getByRole("button", { name: /request otp/i }))

    await waitFor(() => {
      expect(mockRequestMemberOtp).toHaveBeenCalledWith({ email: validMemberPayload.email })
      expect(toast.success).toHaveBeenCalledWith("The OTP was successfully sent to the member's email!")
    })

    const resendButton = screen.getByRole("button", { name: /resend \(05:00\)/i })
    expect(resendButton).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByRole("button", { name: /resend \(04:59\)/i })).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(299 * 1000)
    })
    expect(screen.getByRole("button", { name: /request otp/i })).not.toBeDisabled()
  })

  it("shows error toast when requesting OTP fails", async () => {
    const user = userEvent.setup()
    mockRequestOtpUnwrap.mockRejectedValueOnce(new Error("SMTP error"))

    renderWithRouter(<CreateMember />)

    await user.type(screen.getByPlaceholderText("email@contoh.com"), validMemberPayload.email)
    await user.click(screen.getByRole("button", { name: /request otp/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to send the OTP. Please try again.")
    })
    expect(screen.getByRole("button", { name: /request otp/i })).not.toBeDisabled()
  })

  it("disables OTP button and shows sending state while OTP request is loading", () => {
    mockUseRequestMemberOtpMutation.mockReturnValue([mockRequestMemberOtp, { isLoading: true }])

    renderWithRouter(<CreateMember />)

    const sendingButton = screen.getByRole("button", { name: /sending\.\.\./i })
    expect(sendingButton).toBeInTheDocument()
    expect(sendingButton).toBeDisabled()
  })

  it("does not submit when form fields are empty", async () => {
    const user = userEvent.setup()
    renderWithRouter(<CreateMember />)

    await user.click(screen.getByRole("button", { name: /save member/i }))

    await waitFor(() => {
      expect(mockCreateMember).not.toHaveBeenCalled()
    })
  })

  it("submits valid member data, shows success toast, and navigates to member list", async () => {
    const user = userEvent.setup()
    mockCreateMemberUnwrap.mockResolvedValueOnce({})

    renderWithRouter(<CreateMember />)

    await user.type(screen.getByPlaceholderText("Enter the name as shown on the member's ID"), validMemberPayload.name)
    await user.type(screen.getByPlaceholderText("email@contoh.com"), validMemberPayload.email)
    await user.type(screen.getByPlaceholderText("081234567890"), validMemberPayload.phoneNumber)
    await user.type(screen.getByPlaceholderText("6-digit OTP"), validMemberPayload.code)
    await user.type(screen.getByPlaceholderText("Min. 8 karakter"), validMemberPayload.password)

    await user.click(screen.getByRole("button", { name: /save member/i }))

    await waitFor(() => {
      expect(mockCreateMember).toHaveBeenCalledWith(validMemberPayload)
      expect(toast.success).toHaveBeenCalledWith("New member registered successfully!")
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard/members")
    })
  })

  it("shows error toast and stays on page when create member fails", async () => {
    const user = userEvent.setup()
    mockCreateMemberUnwrap.mockRejectedValueOnce(new Error("Invalid OTP"))

    renderWithRouter(<CreateMember />)

    await user.type(screen.getByPlaceholderText("Enter the name as shown on the member's ID"), validMemberPayload.name)
    await user.type(screen.getByPlaceholderText("email@contoh.com"), validMemberPayload.email)
    await user.type(screen.getByPlaceholderText("081234567890"), validMemberPayload.phoneNumber)
    await user.type(screen.getByPlaceholderText("6-digit OTP"), validMemberPayload.code)
    await user.type(screen.getByPlaceholderText("Min. 8 karakter"), validMemberPayload.password)

    await user.click(screen.getByRole("button", { name: /save member/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to register the member. Please check the OTP or your information.")
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("disables Cancel and shows loading state on submit button while creating", () => {
    mockUseCreateMemberMutation.mockReturnValue([mockCreateMember, { isLoading: true }])

    renderWithRouter(<CreateMember />)

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled()

    const submitButton = screen.getByRole("button", { name: /memproses\.\.\./i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute("aria-busy", "true")
  })
})
