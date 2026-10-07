import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-[#0F172A]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white">
              H
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              HireFlow
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F8FAFC]">
        <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              A simpler way to manage hiring
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-[#0F172A] sm:text-6xl">
              Keep your hiring
              <br />
              <span className="text-[#4F46E5]">moving forward.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#64748B]">
              Manage open roles, organize candidates, and track every stage of
              your hiring process from one focused workspace.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-[#4F46E5] px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-[#4338CA]"
              >
                Start hiring
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-[#CBD5E1] bg-white px-6 py-3.5 font-semibold text-[#334155] transition hover:border-indigo-300 hover:text-indigo-700"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 border-t border-slate-200 pt-6">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Jobs
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Keep roles organized
                </p>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Candidates
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Track every applicant
                </p>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Pipeline
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Follow each stage
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#0F172A] px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
                  HireFlow workspace
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Hiring overview
                </h2>
              </div>

              <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                4 active jobs
              </span>
            </div>

            <div className="grid gap-3 bg-[#F8FAFC] p-5 sm:grid-cols-3">
              <Stat
                label="Candidates"
                value="128"
                className="border-indigo-100 bg-indigo-50"
                valueClassName="text-indigo-700"
              />

              <Stat
                label="Interviews"
                value="24"
                className="border-violet-100 bg-violet-50"
                valueClassName="text-violet-700"
              />

              <Stat
                label="Hired"
                value="8"
                className="border-emerald-100 bg-emerald-50"
                valueClassName="text-emerald-700"
              />
            </div>

            <div className="px-5 pb-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">
                      Recent candidates
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Latest activity across your jobs
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-indigo-600">
                    View all
                  </span>
                </div>

                <Candidate
                  initials="SJ"
                  name="Sarah Johnson"
                  role="Full Stack Developer"
                  status="Interview"
                />

                <Candidate
                  initials="DL"
                  name="Daniel Lee"
                  role="Product Designer"
                  status="Screening"
                />

                <Candidate
                  initials="AH"
                  name="Amira Hassan"
                  role="Frontend Developer"
                  status="Applied"
                  last
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-indigo-100 bg-[#EEF2FF] py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
              Hiring workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              A clear system for everyday recruiting.
            </h2>

            <p className="mt-4 text-lg leading-8 text-[#64748B]">
              Keep the important parts of your hiring process together without
              adding unnecessary complexity.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              number="01"
              numberClassName="bg-indigo-100 text-indigo-700"
              title="Manage open roles"
              description="Create positions and keep department, location, employment type, and job details organized."
            />

            <FeatureCard
              number="02"
              numberClassName="bg-violet-100 text-violet-700"
              title="Organize candidates"
              description="Connect applicants to the right role and keep their information easy to review."
            />

            <FeatureCard
              number="03"
              numberClassName="bg-emerald-100 text-emerald-700"
              title="Track the pipeline"
              description="Move candidates through applied, screening, interview, offer, and hired."
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
              Built for clarity
            </p>

            <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-[#0F172A]">
              Know what is happening at every stage.
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-lg leading-8 text-[#64748B]">
              HireFlow gives recruiting teams one place to manage jobs,
              candidates, and hiring stages so the next step is always clear.
            </p>

            <Link
              href="/register"
              className="mt-7 inline-flex items-center rounded-xl bg-[#0F172A] px-6 py-3 font-semibold text-white transition hover:bg-[#1E293B]"
            >
              Create your workspace
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-bold">
              H
            </span>

            <span className="font-bold">HireFlow</span>
          </div>

          <p className="text-sm text-slate-400">
            A focused workspace for managing your hiring pipeline.
          </p>
        </div>
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  className: string;
  valueClassName: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${className}`}>
      <p className="text-sm font-medium text-slate-600">{label}</p>

      <p
        className={`mt-2 text-3xl font-bold tracking-tight ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

function Candidate({
  initials,
  name,
  role,
  status,
  last = false,
}: {
  initials: string;
  name: string;
  role: string;
  status: string;
  last?: boolean;
}) {
  const statusClass =
    status === "Interview"
      ? "bg-violet-100 text-violet-700"
      : status === "Screening"
        ? "bg-amber-100 text-amber-700"
        : "bg-indigo-100 text-indigo-700";

  return (
    <div
      className={`flex items-center justify-between px-5 py-4 ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
          {initials}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0F172A]">{name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{role}</p>
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
      >
        {status}
      </span>
    </div>
  );
}

function FeatureCard({
  number,
  numberClassName,
  title,
  description,
}: {
  number: string;
  numberClassName: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${numberClassName}`}
      >
        {number}
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#0F172A]">{title}</h3>

      <p className="mt-3 leading-7 text-[#64748B]">{description}</p>
    </div>
  );
}