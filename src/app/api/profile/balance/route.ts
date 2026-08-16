import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PurchaseSchema } from "@/lib/schema/bundle";
import { decrypt } from "@/lib/server/session";
import { formatZodError } from "@/utils/format-zod-error";

export async function PATCH(request: Request) {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = PurchaseSchema.safeParse(body);

    if (!result.success) {
      console.error("Zod Validation failed:", formatZodError(result.error));
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 },
      );
    }

    const { cost, type, name } = result.data;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: Number(session.userId) },
        select: { balance: true },
      });

      const isCredit = type === "CREDIT";

      if ((user?.balance ?? 0) < cost && !isCredit) {
        throw new Error("Insufficient balance.");
      }

      await tx.user.update({
        where: { id: Number(session.userId) },
        data: {
          balance: { [isCredit ? "increment" : "decrement"]: cost },
        },
      });

      await tx.transaction.create({
        data: {
          type,
          amount: cost,
          userId: Number(session.userId),
          description: isCredit ? "Added funds" : `Redeemed: ${name}`,
        },
      });
    });

    return NextResponse.json({ success: true, message: "Success" });
  } catch (error) {
    console.error("Error updating profile balance:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
