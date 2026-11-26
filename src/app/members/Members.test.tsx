import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import toast from "react-hot-toast"

import { renderWithRouter } from "../../../test/utils/renderWithRouter"
import { Alert } from "~/utils/alert"
import Member from "./Members"

const mockNavigate = vi.fn()
const mockRefetch = vi.fn()
const mockRefetchCount = vi.fn()
const mockUnwrap = vi.fn()
const mockDeleteMember = vi.fn()
const mockUseGetAllMemberQuery = vi.fn()
const mockUseGetMemberCountQuery = vi.fn()

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

vi.mock("~/utils/alert", () => ({
  Alert: {
    confirm: vi.fn()
  }
}))

vi.mock("~/services/member.service", () => ({
  useGetAllMemberQuery: (...args: unknown[]) => mockUseGetAllMemberQuery(...args),
  useGetMemberCountQuery: () => mockUseGetMemberCountQuery(),
  useDeleteMemberMutation: () => [mockDeleteMember]
}))

const mockMembers = [
  {
    id: "member-1",
    name: "Budi Santoso",
    email: "budi@smartgym.id",
    phoneNumber: "081234567890",
    profileUrl: null,
    membershipExpiredAt: "2099-12-31T00:00:00.000Z",
    createdAt: "2026-01-10T08:00:00.000Z"
  },
  {
    id: "member-2",
    name: "Siti Aminah",
    email: "siti@smartgym.id",
    phoneNumber: "",
    profileUrl: "https://example.com/siti.jpg",
    membershipExpiredAt: "2020-01-01T00:00:00.000Z",
    createdAt: "2026-01-15T08:00:00.000Z"
  },
  {
    id: "member-3",
    name: "Andi Wijaya",
    email: "andi@smartgym.id",
    phoneNumber: null,
    profileUrl: null,
    membershipExpiredAt: null,
    createdAt: "2026-02-01T08:00:00.000Z"
  }
]

const mockStatsResponse = {
  data: {
    memberCount: 120,
    memberActiveCount: 85,
    memberInactiveCount: 35,
    newMemberCount: 14
  }
}

