import Head from "next/head";
import clsx from "clsx";
import { Inter } from "@next/font/google";

import { usePopulateUsers } from "@/hooks/populateUsers";
import { useDetectDevice } from "@/hooks/detectDevice";

import { UserCard } from "@/components/UserCard";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // Local state for pagination + search
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [sorting, setSorting] = useState([{ id: "firstName", desc: false }]);

  // Fetch only the current page from backend
  const { data, total, loading } = usePopulateUsers({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search: searchQuery,
    sorting
  });

  const isMobile = useDetectDevice();

  return (
    <>
      <Head>
        <title>Atllas Takehome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={clsx("w-full min-h-screen p-4", inter.className)}>
        <h1 className="border-b border-neutral-300 px-4 py-2 text-2xl font-medium text-center">
          User Management
        </h1>

        {loading && (
          <p className="text-neutral-500 p-4 text-center">Loading users...</p>
        )}

        {!loading && (
          <>
            {isMobile ? (
              <div className="space-y-4 mt-4">
                {data.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <DataTable
                  columns={columns}
                  data={data}
                  total={total}
                  pagination={pagination}
                  setPagination={setPagination}
                  localSearch={localSearch}
                  setSearchQuery={setSearchQuery}
                  setLocalSearch={setLocalSearch}
                  sorting={sorting}
                  setSorting={setSorting}
                />
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
