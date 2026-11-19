export type PaginationMeta = {
  paginate: {
    size: number
    currentPage: number
    totalPages: number
    totalData: number
    prevUrl: string | null
    nextUrl: string | null
    links: Array<{
      label: string
      active: boolean
      url: string | null
    }>
  }
}

export type ApiResponse = {
  statusCode: number
  message: string
}

export type ApiResponsePaginate = ApiResponse & PaginationMeta
