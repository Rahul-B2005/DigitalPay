import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";

export default function useAccount() {
  const [firstName, setFirstName] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);
    Promise.allSettled([
      axios.get(`${API_BASE_URL}/account/balance`, { headers }),
      axios.get(`${API_BASE_URL}/user/me`, { headers }),
    ]).then(([balanceRes, meRes]) => {
      if (balanceRes.status === "fulfilled") setBalance(balanceRes.value.data.balance);
      if (meRes.status === "fulfilled") setFirstName(meRes.value.data.user.firstName);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { firstName, balance, loading, refetch };
}
