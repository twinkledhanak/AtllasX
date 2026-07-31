"use client"

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table"

import { useState, useEffect } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { visibleColumns } from "./columns"
import { PaginationControls } from "./pagination-controls"

export function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [hydrated, setHydrated] = useState(false) // To fix the 2 second delay on table load

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, pagination,},
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: false,   // client-side sorting for now
    manualPagination: false, // client-side pagination for now
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  })
  useEffect(() => {
    const visibilityState = {}
  
    table.getAllLeafColumns().forEach(col => {
      visibilityState[col.id] = visibleColumns.includes(col.id)
    })
  
    setColumnVisibility(visibilityState)
  }, [table])
  
  useEffect(() => {
    setHydrated(true)
  }, [])

  if (hydrated) {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/100">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                key={header.id}
                className="text-xs font-medium text-muted-foreground tracking-wide"
                style={{ width: header.getSize() }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              
                {/* Resize handle */}
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className="absolute right-0 top-0 h-full w-1 bg-border cursor-col-resize select-none"
                />
              </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              className="hover:bg-muted/30 transition-colors"
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className="text-sm text-muted-foreground leading-tight">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationControls table={table} />
    </div>
  )
}
}
