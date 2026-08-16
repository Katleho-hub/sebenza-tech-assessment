import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/server/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: Number(session.userId),
      },
    });

    return NextResponse.json({
      success: true,
      transactions,
      message: "Success",
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
