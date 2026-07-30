import { useEffect, useState } from "react";

export function populateUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:50000/users");
        const json = await res.json();
        setUsers(json.data || []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { users, loading };
}
