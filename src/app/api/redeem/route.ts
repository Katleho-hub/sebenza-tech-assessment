import { type NextRequest, NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  const { bundleId } = await request.json();
  // Simulate network delay
  await delay(1500);
  // Approximately 80% success rate
  const success = Math.random() < 0.8;
  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message:
          "The WiFi provider was unable to process your request. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
  return NextResponse.json({
    success: true,
    bundleId,
    message: "Bundle redeemed successfully.",
  });
}
