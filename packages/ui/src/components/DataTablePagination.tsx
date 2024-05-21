import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"

import { Button } from "./Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  rowsPerPageLabel?: string
  pageLabel?: string
  ofLabel?: string
  goToFirstPageLabel?: string
  goToPreviousPageLabel?: string
  goToNextPageLabel?: string
  goToLastPageLabel?: string
  setPageSize: (pageSize: number) => void
  setPageIndex: (pageIndex: number) => void
}

export const DataTablePagination = <TData,>({
  table,
  rowsPerPageLabel,
  pageLabel,
  ofLabel,
  goToFirstPageLabel,
  goToPreviousPageLabel,
  goToNextPageLabel,
  goToLastPageLabel,
  setPageSize,
  setPageIndex,
}: DataTablePaginationProps<TData>) => {
  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{rowsPerPageLabel}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const newSize = Number(value)
              table.setPageSize(newSize)
              setPageSize(newSize)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent className="bg-white" side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {pageLabel} {table.getState().pagination.pageIndex + 1} {ofLabel}{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0)
              setPageIndex(0)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{goToFirstPageLabel}</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.previousPage()
              setPageIndex(table.getState().pagination.pageIndex - 1)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{goToPreviousPageLabel}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage()
              setPageIndex(table.getState().pagination.pageIndex + 1)
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{goToNextPageLabel}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1)
              setPageIndex(table.getPageCount() - 1)
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{goToLastPageLabel}</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
