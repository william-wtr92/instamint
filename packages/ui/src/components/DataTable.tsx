"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React, { useEffect, useState } from "react"

import { DataTablePagination } from "./DataTablePagination"
import { Input } from "./Input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnFilter?: string
  noResultsMessage?: string
  filterPlaceholder?: string
  rowsPerPageLabel?: string
  pageLabel?: string
  ofLabel?: string
  goToFirstPageLabel?: string
  goToPreviousPageLabel?: string
  goToNextPageLabel?: string
  goToLastPageLabel?: string
  totalElementsLabel?: string
  pageSize: number
  pageIndex: number
  setPageSize: (pageSize: number) => void
  setPageIndex: (pageIndex: number) => void
  totalPages?: number
  totalElements?: number
  onFilterChange: (value: string) => void
  withFilter?: boolean
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  columnFilter,
  noResultsMessage,
  filterPlaceholder,
  rowsPerPageLabel,
  pageLabel,
  ofLabel,
  goToFirstPageLabel,
  goToPreviousPageLabel,
  goToNextPageLabel,
  goToLastPageLabel,
  totalElementsLabel,
  pageSize,
  pageIndex,
  setPageSize,
  setPageIndex,
  totalPages,
  totalElements,
  onFilterChange,
  withFilter = false,
}: DataTableProps<TData, TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: totalPages,
    rowCount: totalElements,
    state: {
      columnFilters,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    manualPagination: true,
  })

  useEffect(() => {
    if (columnFilters.length > 0) {
      const filterValue = columnFilters[0].value as string
      onFilterChange(filterValue)

      return
    }

    onFilterChange("")
  }, [columnFilters, onFilterChange])

  return (
    <>
      {withFilter ? (
        <div className="flex items-center py-4">
          <Input
            placeholder={filterPlaceholder}
            value={
              (table.getColumn(columnFilter!)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(columnFilter!)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      ) : null}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {noResultsMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <span className="ml-3 text-sm font-medium text-black">
          {totalElementsLabel} {totalElements}
        </span>
        <DataTablePagination
          table={table}
          rowsPerPageLabel={rowsPerPageLabel}
          pageLabel={pageLabel}
          ofLabel={ofLabel}
          goToFirstPageLabel={goToFirstPageLabel}
          goToPreviousPageLabel={goToPreviousPageLabel}
          goToNextPageLabel={goToNextPageLabel}
          goToLastPageLabel={goToLastPageLabel}
          setPageSize={setPageSize}
          setPageIndex={setPageIndex}
        />
      </div>
    </>
  )
}
