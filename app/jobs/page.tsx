import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../generated/prisma/client";
import { verifySessionToken } from "../../lib/session";

const prisma = new PrismaClient();

export default async function JobsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hireflow_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await verifySessionToken(token);

  if (!session || typeof session.userId !== "number") {
    redirect("/login");
  }

  const jobs = await prisma.job.findMany({
    where: {
      userId: session.userId,
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
  });

  const activeJobs = jobs.filter((job) => job.status === "Active");

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Topbar */}
      <header className="border-b border-white/10 bg-[#0F172A]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
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
              href="/candidates"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Candidates
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Page heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
              Recruiting
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Jobs
            </h1>

            <p className="mt-2 max-w-xl text-slate-500">
              Create positions and keep track of the roles you are currently
              hiring for.
            </p>
          </div>

          <Link
            href="/jobs/new"
            className="rounded-xl bg-[#4F46E5] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA]"
          >
            + Create job
          </Link>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <p className="text-sm font-semibold text-indigo-700">
              Total jobs
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {jobs.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Positions in your workspace
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-700">
              Active jobs
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {activeJobs.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Currently accepting candidates
            </p>
          </div>
        </div>

        {/* Empty state */}
        {jobs.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-indigo-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
              +
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No jobs yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first position to start adding candidates and
              managing your hiring process.
            </p>

            <Link
              href="/jobs/new"
              className="mt-6 inline-block rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
              Create your first job
            </Link>
          </div>
        )}

        {/* Jobs list */}
        {jobs.length > 0 && (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Your positions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                All positions created in your workspace.
              </p>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {job.title}
                        </h3>

                        <span
                          className={
                            job.status === "Active"
                              ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                              : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                          }
                        >
                          {job.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                          {job.department}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {job.location}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {job.type}
                        </span>
                      </div>

                      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                        {job.description.length > 180
                          ? `${job.description.slice(0, 180)}...`
                          : job.description}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 lg:text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        {job._count.candidates}
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {job._count.candidates === 1
                          ? "Candidate"
                          : "Candidates"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}