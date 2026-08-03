import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import Avatar from "./Avatar.jsx";
import { SkeletonRow } from "./Skeleton.jsx";
import EmptyState from "./EmptyState.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const controller = new AbortController();

    setLoading(true);
    axios
      .get(`${API_BASE_URL}/user/bulk?filter=${encodeURIComponent(filter)}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then((res) => setUsers(res.data.users))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [filter]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or username"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full rounded-lg border border-ink/15 bg-white/60 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
      />

      <div className="mt-4 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white/40">
        {loading && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}
        {!loading && users.length === 0 && (
          <EmptyState
            title="No one matches that search"
            hint="Try a first name, last name, or exact username."
          />
        )}
        {!loading &&
          users.map((u) => (
            <button
              key={u._id}
              onClick={() => navigate(`/send?id=${u._id}&name=${encodeURIComponent(u.firstName)}`)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-gold/10"
            >
              <div className="flex items-center gap-3">
                <Avatar name={`${u.firstName} ${u.lastName}`} />
                <div>
                  <p className="font-sans text-sm font-medium text-ink">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="font-mono text-xs text-ink/40">@{u.username}</p>
                </div>
              </div>
              <span className="font-sans text-sm font-medium text-moss">Send →</span>
            </button>
          ))}
      </div>
    </div>
  );
}
