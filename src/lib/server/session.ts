// https://nextjs.org/docs/app/guides/authentication
import "server-only";
import type { User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not configured");
}

const secret = new TextEncoder().encode(sessionSecret);
const alg = "HS256";
const sevenDaysInMilliSeconds = 7 * 24 * 60 * 60 * 1000;

type Payload = {
  userId: User["id"];
};

export async function encrypt(payload: Payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: [alg],
    });
    console.log("Session payload:", payload);
    return payload;
  } catch (error) {
    console.error("Failed to verify session", error);
    return null;
  }
}

export async function createSession(userId: User["id"]) {
  const expiresAt = new Date(Date.now() + sevenDaysInMilliSeconds);
  const session = await encrypt({ userId });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
