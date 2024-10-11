export interface Pagination {
  total_records: number
  per_page: number
  current_page: number
  total_pages: number
  next_page: number | null
  prev_page: number | null
}
