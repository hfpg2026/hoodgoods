import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export const BusinessPagination = ({
  totalPages,
  currentPage,
  onClickPrev,
  onClickNext,
  onClickPage,
}: {
  totalPages: number
  currentPage: number
  onClickPrev: VoidFunction
  onClickNext: VoidFunction
  onClickPage: (p: number) => void
}) => {
  return (
    totalPages > 1 && (
      <Pagination className="pt-2">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={onClickPrev} />
            </PaginationItem>
          )}

          {currentPage - 2 > 0 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onClickPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {[...Array(totalPages).keys()]
            .splice(Math.max(currentPage - 2, 0), currentPage + 2)
            .map((i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => onClickPage(i + 1)}
                  isActive={i + 1 === currentPage}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

          {currentPage + 2 < totalPages && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => onClickPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={onClickNext} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    )
  )
}
