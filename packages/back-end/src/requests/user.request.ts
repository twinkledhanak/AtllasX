import { z } from 'zod';

/** 
 * This file defines the request object shape/params for User routes.
 * We have one common UserBaseRequest object but different validations for each type of request.
 * 
 */

// Base object for all User requests
// @TODO: Add validations and trim() for all fields as needed
const UserBaseRequest = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.email('valid email is required'),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    adminNotes: z.string().default(''),
    registered: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  });

// Create User — all fields required, exactly as base
export const CreateUserRequest = UserBaseRequest;

// UPDATE — same fields, but all optional
export const UpdateUserRequest = UserBaseRequest.partial();


export type CreateUserInput = z.infer<typeof CreateUserRequest>;
export type UpdateUserInput = z.infer<typeof UpdateUserRequest>;

/*
{
    "id": 1,
    "registered": "2026-03-21T13:19:47.444Z",
    "firstName": "Christy",
    "middleName": "Naomi", - Optional
    "lastName": "Mayer",
    "email": "74tkcw_ayu836@gmail.com",
    "phoneNumber": null,
    "address": null,
    "adminNotes": "Eveniet accusamus tenetur a.",
    "createdAt": "2026-07-30T00:41:08.161Z",
    "updatedAt": "2026-07-30T00:41:08.161Z"
  }

curl -X POST http://127.0.0.1:50000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Twinkle",
    "middleName": "Kishor",
    "lastName": "Dhanak",
    "email": "twinkle@gmail.com",
    "phoneNumber": "+1 (555) 123-4567",
    "address": "123 Main St, San Francisco, CA, 94102",
    "adminNotes": "Test user from curl",
    "registered": "2026-03-21T13:19:47.444Z",
    "createdAt": "2026-07-30T00:41:08.161Z",
    "updatedAt": "2026-07-30T00:41:08.161Z"
  }'


  */