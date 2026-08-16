"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authRoutes } from "@/app/constants/routes";

export function OrDivider() {
  const pathname = usePathname();
  const isAuthRoute = (authRoutes as readonly string[]).includes(pathname);

  if (!isAuthRoute) {
    return null;
  }

  const isLoginPage = pathname === "/login";

  return (
    <div className="w-xs">
      <div className="divider">OR</div>
      <Link className="link w-fit" href={isLoginPage ? "/register" : "/login"}>
        {isLoginPage ? "Register" : "Login"}
      </Link>
    </div>
  );
}
