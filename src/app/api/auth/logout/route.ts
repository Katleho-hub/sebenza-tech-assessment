import { deleteSession } from "@/lib/server/session";
import { NextResponse } from "next/server";

export async function POST() {
  await deleteSession();
  return NextResponse.json({
    success: true,
    message: "User logged out successfully.",
  });
}
