"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
];

type CandidateStatusProps = {
  candidateId: number;
  currentStatus: string;
};

export default function CandidateStatus({
  candidateId,
  currentStatus,
}: CandidateStatusProps) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = event.target.value;
    const previousStatus = status;

    setStatus(newStatus);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(previousStatus);
        setError(data.error || "Unable to update status.");
        return;
      }

      router.refresh();
    } catch {
      setStatus(previousStatus);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}