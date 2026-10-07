import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "../../../generated/prisma/client";
import { verifySessionToken } from "../../../lib/session";

const prisma = new PrismaClient();

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

    const title = body.title?.trim();
    const department = body.department?.trim();
    const location = body.location?.trim();
    const type = body.type?.trim();
    const description = body.description?.trim();

    if (
      !title ||
      !department ||
      !location ||
      !type ||
      !description
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        department,
        location,
        type,
        description,
        status: "Active",
        userId: session.userId,
      },
    });

    return NextResponse.json(
      {
        message: "Job created successfully.",
        job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_JOB_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const jobs = await prisma.job.findMany({
      where: {
        userId: session.userId,
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { jobs },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_JOBS_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}