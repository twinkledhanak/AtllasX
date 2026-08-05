import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, ClipboardCopy } from "lucide-react"
import { Pencil, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

/** @TODO: Add User action: User is getting created with a default value for registered on: */
export type User = {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phoneNumber: string
  address?: string
  adminNotes?: string
  registered?: string
  createdAt?: string
  updatedAt?: string
}

export const columns = (onDelete: (id: string) => void, onEdit: (user: User) => void): 

ColumnDef<User>[] => [

  // DISPLAY-ONLY FULL NAME COLUMN
  {
    id: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 font-medium"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        FULL NAME
        {column.getIsSorted() === "asc" && " ↑"}
        {column.getIsSorted() === "desc" && " ↓"}
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original
      const middle = user.middleName ? ` ${user.middleName}` : ""
      return (
        <span className="font-medium whitespace-nowrap">
          {user.firstName + middle + " " + user.lastName}
        </span>
      )
    },
    enableSorting: true,
    size: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    id: "contact",
    header: "CONTACT",
    cell: ({ row }) => {
      const email = row.original.email
      const phone = row.original.phoneNumber
  
      return (
        <div className="flex items-center gap-3">
          {/* Email Icon */}
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(email)}
            className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
            title="Copy email"
          >
            <Mail className="h-5 w-5 text-blue-600" />
          </button>
  
          {/* Phone Icon */}
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(phone)}
            className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
            title="Copy phone"
          >
            <Phone className="h-5 w-5 text-green-600" />
          </button>
        </div>
      )
    },
    size: 100,
    minSize: 80,
    maxSize: 140,
  },
  
  // EMAIL
  {
    accessorKey: "email",
    header: "EMAIL",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground whitespace-normal break-words max-w-[200px]">
        {row.original.email}
      </span>
    ),
    size: 200,
    minSize: 150,
    maxSize: 300,
  },

  // PHONE NUMBER
  {
    accessorKey: "phoneNumber",
    header: "PHONE",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.original.phoneNumber}
      </span>
    ),
    size: 120,
    minSize: 100,
    maxSize: 200,
  },

  // ADDRESS
  {
    id: "address",
    header: "ADDRESS",
    enableResizing: false,
    cell: ({ row }) => {
      const fullAddress = row.original.address
  
      // If no address → show placeholder aligned left, no icon
      if (!fullAddress || fullAddress.trim() === "") {
        return (
          <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground italic">
              None
            </span>
          </div>
        )
      }
  
      const shortAddress =
        fullAddress.length > 30
          ? fullAddress.slice(0, 30) + "..."
          : fullAddress
  
      return (
        <div className="flex items-center justify-between w-full">
          {/* Left side: truncated address */}
          <span className="text-muted-foreground whitespace-nowrap">
            {shortAddress}
          </span>
  
          {/* Right side: icon */}
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(fullAddress)}
            className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
            title="Copy full address"
          >
            <MapPin className="h-5 w-5 text-red-600" />
          </button>
        </div>
      )
    },
    size: 210,
    minSize: 170,
    maxSize: 400,
  },

  // ADMIN NOTES (truncated)
  {
    id: "adminNotes",
    header: "NOTES",
    enableResizing: false,
    cell: ({ row }) => {
      const notes = row.original.adminNotes
  
      if (!notes || notes.trim() === "") {
        return (
          <div className="flex items-start justify-between w-full">
            <span className="text-muted-foreground italic">
              None
            </span>
          </div>
        )
      }
  
      const shortNotes =
        notes.length > 20 ? notes.slice(0, 20) + "..." : notes
  
      return (
        <div className="flex items-start justify-between w-full">
          {/* LEFT: allow wrapping */}
          <span className="text-muted-foreground break-words whitespace-normal">
            {shortNotes}
          </span>
  
          {/* RIGHT: copy icon */}
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(notes)}
            className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
            title="Copy full notes"
          >
            <ClipboardCopy className="h-5 w-5 text-purple-600" />
          </button>
        </div>
      )
    },
    size: 160,
  },

  // REGISTERED DATE
  {
    accessorKey: "registered",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        REGISTERED ON
        {column.getIsSorted() === "asc" && " ↑"}
        {column.getIsSorted() === "desc" && " ↓"}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.registered)
      const formatted = `${date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} • ${date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
      return <span className="text-sm">{formatted}</span>
    },
    enableSorting: true,
  }
  ,

  // CREATED AT
  {
    accessorKey: "createdAt",
    header: "CREATED ON",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const formatted = `${date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} • ${date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
      return <span className="text-sm">{formatted}</span>
    },
    size: 140,
  },

  // UPDATED AT
  {
    accessorKey: "updatedAt",
    header:({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        LAST UPDATED ON
        {column.getIsSorted() === "asc" && " ↑"}
        {column.getIsSorted() === "desc" && " ↓"}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt)
      const formatted = `${date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} • ${date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
      return <span className="text-sm">{formatted}</span>
    },
    size: 140,
    enableSorting: true,
  },
  {
  id: "actions",
  header: "ACTIONS",
  enableResizing: false,
  size: 110,
  minSize: 100,
  cell: ({ row }) => {
    const data = row.original

    return (
      <div className="flex items-center gap-2 justify-end w-full">

        {/* Copy */}
        <button
          type="button"
          onClick={() => {
            const { id, ...rest } = data
            navigator.clipboard.writeText(JSON.stringify(rest, null, 2))
            }
          }
          className="p-1 rounded hover:bg-muted transition-colors"
          title="Copy row"
        >
          <ClipboardCopy className="h-5 w-5 text-purple-600" />
        </button>

        {/* Edit */}
        <button
          type="button"
          onClick={() => {
            onEdit(data); // No need for explicit id field as we already have existing users' Id
          }}
          className="p-1 rounded hover:bg-muted transition-colors"
          title="Edit"
        >
          <Pencil className="h-5 w-5 text-blue-600" />
        </button>

        <AlertDialog>
        <AlertDialogTrigger
          render={
            <button
              type="button"
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Delete"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
            </button>
          }
        />

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete User</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete this user? This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
    <AlertDialogCancel
          render={
            <button className="px-4 py-2 rounded border">Cancel</button>
          }/>

      <AlertDialogAction
        onClick={() => onDelete(data.id)}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      </div>
    )
  },
  }
]



export const visibleColumns: string[] = [
  "fullName",
  "contact",
  "address",
  "adminNotes",
  "registered",
  "updatedAt",
  "actions"
]
