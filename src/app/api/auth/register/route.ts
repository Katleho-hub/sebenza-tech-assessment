import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/lib/schema/auth";
import { createSession } from "@/lib/server/session";
import { formatZodError } from "@/utils/format-zod-error";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
      console.error("Zod Validation failed:", formatZodError(result.error));
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 },
      );
    }

    const { email, password, username } = result.data;

    // What happens if two users try to register with the same email at the same time?
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    await createSession(user.id);

    return NextResponse.json(
      { success: true, message: "User registered successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}
