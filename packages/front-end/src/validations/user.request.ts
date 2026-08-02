import { z } from "zod"

export const UserBaseRequest = z.object({
  firstName: z.string().min(1, "First Name is required").trim(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required").trim(),
  email: z.email("Invalid email format").trim(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  adminNotes: z.string().optional(),
  // Removing all Date() fields here, Express to handle all timestamps.
  // Different client browsers can have different timestamps and zones.
})
