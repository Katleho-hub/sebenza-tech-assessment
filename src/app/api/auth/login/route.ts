import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/schema/auth";
import { createSession } from "@/lib/server/session";
import { formatZodError } from "@/utils/format-zod-error";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      console.error("Zod Validation failed:", formatZodError(result.error));
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 },
      );
    }

    const { email, password } = result.data;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const match = await bcrypt.compare(password, existingUser?.password || "");

    if (!existingUser || !match) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    await createSession(existingUser.id);

    return NextResponse.json(
      { success: true, message: "User logged in successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during user login:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
