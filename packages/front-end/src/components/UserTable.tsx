"use client";

import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/data-table/columns"

export default async function UserTable({ users }) {

  return <DataTable columns={columns} data={users} />
}
