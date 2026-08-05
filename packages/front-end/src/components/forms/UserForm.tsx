"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { useState, useEffect, forwardRef } from "react"
import { UserBaseRequest } from "@/validations/user.request"

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  onSubmit: (data: any) => void
}

const UserForm = forwardRef<HTMLDivElement, UserFormProps>(function UserForm(
  { open, onOpenChange, initialData = null, onSubmit },
  ref
) {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  // Pre-fill fields when editing
  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || "")
      setMiddleName(initialData.middleName || "")
      setLastName(initialData.lastName || "")
      setEmail(initialData.email || "")
      setPhoneNumber(initialData.phoneNumber || "")
      setAddress(initialData.address || "")
      setAdminNotes(initialData.adminNotes || "")
    }
  }, [initialData])

  const handleSubmit = () => {
    const result = UserBaseRequest.safeParse({
      firstName,
      middleName: middleName || "",
      lastName,
      email,
      phoneNumber: phoneNumber || "",
      address: address || "",
      adminNotes: adminNotes || "",
      // timestamps handled by backend
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    onSubmit(result.data)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent ref={ref}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialData ? "Edit User" : "Add User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialData
              ? "Update the user details below."
              : "Fill in the details to create a new user."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 mt-4">

          {/* FIRST NAME */}
          <input
            type="text"
            placeholder="First Name *"
            className="w-full border rounded p-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm">{errors.firstName[0]}</p>
          )}

          {/* MIDDLE NAME */}
          <input
            type="text"
            placeholder="Middle Name"
            className="w-full border rounded p-2"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
          {errors.middleName && (
            <p className="text-red-600 text-sm">{errors.middleName[0]}</p>
          )}

          {/* LAST NAME */}
          <input
            type="text"
            placeholder="Last Name *"
            className="w-full border rounded p-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm">{errors.lastName[0]}</p>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email *"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email[0]}</p>
          )}

          {/* PHONE NUMBER */}
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border rounded p-2"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-sm">{errors.phoneNumber[0]}</p>
          )}

          {/* ADDRESS */}
          <input
            type="text"
            placeholder="Address"
            className="w-full border rounded p-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && (
            <p className="text-red-600 text-sm">{errors.address[0]}</p>
          )}

          {/* ADMIN NOTES */}
          <input
            type="text"
            placeholder="Admin Notes"
            className="w-full border rounded p-2"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
          {errors.adminNotes && (
            <p className="text-red-600 text-sm">{errors.adminNotes[0]}</p>
          )}

        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
          render={
            <button className="px-4 py-2 rounded border">Cancel</button>
          }/>

        <AlertDialogAction
        render={
          <button
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
            onClick={handleSubmit}
          >
          {initialData ? "Save Changes" : "Add User"}
          </button>}/>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
})

export default UserForm
