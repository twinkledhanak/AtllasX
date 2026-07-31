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

import { useState, useEffect } from "react"

export default function UserForm({
  open,
  onOpenChange,
  initialData = null,
  onSubmit,
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Pre-fill fields when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setEmail(initialData.email || "")
    }
  }, [initialData])

  const handleSubmit = () => {
    onSubmit({ name, email })
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
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
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {initialData ? "Save Changes" : "Add User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
