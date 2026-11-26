import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { formatRupiah } from "~/utils/format"
import Transaction from "./Transaction"

const mockRefetch = vi.fn()
const mockRefetchCount = vi.fn()
const mockUseGetAllTransactionsQuery = vi.fn()
const mockUseGetTransactionCountQuery = vi.fn()

vi.mock("~/services/transaction.service", () => ({
  useGetAllTransactionsQuery: (...args: unknown[]) => mockUseGetAllTransactionsQuery(...args),
  useGetTransactionCountQuery: (...args: unknown[]) => mockUseGetTransactionCountQuery(...args)
}))

vi.mock("~/components/transactions/ExportTransactionPopover", () => ({
  default: ({ typeFilter }: { typeFilter: string }) => (
    <div
      data-testid="export-popover"
      data-type-filter={typeFilter}
    >
      Export Transactions
    </div>
  )
}))

vi.mock("~/components/transactions/TransactionTableRow", () => ({
  default: ({ transaction, isEven }: { transaction: { id: string; orderId: string }; isEven: boolean }) => (
    <tr
      data-testid={`transaction-row-${transaction.id}`}
      data-even={String(isEven)}
    >
      <td>{transaction.orderId}</td>
    </tr>
  )
}))

const mockTransactions = [
  {
    id: "trx-1",
    orderId: "ORDER-001"
  },
  {
    id: "trx-2",
    orderId: "ORDER-002"
  }
]

const mockStatsResponse = {
  data: {
    sumTransactionYearly: 15000000,
    transactionSuccess: 42,
    transactionProcess: 7,
    transactionFailed: 3
  }
}