describe("Member Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockDeleteMember.mockReturnValue({ unwrap: mockUnwrap })
    mockUseGetMemberCountQuery.mockReturnValue({
      data: mockStatsResponse,
      refetch: mockRefetchCount
    })
    mockUseGetAllMemberQuery.mockReturnValue({
      data: { data: mockMembers, paginate: undefined },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch
    })
  })

  it("renders skeleton while initial data is loading", () => {
    mockUseGetAllMemberQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: mockRefetch
    })

    renderWithRouter(<Member />)

    expect(screen.queryByRole("heading", { name: /member management/i })).not.toBeInTheDocument()
  })

  it("renders header, stats cards, and member rows with all membership statuses", () => {
    renderWithRouter(<Member />)

    expect(screen.getByRole("heading", { name: /member management/i })).toBeInTheDocument()
    expect(screen.getByText("120")).toBeInTheDocument()
    expect(screen.getByText("85")).toBeInTheDocument()
    expect(screen.getByText("35")).toBeInTheDocument()
    expect(screen.getByText("14")).toBeInTheDocument()

    expect(screen.getByText("Budi Santoso")).toBeInTheDocument()
    expect(screen.getByText("budi@smartgym.id")).toBeInTheDocument()
    expect(screen.getByText("081234567890")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()

    expect(screen.getByText("Siti Aminah")).toBeInTheDocument()
    expect(screen.getByText("Expired")).toBeInTheDocument()

    expect(screen.getByText("Andi Wijaya")).toBeInTheDocument()
    expect(screen.getByText("Not Active")).toBeInTheDocument()
    expect(screen.getByText("No membership package")).toBeInTheDocument()
    expect(screen.getAllByText("-")).toHaveLength(2)
  })

  it("defaults stats to 0 when count data is unavailable", () => {
    mockUseGetMemberCountQuery.mockReturnValue({
      data: undefined,
      refetch: mockRefetchCount
    })

    renderWithRouter(<Member />)

    expect(screen.getAllByText("0")).toHaveLength(4)
  })

  it("navigates to create and edit pages when action buttons are clicked", async () => {
    const user = userEvent.setup()
    renderWithRouter(<Member />)

    await user.click(screen.getByRole("button", { name: /add member/i }))
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/members/create")

    await user.click(screen.getByRole("button", { name: "Edit Budi Santoso" }))
    expect(mockNavigate).toHaveBeenCalledWith("member-1/edit", {
      state: { member: mockMembers[0] }
    })
  })

  it("debounces search query and allows clearing the search input", async () => {
    const user = userEvent.setup()
    renderWithRouter(<Member />)

    const searchInput = screen.getByPlaceholderText("Search by name or email...")
    await user.type(searchInput, "budi")

    expect(screen.getByText("Updating...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument()

    await waitFor(
      () => {
        expect(mockUseGetAllMemberQuery).toHaveBeenLastCalledWith({
          search: "budi",
          membership: undefined,
          page: 1,
          size: 5
        })
      },
      { timeout: 1500 }
    )

    await user.click(screen.getByRole("button", { name: /clear search/i }))
    expect(searchInput).toHaveValue("")
  })

  it("updates query params when membership status filter changes", async () => {
    const user = userEvent.setup()
    renderWithRouter(<Member />)

    const select = screen.getByRole("combobox")

    await user.selectOptions(select, "active")
    expect(mockUseGetAllMemberQuery).toHaveBeenLastCalledWith({
      search: undefined,
      membership: true,
      page: 1,
      size: 5
    })

    await user.selectOptions(select, "expired")
    expect(mockUseGetAllMemberQuery).toHaveBeenLastCalledWith({
      search: undefined,
      membership: false,
      page: 1,
      size: 5
    })
  })

  it("renders empty state and resets filters when active filters return no results", async () => {
    const user = userEvent.setup()
    mockUseGetAllMemberQuery.mockReturnValue({
      data: { data: [], paginate: undefined },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch
    })

    renderWithRouter(<Member />)

    expect(screen.getByText("No members found")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /reset filters/i })).not.toBeInTheDocument()

    await user.selectOptions(screen.getByRole("combobox"), "active")

    const resetBtn = screen.getByRole("button", { name: /reset filters/i })
    expect(resetBtn).toBeInTheDocument()

    await user.click(resetBtn)
    expect(screen.getByRole("combobox")).toHaveValue("all")
  })

  it("renders error state, retries queries, and supports resetting filters", async () => {
    const user = userEvent.setup()
    mockUseGetAllMemberQuery.mockReturnValue({
      data: { data: [], paginate: undefined },
      isLoading: false,
      isFetching: false,
      isError: true,
      refetch: mockRefetch
    })

    renderWithRouter(<Member />)

    expect(screen.getByText("Failed to load member data.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /try again/i }))
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockRefetchCount).toHaveBeenCalledTimes(1)

    await user.selectOptions(screen.getByRole("combobox"), "expired")
    await user.click(screen.getByRole("button", { name: /reset filters/i }))
    expect(screen.getByRole("combobox")).toHaveValue("all")
  })

  it("shows updating indicator when table is fetching", () => {
    mockUseGetAllMemberQuery.mockReturnValue({
      data: { data: mockMembers, paginate: undefined },
      isLoading: false,
      isFetching: true,
      isError: false,
      refetch: mockRefetch
    })

    renderWithRouter(<Member />)

    expect(screen.getByText("Updating...")).toBeInTheDocument()
  })

  it("does not delete member when confirmation dialog is cancelled", async () => {
    const user = userEvent.setup()
    vi.mocked(Alert.confirm).mockResolvedValueOnce({ isConfirmed: false } as never)

    renderWithRouter(<Member />)

    await user.click(screen.getByRole("button", { name: "Delete Budi Santoso" }))

    expect(Alert.confirm).toHaveBeenCalledWith({
      title: "Delete Member?",
      text: 'Are you sure you want to delete member "Budi Santoso"? This action cannot be undone.',
      confirmText: "Yes, Delete",
      isDanger: true
    })
    expect(mockDeleteMember).not.toHaveBeenCalled()
  })

  it("deletes member, disables delete button while pending, and shows success toast", async () => {
    const user = userEvent.setup()
    let resolveDelete!: () => void

    vi.mocked(Alert.confirm).mockResolvedValueOnce({ isConfirmed: true } as never)
    mockUnwrap.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve
        })
    )

    renderWithRouter(<Member />)

    const deleteBtn = screen.getByRole("button", { name: "Delete Budi Santoso" })
    await user.click(deleteBtn)

    await waitFor(() => {
      expect(deleteBtn).toBeDisabled()
    })

    expect(mockDeleteMember).toHaveBeenCalledWith("member-1")

    resolveDelete()

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Member Budi Santoso was deleted successfully!")
      expect(mockRefetchCount).toHaveBeenCalledTimes(1)
      expect(deleteBtn).not.toBeDisabled()
    })
  })

  it("shows API error message or fallback toast when delete fails", async () => {
    const user = userEvent.setup()

    vi.mocked(Alert.confirm).mockResolvedValueOnce({ isConfirmed: true } as never)
    mockUnwrap.mockRejectedValueOnce({ data: { message: "Member has active transactions" } })

    renderWithRouter(<Member />)

    await user.click(screen.getByRole("button", { name: "Delete Budi Santoso" }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Member has active transactions")
    })

    vi.mocked(Alert.confirm).mockResolvedValueOnce({ isConfirmed: true } as never)
    mockUnwrap.mockRejectedValueOnce({})

    await user.click(screen.getByRole("button", { name: "Delete Siti Aminah" }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete member.")
    })
  })
})
