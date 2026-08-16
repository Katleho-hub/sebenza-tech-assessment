"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.replace("/login");
    } else {
      console.error("Logout failed");
    }
  }

  return (
    <button type="submit" onClick={handleLogout} className="btn btn-neutral">
      Logout
    </button>
  );
}
