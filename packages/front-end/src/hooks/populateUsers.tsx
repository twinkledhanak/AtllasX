import { useEffect, useState } from "react";

export function populateUsers({ page, pageSize, search }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await fetch(
          `http://localhost:50000/users?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search || "")}`
        );

        const json = await res.json();

        setData(json.data || []);
        setTotal(json.total || 0);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, pageSize, search]);

  return { data, total, loading };
}
