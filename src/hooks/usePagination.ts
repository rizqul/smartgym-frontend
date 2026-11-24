import { useCallback, useState } from "react"

export function usePagination(initialSize = 10) {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(initialSize)

  const handlePageChange = useCallback((url: string) => {
    const query = url.split("?")[1] ?? ""
    const params = new URLSearchParams(query)

    const nextPage = Number(params.get("page"))
    const nextSize = Number(params.get("size"))

    if (nextPage > 0) setPage(nextPage)
    if (nextSize > 0) setSize(nextSize)
  }, [])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setSize(newSize)
    setPage(1)
  }, [])

  const resetPage = useCallback(() => {
    setPage(1)
  }, [])

  return {
    page,
    size,
    setPage,
    setSize,
    handlePageChange,
    handlePageSizeChange,
    resetPage
  }
}
