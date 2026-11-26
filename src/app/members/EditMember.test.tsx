import { describe, it, expect, vi, beforeEach, afterAll } from "vitest"
import { Route, Routes } from "react-router"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import toast from "react-hot-toast"

import { renderWithRouter } from "../../../test/utils/renderWithRouter"
import EditMember from "./EditMember"

const mockNavigate = vi.fn()
const mockUpdateMemberUnwrap = vi.fn()
const mockUpdateMember = vi.fn()
const mockUseGetAllMemberQuery = vi.fn()
const mockUseUpdateMemberMutation = vi.fn()

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
  useGetAllMemberQuery: (...args: unknown[]) => mockUseGetAllMemberQuery(...args),
  useUpdateMemberMutation: () => mockUseUpdateMemberMutation()
}))

const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL
const mockCreateObjectURL = vi.fn<(obj: Blob | MediaSource) => string>()
const mockRevokeObjectURL = vi.fn<(url: string) => void>()

const mockMember = {
  id: "member-123456789",
  name: "Budi Santoso",
  email: "budi@smartgym.id",
  phoneNumber: "081234567890",
  profileUrl: null,
  membershipExpiredAt: "2099-12-31T00:00:00.000Z",
  createdAt: "2026-01-10T08:00:00.000Z"
}

interface RenderEditOptions {
  memberId?: string
  state?: { member?: typeof mockMember } | null
}

function renderEditMember({ memberId = mockMember.id, state }: RenderEditOptions = {}) {
  const initialEntry =
    state !== undefined ? { pathname: `/dashboard/members/${memberId}/edit`, state } : `/dashboard/members/${memberId}/edit`

  return renderWithRouter(
    <Routes>
      <Route
        path="/dashboard/members/:id/edit"
        element={<EditMember />}
      />
    </Routes>,
    {
      routerProps: {
        initialEntries: [initialEntry]
      }
    }
  )
}

