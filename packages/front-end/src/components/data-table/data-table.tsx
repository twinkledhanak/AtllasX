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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

import { useRouter } from "next/navigation"
import UserForm from "../forms/UserForm"

export function DataTable({ columns, data }) {  
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [editUserData, setEditUserData] = useState(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [hydrated, setHydrated] = useState(false) // To fix the 2 second delay on table load

  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:50000/users/${id}`, {
        method: "DELETE",
      })
  
      if (!res.ok) {
        setDeleteMessage("Failed to delete user.")
        setTimeout(() => setDeleteMessage(null), 10000)
        return
      }
  
      setDeleteMessage(`User has been deleted.`)
      setTimeout(() => setDeleteMessage(null), 10000)
      router.refresh()
    } catch (err) {
      setDeleteMessage("Network error while deleting user.")
      setTimeout(() => setDeleteMessage(null), 10000)
    }
  }


  const table = useReactTable({
    data,
    columns: columns(handleDelete),
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
      <div className="relative">
  
        {/* Floating delete alert */}
        {deleteMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            <Alert variant="default" className="shadow-lg border border-border bg-white">
              <AlertTitle className="font-bold">Delete Action</AlertTitle>
              <AlertDescription>{deleteMessage}</AlertDescription>
            </Alert>
          </div>
        )}
  
        {/* Add User Button OUTSIDE the table container */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditUserData(null)
              setShowUserDialog(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add New User
          </button>
        </div>
  
        {/* ⭐ Reusable Add/Edit User Dialog */}
        <UserForm
          open={showUserDialog}
          onOpenChange={setShowUserDialog}
          initialData={editUserData}
          onSubmit={async (formData) => {
            if (editUserData) {
              await fetch(`http://localhost:50000/users/${editUserData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              })
              setDeleteMessage("User updated successfully")
            } else {
              await fetch(`http://localhost:50000/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              })
              setDeleteMessage("User added successfully")
            }
  
            setTimeout(() => setDeleteMessage(null), 3000)
            router.refresh()
          }}
        />
  
        {/* ⭐ Table container */}
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
                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="text-sm text-muted-foreground leading-tight">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
  
          <PaginationControls table={table} />
        </div>
      </div>
    )
  }
}  