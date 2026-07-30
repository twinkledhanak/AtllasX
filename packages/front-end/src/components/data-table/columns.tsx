import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

export type User = {
  firstName: string
  middleName?: string
  lastName: string
  phoneNumber: string
  address: string
  adminNotes: string
  registered: string
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<User>[] = [
  // FIRST NAME
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 font-medium"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        First
        {column.getIsSorted() === "asc" && " ↑"}
        {column.getIsSorted() === "desc" && " ↓"}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.firstName}</span>
    ),
    size: 120,
  },

  // MIDDLE NAME
  {
    accessorKey: "middleName",
    header: "Middle",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.middleName || "—"}
      </span>
    ),
    size: 100,
  },

  // LAST NAME
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 font-medium"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Last
        {column.getIsSorted() === "asc" && " ↑"}
        {column.getIsSorted() === "desc" && " ↓"}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.lastName}</span>
    ),
    size: 140,
  },

  // PHONE NUMBER
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.original.phoneNumber}
      </span>
    ),
    size: 140,
  },

  // ADDRESS
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="text-muted-foreground break-words">
        {row.original.address}
      </span>
    ),
    size: 240,
  },

  // ADMIN NOTES
  {
    accessorKey: "adminNotes",
    header: "Notes",
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-1">
        {row.original.adminNotes}
      </span>
    ),
    size: 200,
  },

  // REGISTERED DATE
  {
    accessorKey: "registered",
    header: "Registered",
    cell: ({ row }) => {
      const date = new Date(row.original.registered)
      return (
        <span className="text-sm">
          {date.toLocaleDateString()}
        </span>
      )
    },
    size: 120,
  },

  // CREATED AT
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </span>
      )
    },
    size: 120,
  },

  // UPDATED AT
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt)
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </span>
      )
    },
    size: 120,
  },
]