describe("Transaction Page", () => {
  const currentYear = new Date().getFullYear()

  beforeEach(() => {
    vi.resetAllMocks()

    mockUseGetTransactionCountQuery.mockReturnValue({
      data: mockStatsResponse,
      refetch: mockRefetchCount
    })

    mockUseGetAllTransactionsQuery.mockReturnValue({
      data: {
        data: mockTransactions,
        paginate: {
          page: 1,
          size: 5,
          totalData: 25,
          totalPage: 5
        }
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch
    })
  })

  it("renders skeleton while initial transaction data is loading", () => {
    mockUseGetAllTransactionsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: mockRefetch
    })

    render(<Transaction />)

    expect(screen.queryByRole("heading", { name: /transaction management/i })).not.toBeInTheDocument()
  })

  it("renders header, yearly stats cards, total count, and transaction rows", () => {
    render(<Transaction />)

    expect(mockUseGetTransactionCountQuery).toHaveBeenCalledWith(currentYear)
    expect(screen.getByRole("heading", { name: /transaction management/i })).toBeInTheDocument()
    expect(screen.getByText(`REVENUE (${currentYear})`)).toBeInTheDocument()
    expect(screen.getByText(`Rp ${formatRupiah(15000000)}`)).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
    expect(screen.getByText("7")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText(/total transactions:/i)).toHaveTextContent("Total Transactions: 25")

    const firstRow = screen.getByTestId("transaction-row-trx-1")
    const secondRow = screen.getByTestId("transaction-row-trx-2")
    expect(firstRow).toHaveAttribute("data-even", "true")
    expect(secondRow).toHaveAttribute("data-even", "false")
    expect(screen.getByText("ORDER-001")).toBeInTheDocument()
    expect(screen.getByText("ORDER-002")).toBeInTheDocument()
  })

  it("defaults stats to 0 and falls back total count to transactions length when pagination is absent", () => {
    mockUseGetTransactionCountQuery.mockReturnValue({
      data: undefined,
      refetch: mockRefetchCount
    })
    mockUseGetAllTransactionsQuery.mockReturnValue({
      data: { data: mockTransactions, paginate: undefined },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch
    })

    render(<Transaction />)

    expect(screen.getByText(`Rp ${formatRupiah(0)}`)).toBeInTheDocument()
    expect(screen.getAllByText("0")).toHaveLength(3)
    expect(screen.getByText(/total transactions:/i)).toHaveTextContent("Total Transactions: 2")
  })

  it("debounces search query and allows clearing the search input", async () => {
    const user = userEvent.setup()
    render(<Transaction />)

    const searchInput = screen.getByPlaceholderText("Search by Order ID, member name, or email...")
    await user.type(searchInput, "ORDER-001")

    expect(screen.getByText("Updating...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument()

    await waitFor(
      () => {
        expect(mockUseGetAllTransactionsQuery).toHaveBeenLastCalledWith({
          search: "ORDER-001",
          type: undefined,
          status: undefined,
          page: 1,
          size: 5
        })
      },
      { timeout: 1500 }
    )

    await user.click(screen.getByRole("button", { name: /clear search/i }))
    expect(searchInput).toHaveValue("")
  })

  it("updates query params and ExportTransactionPopover when type and status filters change", async () => {
    const user = userEvent.setup()
    render(<Transaction />)

    const [typeSelect, statusSelect] = screen.getAllByRole("combobox")

    await user.selectOptions(typeSelect, "MEMBERSHIP")
    expect(screen.getByTestId("export-popover")).toHaveAttribute("data-type-filter", "MEMBERSHIP")
    expect(mockUseGetAllTransactionsQuery).toHaveBeenLastCalledWith({
      search: undefined,
      type: "MEMBERSHIP",
      status: undefined,
      page: 1,
      size: 5
    })

    await user.selectOptions(statusSelect, "SUCCESS")
    expect(mockUseGetAllTransactionsQuery).toHaveBeenLastCalledWith({
      search: undefined,
      type: "MEMBERSHIP",
      status: "SUCCESS",
      page: 1,
      size: 5
    })

    await user.selectOptions(typeSelect, "TRAINER")
    expect(screen.getByTestId("export-popover")).toHaveAttribute("data-type-filter", "TRAINER")
  })

  it("shows updating indicator when query is fetching", () => {
    mockUseGetAllTransactionsQuery.mockReturnValue({
      data: { data: mockTransactions, paginate: undefined },
      isLoading: false,
      isFetching: true,
      isError: false,
      refetch: mockRefetch
    })

    render(<Transaction />)

    expect(screen.getByText("Updating...")).toBeInTheDocument()
  })

  it("renders empty state for both unfiltered and filtered queries, and resets filters", async () => {
    const user = userEvent.setup()
    mockUseGetAllTransactionsQuery.mockReturnValue({
      data: { data: [], paginate: undefined },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch
    })

    render(<Transaction />)

    expect(screen.getByText("No transaction data available")).toBeInTheDocument()
    expect(screen.getByText("Member payment transactions will be recorded automatically here.")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /reset filters/i })).not.toBeInTheDocument()

    const [typeSelect, statusSelect] = screen.getAllByRole("combobox")
    await user.selectOptions(typeSelect, "MEMBERSHIP")
    await user.selectOptions(statusSelect, "PENDING")

    expect(screen.getByText("No transactions match your filters")).toBeInTheDocument()
    expect(screen.getByText("Try changing your search keywords or status filter.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /reset filters/i }))

    expect(typeSelect).toHaveValue("")
    expect(statusSelect).toHaveValue("")
    expect(screen.getByText("No transaction data available")).toBeInTheDocument()
  })

  it("renders error state, retries both queries, and resets filters when active", async () => {
    const user = userEvent.setup()
    mockUseGetAllTransactionsQuery.mockReturnValue({
      data: { data: [], paginate: undefined },
      isLoading: false,
      isFetching: false,
      isError: true,
      refetch: mockRefetch
    })

    render(<Transaction />)

    expect(screen.getByText("Failed to load transaction data.")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /reset filters/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /try again/i }))
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockRefetchCount).toHaveBeenCalledTimes(1)

    const [typeSelect] = screen.getAllByRole("combobox")
    await user.selectOptions(typeSelect, "TRAINER")

    const resetBtn = screen.getByRole("button", { name: /reset filters/i })
    expect(resetBtn).toBeInTheDocument()

    await user.click(resetBtn)
    expect(typeSelect).toHaveValue("")
  })
})