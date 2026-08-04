import { useEffect, useState } from "react";

export function populateUsers({ page, pageSize, search, sorting}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const sort = sorting[0]?.id || "firstName";
  const direction = sorting[0]?.desc ? "desc" : "asc";


  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await fetch(
          `http://localhost:50000/users?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search || "")}&sort=${sort}&direction=${direction}`
        );

        const json = await res.json();

        setData(json.data || []);
        setTotal(json.total || 0);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, pageSize, search, sorting]); // Fix for desc button toggle not working

  return { data, total, loading };
}
