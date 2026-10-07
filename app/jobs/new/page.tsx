"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Unable to create job.");
      return;
    }

    router.push("/jobs");
    router.refresh();
  } catch {
    alert("Something went wrong. Please try again.");
  }
};
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.push("/jobs")}
          className="mb-6 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to jobs
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Create New Job
          </h1>

          <p className="mt-2 text-slate-500">
            Add a new position to HireFlow.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Job title
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Senior Software Developer"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Department
              </label>

              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="Engineering"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Location
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Calgary, AB"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Employment type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Job description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe the role, responsibilities and requirements..."
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/jobs")}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Create Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}