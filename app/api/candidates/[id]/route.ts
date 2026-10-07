import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "../../../../generated/prisma/client";
import { verifySessionToken } from "../../../../lib/session";

const prisma = new PrismaClient();

const allowedStatuses = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const candidateId = Number(id);

    if (!Number.isInteger(candidateId)) {
      return NextResponse.json(
        { error: "Invalid candidate." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = body.status;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid candidate status." },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        job: {
          userId: session.userId,
        },
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found." },
        { status: 404 }
      );
    }

    const updatedCandidate = await prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(
      {
        message: "Candidate status updated.",
        candidate: updatedCandidate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_CANDIDATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}