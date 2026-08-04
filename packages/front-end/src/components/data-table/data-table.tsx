"use client"

import {
  useReactTable,
  getCoreRowModel,
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

import { User, visibleColumns } from "./columns"
import { PaginationControls } from "./pagination-controls"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

import { useRouter } from "next/navigation" // @TODO: Fix this and change to router navigation
import UserForm from "../forms/UserForm"

export function DataTable({
  columns,
  data,
  total,
  pagination,
  setPagination,
  localSearch,
  setSearchQuery,
  setLocalSearch,
  sorting,
  setSorting,
}) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editUserData, setEditUserData] = useState(null);

  const [hydrated, setHydrated] = useState(false)

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

  const handleEdit = async (user: User) => {
    // This function does not invoke Backend, just to populate the UserForm correctly.
    setEditUserData(user)
    setShowUserDialog(true)
  }


  const table = useReactTable({
    data,
    columns: columns(handleDelete, handleEdit),
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(total / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    const visibilityState = {};

    table.getAllLeafColumns().forEach((col) => {
      visibilityState[col.id] = visibleColumns.includes(col.id)
    })

    setColumnVisibility(visibilityState)
  }, [table])

  useEffect(() => {
    setHydrated(true);
  }, [])

  if (!hydrated) return null;

  return (
    <div className="relative">
  
        {/* Floating delete alert */}
      {deleteMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <Alert variant="default" className="shadow-lg border bg-white">
            <AlertTitle className="font-bold">Delete Action</AlertTitle>
            <AlertDescription>{deleteMessage}</AlertDescription>
          </Alert>
        </div>
      )}
        {/* Floating edit alert */}
      {editMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <Alert variant="default" className="shadow-lg border bg-white">
            <AlertTitle className="font-bold">Edit Action</AlertTitle>
            <AlertDescription>{editMessage}</AlertDescription>
          </Alert>
        </div>
      )}
        {/* Floating add alert */}
      {addMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <Alert variant="default" className="shadow-lg border bg-white">
            <AlertTitle className="font-bold">Add Action</AlertTitle>
            <AlertDescription>{addMessage}</AlertDescription>
          </Alert>
        </div>
      )}


      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            placeholder="Search User by Name or Email..."
            className="border rounded p-1 w-150"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />

          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
           onClick={() => {
            setSearchQuery(localSearch);   // triggers backend search
            setPagination({ pageIndex: 0, pageSize: pagination.pageSize }); // reset to page 0
          }}
          >
            🔍 Find Users
          </button>

          <button
            className="px-3 py-2 bg-slate-300 text-slate-800 rounded-lg shadow hover:bg-slate-400 transition"
            onClick={() => {
              setLocalSearch("");          
              setSearchQuery("");          
              setPagination({              
                pageIndex: 0,
                pageSize: pagination.pageSize
              });
            }}
          >
            ❌ Reset Search
          </button>
        </div>

        <button
          onClick={() => {
            setEditUserData(null);
            setShowUserDialog(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Add New User
        </button>
      </div>

      {/* Add/Edit User Dialog */}
      <UserForm
        open={showUserDialog}
        onOpenChange={setShowUserDialog}
        initialData={editUserData}
        onSubmit={async (formData) => {
          if (editUserData) {
            // formData: Only the form fields edited by the user
            // editUserData: Original raw user data with id
            //console.log("sending this new data:"+ formData)
            const res = await fetch(`http://localhost:50000/users/${editUserData.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            })
            setEditMessage("User updated successfully")
            setTimeout(() => setEditMessage(null), 10000)
            //console.log("Status:", res.status)
            const data = await res.json().catch(() => null)
            console.log("Response body:", data)

            if (!res.ok) {
              console.error("PATCH failed:", data)
            }
          } else {
            const res = await fetch(`http://localhost:50000/users`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            })
            
            const data = await res.json().catch(() => null)
            console.log("Response body:", data)

            if (!res.ok) {
              console.error("POST failed:", data)
              setAddMessage(data?.error || "Failed to add user.")
            } else {
              setAddMessage("User added successfully")
            }              
            setTimeout(() => setAddMessage(null), 10000)
          }

          
          router.refresh()
        }}
      />

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-medium text-muted-foreground tracking-wide"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
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
  );
}