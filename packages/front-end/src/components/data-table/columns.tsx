import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, ClipboardCopy } from "lucide-react"


export type User = {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
  adminNotes: string
  registered: string
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<User>[] = [
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
        Full Name
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
    // Sorting still works using underlying fields
    sortingFn: (a, b) => {
      const nameA = `${a.original.lastName} ${a.original.firstName}`
      const nameB = `${b.original.lastName} ${b.original.firstName}`
      return nameA.localeCompare(nameB)
    },
    size: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    id: "contact",
    header: "Contact",
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
    header: "Email",
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
    header: "Phone",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.original.phoneNumber}
      </span>
    ),
    size: 140,
    minSize: 120,
    maxSize: 200,
  },

  // ADDRESS
  {
    id: "address",
    header: "Address",
    enableResizing: false,
    cell: ({ row }) => {
      const fullAddress = row.original.address
  
      // If no address → show placeholder aligned left, no icon
      if (!fullAddress || fullAddress.trim() === "") {
        return (
          <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground italic">
              No address
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
    size: 240,
    minSize: 200,
    maxSize: 400,
  },

  // ADMIN NOTES (truncated)
  {
    id: "adminNotes",
    header: "Notes",
    enableResizing: false,
    cell: ({ row }) => {
      const notes = row.original.adminNotes
  
      if (!notes || notes.trim() === "") {
        return (
          <div className="flex items-start justify-between w-full">
            <span className="text-muted-foreground italic">
              No notes
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
  },

  // REGISTERED DATE
  {
    accessorKey: "registered",
    header: "Registered",
    cell: ({ row }) => {
      const date = new Date(row.original.registered)
      const formatted = date.toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return <span className="text-sm">{formatted}</span>
    },
  }
  ,

  // CREATED AT
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const formatted = date.toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return <span className="text-sm">{formatted}</span>
    },
    size: 120,
  },

  // UPDATED AT
  {
    accessorKey: "updatedAt",
    header: "Last Updated on",
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt)
      const formatted = date.toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return <span className="text-sm">{formatted}</span>
    },
    size: 120,
  },
]


export const visibleColumns: string[] = [
  "fullName",
  "contact",
  "address",
  "adminNotes",
  "registered",
  "updatedAt",
]
