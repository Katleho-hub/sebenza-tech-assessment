import type { Route } from "next";

export const protectedRoutes = [
  "/",
  "/transactions",
] as const satisfies readonly Route[];

export const authRoutes = [
  "/login",
  "/register",
] as const satisfies readonly Route[];
