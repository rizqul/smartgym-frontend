import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderWithRouter } from "../../../test/utils/renderWithRouter"
import Login from "./Login"

const mockLogin = vi.fn()

vi.mock("~/hooks/useAuth", () => ({
  default: () => ({
    login: mockLogin
  })
}))

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders login form elements correctly", () => {
    renderWithRouter(<Login />)

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("admin@smartgym.id")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()

    const forgotLink = screen.getByRole("link", { name: /forgot password\?/i })
    expect(forgotLink).toBeInTheDocument()
    expect(forgotLink).toHaveAttribute("href", "/auth/forgot-password")
  })

  it("toggles password visibility when clicking eye button", async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login />)

    const passwordInput = screen.getByPlaceholderText("••••••••")
    const toggleButton = screen.getByRole("button", { name: /show password/i })

    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /hide password/i }))
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("does not call login when submitting empty form", async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login />)

    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it("does not call login when email format is invalid", async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login />)

    await user.type(screen.getByPlaceholderText("admin@smartgym.id"), "admin@invalid")
    await user.type(screen.getByPlaceholderText("••••••••"), "admin12345")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it("calls login with valid credentials and shows loading state while submitting", async () => {
    const user = userEvent.setup()

    let resolveLogin!: () => void
    mockLogin.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve
        })
    )

    renderWithRouter(<Login />)

    await user.type(screen.getByPlaceholderText("admin@smartgym.id"), "admin@gymmick.my.id")
    await user.type(screen.getByPlaceholderText("••••••••"), "admin12345")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    const loadingButton = await screen.findByRole("button", { name: /memproses\.\.\./i })
    expect(loadingButton).toBeInTheDocument()
    expect(loadingButton).toBeDisabled()
    expect(loadingButton).toHaveAttribute("aria-busy", "true")

    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledWith({
      email: "admin@gymmick.my.id",
      password: "admin12345",
      remember: false
    })

    resolveLogin()
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })
  })

  it("displays server error message when login throws an Error", async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce(new Error("Invalid email or password"))

    renderWithRouter(<Login />)

    await user.type(screen.getByPlaceholderText("admin@smartgym.id"), "admin@gymmick.my.id")
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpassword")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument()
  })

  it("displays fallback error message when login throws non-Error value", async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce("Unexpected failure")

    renderWithRouter(<Login />)

    await user.type(screen.getByPlaceholderText("admin@smartgym.id"), "admin@gymmick.my.id")
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpassword")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    expect(await screen.findByText("Unable to sign in. Please try again.")).toBeInTheDocument()
  })
})
