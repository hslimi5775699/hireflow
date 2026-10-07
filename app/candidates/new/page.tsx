"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Job = {
  id: number;
  title: string;
};

export default function NewCandidatePage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobId, setJobId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          setError("Unable to load jobs.");
          return;
        }

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch {
        setError("Unable to load jobs.");
      } finally {
        setLoadingJobs(false);
      }
    }

    loadJobs();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to add candidate.");
        return;
      }

      router.push("/candidates");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Topbar */}
      <header className="border-b border-white/10 bg-[#0F172A]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white">
              H
            </span>

            <span className="text-xl font-bold tracking-tight text-white">
              HireFlow
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/jobs"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Jobs
            </Link>

            <Link
              href="/candidates"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white"
            >
              Candidates
            </Link>
          </nav>
        </div>
      </header>

      {/* Page */}
      <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          <span>←</span>
          Back to candidates
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Card heading */}
          <div className="border-b border-slate-100 px-7 py-6 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                +
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Add candidate
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Add a candidate and assign them to one of your open
                  positions.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 px-7 py-7 sm:px-8"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jordan Smith"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jordan@example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="job"
                className="block text-sm font-semibold text-slate-700"
              >
                Position
              </label>

              <select
                id="job"
                required
                value={jobId}
                onChange={(event) => setJobId(event.target.value)}
                disabled={loadingJobs}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {loadingJobs ? "Loading jobs..." : "Select a job"}
                </option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-slate-500">
                The candidate will be added to the selected position.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {!loadingJobs && jobs.length === 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="text-sm text-amber-800">
                  You need to create a job before adding a candidate.{" "}
                  <Link
                    href="/jobs/new"
                    className="font-bold text-amber-900 underline underline-offset-2"
                  >
                    Create a job
                  </Link>
                </p>
              </div>
            )}

            <div className="border-t border-slate-100 pt-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/candidates"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading || loadingJobs || jobs.length === 0}
                  className="rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Adding candidate..." : "Add candidate"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}