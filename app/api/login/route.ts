import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../../../generated/prisma/client";
import { createSessionToken } from "../../../lib/session";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordIsCorrect = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordIsCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user.id);

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("hireflow_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}