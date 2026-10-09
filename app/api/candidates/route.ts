
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";
import { verifySessionToken } from "../../../lib/session";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hireflow_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);

    if (!session || typeof session.userId !== "number") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const jobId = Number(body.jobId);

    if (!name || !email || !Number.isInteger(jobId)) {
      return NextResponse.json(
        { error: "Name, email and job are required." },
        { status: 400 }
      );
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        userId: session.userId,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        status: "Applied",
        jobId: job.id,
      },
    });

    return NextResponse.json(
      {
        message: "Candidate added successfully.",
        candidate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_CANDIDATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
