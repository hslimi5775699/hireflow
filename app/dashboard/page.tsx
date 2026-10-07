import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "../../generated/prisma/client";
import LogoutButton from "./LogoutButton";
import { verifySessionToken } from "../../lib/session";

const prisma = new PrismaClient();

const pipelineStages = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
] as const;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hireflow_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await verifySessionToken(token);

  if (!session || typeof session.userId !== "number") {
    redirect("/login");
  }

  const userId = session.userId;

  const [user, jobs, candidates] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    }),

    prisma.job.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            candidates: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.candidate.findMany({
      where: {
        job: {
          userId,
        },
      },
      include: {
        job: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const activeJobs = jobs.filter((job) => job.status === "Active");

  const hiredCandidates = candidates.filter(
    (candidate) => candidate.status === "Hired"
  );

  const interviewCandidates = candidates.filter(
    (candidate) => candidate.status === "Interview"
  );

  const stats = [
    {
      title: "Active Jobs",
      value: activeJobs.length,
      detail:
        activeJobs.length === 1 ? "Open position" : "Open positions",
      cardStyle: "border-indigo-100 bg-indigo-50",
      titleStyle: "text-indigo-700",
    },
    {
      title: "Candidates",
      value: candidates.length,
      detail:
        candidates.length === 1
          ? "Candidate in your pipeline"
          : "Candidates in your pipeline",
      cardStyle: "border-blue-100 bg-blue-50",
      titleStyle: "text-blue-700",
    },
    {
      title: "Interviews",
      value: interviewCandidates.length,
      detail: "Currently interviewing",
      cardStyle: "border-violet-100 bg-violet-50",
      titleStyle: "text-violet-700",
    },
    {
      title: "Hired",
      value: hiredCandidates.length,
      detail: "Successful hires",
      cardStyle: "border-emerald-100 bg-emerald-50",
      titleStyle: "text-emerald-700",
    },
  ];

  const pipeline = pipelineStages.map((stage) => ({
    stage,
    count: candidates.filter(
      (candidate) => candidate.status === stage
    ).length,
  }));

  const maxPipelineCount = Math.max(
    ...pipeline.map((item) => item.count),
    1
  );

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  function getStatusStyle(status: string) {
    if (status === "Hired") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Offer") {
      return "bg-cyan-100 text-cyan-700";
    }

    if (status === "Interview") {
      return "bg-violet-100 text-violet-700";
    }

    if (status === "Screening") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-indigo-100 text-indigo-700";
  }

  function getPipelineColor(stage: string) {
    if (stage === "Hired") {
      return "bg-emerald-500";
    }

    if (stage === "Offer") {
      return "bg-cyan-500";
    }

    if (stage === "Interview") {
      return "bg-violet-500";
    }

    if (stage === "Screening") {
      return "bg-amber-500";
    }

    return "bg-indigo-500";
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-indigo-100 bg-[#F5F7FF] md:flex">
          <div className="border-b border-indigo-100 px-6 py-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white shadow-sm">
                H
              </span>

              <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                HireFlow
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            <Link
              href="/dashboard"
              className="block rounded-xl bg-[#4F46E5] px-4 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Dashboard
            </Link>

            <Link
              href="/jobs"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700"
            >
              Jobs
            </Link>

            <Link
              href="/candidates"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700"
            >
              Candidates
            </Link>
          </nav>

          <div className="border-t border-indigo-100 p-4">
            <div className="mb-3 rounded-xl border border-indigo-100 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Workspace
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                HireFlow
              </p>
            </div>

            <LogoutButton />
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Dark Topbar */}
          <header className="flex items-center justify-between border-b border-white/10 bg-[#0F172A] px-6 py-5 text-white lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-300">
                Hiring workspace
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Welcome back, {user.name}. Here&apos;s your hiring overview.
              </p>
            </div>

            <div
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-bold text-white shadow-sm"
              title={user.name}
            >
              {initials || "HF"}
            </div>
          </header>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Hiring at a glance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Live information from your jobs and candidates.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/candidates/new"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
                >
                  Add candidate
                </Link>

                <Link
                  href="/jobs/new"
                  className="rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA]"
                >
                  Create job
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className={`rounded-2xl border p-6 ${stat.cardStyle}`}
                >
                  <p
                    className={`text-sm font-semibold ${stat.titleStyle}`}
                  >
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Candidates */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent candidates
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest candidates added to your open positions.
                  </p>
                </div>

                <Link
                  href="/candidates"
                  className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  View all
                </Link>
              </div>

              {candidates.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="font-semibold text-slate-900">
                    No candidates yet
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Add your first candidate to start building your hiring
                    pipeline.
                  </p>

                  <Link
                    href="/candidates/new"
                    className="mt-5 inline-block rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
                  >
                    Add candidate
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">
                          Candidate
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Position
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {candidates.slice(0, 5).map((candidate) => (
                        <tr
                          key={candidate.id}
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">
                              {candidate.name}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {candidate.email}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {candidate.job.title}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                candidate.status
                              )}`}
                            >
                              {candidate.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Hiring Pipeline */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
                    Pipeline
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Hiring pipeline
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Candidate distribution across hiring stages.
                  </p>
                </div>

                {candidates.length === 0 ? (
                  <p className="mt-8 text-sm text-slate-500">
                    Pipeline data will appear after candidates are added.
                  </p>
                ) : (
                  <div className="mt-7 space-y-5">
                    {pipeline.map((item) => (
                      <div key={item.stage}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {item.stage}
                          </span>

                          <span className="font-bold text-slate-900">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${getPipelineColor(
                              item.stage
                            )}`}
                            style={{
                              width: `${
                                item.count === 0
                                  ? 0
                                  : Math.max(
                                      (item.count / maxPipelineCount) * 100,
                                      8
                                    )
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Open Positions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
                      Recruiting
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Open positions
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Jobs currently accepting candidates.
                    </p>
                  </div>

                  <Link
                    href="/jobs"
                    className="shrink-0 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                  >
                    View jobs
                  </Link>
                </div>

                {activeJobs.length === 0 ? (
                  <div className="mt-8">
                    <p className="text-sm text-slate-500">
                      You don&apos;t have any active positions.
                    </p>

                    <Link
                      href="/jobs/new"
                      className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline"
                    >
                      Create a job
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {activeJobs.slice(0, 4).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {job.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {job._count.candidates}{" "}
                            {job._count.candidates === 1
                              ? "candidate"
                              : "candidates"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}