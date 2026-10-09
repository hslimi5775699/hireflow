
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { verifySessionToken } from "../../lib/session";
import CandidateStatus from "./CandidateStatus";

export default async function CandidatesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hireflow_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await verifySessionToken(token);

  if (!session || typeof session.userId !== "number") {
    redirect("/login");
  }

  const candidates = await prisma.candidate.findMany({
    where: {
      job: {
        userId: session.userId,
      },
    },
    include: {
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const interviewCount = candidates.filter(
    (candidate) => candidate.status === "Interview"
  ).length;

  const hiredCount = candidates.filter(
    (candidate) => candidate.status === "Hired"
  ).length;

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
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
              Talent pipeline
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Candidates
            </h1>

            <p className="mt-2 max-w-xl text-slate-500">
              Review candidates and keep each person moving through the hiring
              process.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              View jobs
            </Link>

            <Link
              href="/candidates/new"
              className="rounded-xl bg-[#4F46E5] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA]"
            >
              + Add candidate
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <p className="text-sm font-semibold text-indigo-700">
              Total candidates
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {candidates.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Across all positions
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
            <p className="text-sm font-semibold text-violet-700">
              Interviews
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {interviewCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Currently interviewing
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-700">
              Hired
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {hiredCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Successful hires
            </p>
          </div>
        </div>

        {/* Candidates */}
        {candidates.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-indigo-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-700">
              +
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No candidates yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first candidate to one of your open positions and start
              tracking their hiring progress.
            </p>

            <Link
              href="/candidates/new"
              className="mt-6 inline-block rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
              Add your first candidate
            </Link>
          </div>
        ) : (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Candidate list
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update a candidate&apos;s status as they move through the
                hiring process.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-sm text-slate-500">
                      <th className="px-6 py-4 font-semibold">
                        Candidate
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Position
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Status
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Added
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {candidates.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold uppercase text-indigo-700">
                              {candidate.name.charAt(0)}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {candidate.name}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {candidate.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                            {candidate.job.title}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <CandidateStatus
                            candidateId={candidate.id}
                            currentStatus={candidate.status}
                          />
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {candidate.createdAt.toLocaleDateString("en-CA")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
