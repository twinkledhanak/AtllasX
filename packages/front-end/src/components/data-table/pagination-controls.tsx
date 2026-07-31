import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
  export function PaginationControls({ table }) {
    const pageIndex = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()
  
    const getPageNumbers = () => {
      const pages = []
      const maxShown = 5
  
      if (pageCount <= maxShown) {
        for (let i = 0; i < pageCount; i++) pages.push(i)
        return pages
      }
  
      const first = 0
      const last = pageCount - 1
  
      const left = Math.max(pageIndex - 1, 1)
      const right = Math.min(pageIndex + 1, pageCount - 2)
  
      pages.push(first)
  
      if (left > 1) pages.push("ellipsis-left")
  
      for (let i = left; i <= right; i++) pages.push(i)
  
      if (right < pageCount - 2) pages.push("ellipsis-right")
  
      pages.push(last)
  
      return pages
    }
  
    const pages = getPageNumbers()
  
    return (
      <Pagination>
        <PaginationContent>
  
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.previousPage()
              }}
              className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
  
          {/* Page Numbers */}
          {pages.map((p, idx) => {
            if (p === "ellipsis-left" || p === "ellipsis-right") {
              return (
                <PaginationItem key={idx}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
  
            const isActive = p === pageIndex
  
            return (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={isActive}
                  onClick={(e) => {
                    e.preventDefault()
                    table.setPageIndex(p)
                  }}
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            )
          })}
  
          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.nextPage()
              }}
              className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
  
        </PaginationContent>
      </Pagination>
    )
  }
  