import { z } from "zod"

export const UserBaseRequest = z.object({
  fullName: z.string().min(1, "Full Name is required").trim(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required").trim(),
  email: z.email("Invalid email format").trim(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  registeredAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