describe("EditMember Page", () => {
  beforeEach(() => {
    vi.resetAllMocks()

    URL.createObjectURL = mockCreateObjectURL
    URL.revokeObjectURL = mockRevokeObjectURL
    mockCreateObjectURL.mockReturnValue("blob:http://localhost/photo-preview-1")

    mockUpdateMember.mockReturnValue({ unwrap: mockUpdateMemberUnwrap })
    mockUseUpdateMemberMutation.mockReturnValue([mockUpdateMember, { isLoading: false }])
    mockUseGetAllMemberQuery.mockReturnValue({
      data: { data: [mockMember] },
      isLoading: false,
      isError: false
    })
  })

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  it("shows loading indicator when location state is missing and query is loading", () => {
    mockUseGetAllMemberQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false
    })

    renderEditMember()

    expect(screen.getByText("Loading member data...")).toBeInTheDocument()
    expect(mockUseGetAllMemberQuery).toHaveBeenCalledWith({ size: 50, page: 1 }, { skip: false })
  })

  it("shows error state when query fails or member is not found, and navigates back", async () => {
    const user = userEvent.setup()
    mockUseGetAllMemberQuery.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: true
    })

    renderEditMember()

    expect(screen.getByText("Member data was not found or could not be loaded.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /back to member list/i }))
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/members")
  })

  it("populates form from location state and skips member list query", () => {
    renderEditMember({ state: { member: mockMember } })

    expect(mockUseGetAllMemberQuery).toHaveBeenCalledWith({ size: 50, page: 1 }, { skip: true })
    expect(screen.getByRole("heading", { name: /edit member data/i })).toBeInTheDocument()
    expect(screen.getByText("#member-1")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter the member's name")).toHaveValue(mockMember.name)
    expect(screen.getByPlaceholderText("email@example.com")).toHaveValue(mockMember.email)
    expect(screen.getByPlaceholderText("081234567890")).toHaveValue(mockMember.phoneNumber)
    expect(screen.getByPlaceholderText(/leave blank to keep the current password/i)).toHaveValue("")
  })

  it("loads member from query fallback when location state is absent", () => {
    renderEditMember()

    expect(mockUseGetAllMemberQuery).toHaveBeenCalledWith({ size: 50, page: 1 }, { skip: false })
    expect(screen.getByPlaceholderText("Enter the member's name")).toHaveValue(mockMember.name)
  })

  it("navigates back to member list when clicking back icon or cancel button", async () => {
    const user = userEvent.setup()
    renderEditMember({ state: { member: mockMember } })

    const backButton = screen.getAllByRole("button")[0]
    await user.click(backButton)
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/members")

    await user.click(screen.getByRole("button", { name: /cancel/i }))
    expect(mockNavigate).toHaveBeenCalledTimes(2)
    expect(mockNavigate).toHaveBeenLastCalledWith("/dashboard/members")
  })

  it("validates photo file type and file size", async () => {
    const user = userEvent.setup({ applyAccept: false })
    renderEditMember({ state: { member: mockMember } })

    const fileInput = screen.getByLabelText(/choose new photo/i)

    const invalidTypeFile = new File(["pdf-content"], "document.pdf", { type: "application/pdf" })
    await user.upload(fileInput, invalidTypeFile)
    expect(screen.getByText("The photo file must be PNG, JPG, or JPEG.")).toBeInTheDocument()

    const oversizedFile = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "large.png", { type: "image/png" })
    await user.upload(fileInput, oversizedFile)
    expect(screen.getByText("The photo file size must not exceed 2MB.")).toBeInTheDocument()

    fireEvent.change(fileInput, { target: { files: [] } })
    expect(screen.queryByText("The photo file size must not exceed 2MB.")).not.toBeInTheDocument()
  })

  it("previews selected photo, revokes previous preview on replace, and clears selection", async () => {
    const user = userEvent.setup()
    mockCreateObjectURL
      .mockReturnValueOnce("blob:http://localhost/photo-preview-1")
      .mockReturnValueOnce("blob:http://localhost/photo-preview-2")

    const { unmount } = renderEditMember({ state: { member: mockMember } })

    const fileInput = screen.getByLabelText(/choose new photo/i)
    const firstFile = new File(["img1"], "avatar1.png", { type: "image/png" })
    await user.upload(fileInput, firstFile)

    expect(screen.getByAltText(mockMember.name)).toHaveAttribute("src", "blob:http://localhost/photo-preview-1")
    expect(screen.getByRole("button", { name: /cancel selection \(avatar1\.png\)/i })).toBeInTheDocument()

    const secondFile = new File(["img2"], "avatar2.jpg", { type: "image/jpeg" })
    await user.upload(fileInput, secondFile)

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:http://localhost/photo-preview-1")
    expect(screen.getByAltText(mockMember.name)).toHaveAttribute("src", "blob:http://localhost/photo-preview-2")

    await user.click(screen.getByRole("button", { name: /cancel selection \(avatar2\.jpg\)/i }))
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:http://localhost/photo-preview-2")
    expect(screen.queryByRole("button", { name: /cancel selection/i })).not.toBeInTheDocument()

    unmount()
  })

  it("submits FormData without optional password and photo, shows API message, and navigates", async () => {
    const user = userEvent.setup()
    mockUpdateMemberUnwrap.mockResolvedValueOnce({ message: "Member profile saved" })

    renderEditMember({ state: { member: mockMember } })

    const nameInput = screen.getByPlaceholderText("Enter the member's name")
    await user.clear(nameInput)
    await user.type(nameInput, "  Budi Updated  ")

    await user.click(screen.getByRole("button", { name: /save changes/i }))

    await waitFor(() => {
      expect(mockUpdateMember).toHaveBeenCalledTimes(1)
    })

    const [{ id, data }] = mockUpdateMember.mock.calls[0] as [{ id: string; data: FormData }]
    expect(id).toBe(mockMember.id)
    expect(data).toBeInstanceOf(FormData)
    expect(data.get("name")).toBe("Budi Updated")
    expect(data.get("email")).toBe(mockMember.email)
    expect(data.get("phoneNumber")).toBe(mockMember.phoneNumber)
    expect(data.has("password")).toBe(false)
    expect(data.has("photo")).toBe(false)

    expect(toast.success).toHaveBeenCalledWith("Member profile saved")
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/members")
  })

  it("appends optional password and photo to FormData and uses fallback success message", async () => {
    const user = userEvent.setup()
    mockUpdateMemberUnwrap.mockResolvedValueOnce({})

    renderEditMember({ state: { member: mockMember } })

    const photoFile = new File(["img"], "new-avatar.jpg", { type: "image/jpeg" })
    await user.upload(screen.getByLabelText(/choose new photo/i), photoFile)
    await user.type(screen.getByPlaceholderText(/leave blank to keep the current password/i), "NewPass123!")

    await user.click(screen.getByRole("button", { name: /save changes/i }))

    await waitFor(() => {
      expect(mockUpdateMember).toHaveBeenCalledTimes(1)
    })

    const [{ data }] = mockUpdateMember.mock.calls[0] as [{ id: string; data: FormData }]
    expect(data.get("password")).toBe("NewPass123!")
    expect(data.get("photo")).toBe(photoFile)

    expect(toast.success).toHaveBeenCalledWith("Member data updated successfully!")
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/members")
  })

  it("shows API error message or fallback error toast when update fails", async () => {
    const user = userEvent.setup()
    renderEditMember({ state: { member: mockMember } })

    mockUpdateMemberUnwrap.mockRejectedValueOnce({ data: { message: "Email already in use" } })
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email already in use")
    })

    mockUpdateMemberUnwrap.mockRejectedValueOnce({ message: "Network error" })
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error")
    })

    mockUpdateMemberUnwrap.mockRejectedValueOnce({})
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update member data.")
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("disables Cancel and shows loading state on submit button while updating", () => {
    mockUseUpdateMemberMutation.mockReturnValue([mockUpdateMember, { isLoading: true }])

    renderEditMember({ state: { member: mockMember } })

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled()

    const submitButton = screen.getByRole("button", { name: /memproses\.\.\./i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute("aria-busy", "true")
  })
})
