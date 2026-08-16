"use client";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-neutral max-w-28"
      onClick={() => router.back()}
    >
      Back
    </button>
  );
}
