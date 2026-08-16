"use client";

import { LoginSchema } from "@/lib/schema/auth";
import { type SubmitEvent, useEffect, useRef, useState } from "react";

import { formatZodError } from "@/utils/format-zod-error";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = LoginSchema.safeParse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (!result.success) {
      console.error("Zod Validation failed:", formatZodError(result.error));
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch("/api/auth/login", {
        signal: controller.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(
          data?.message || "Something went wrong, please try again.",
        );
        return;
      }

      router.refresh();
      router.replace("/");
    } catch (error: unknown) {
      // Maybe handle abort
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="input validator"
          placeholder="Email"
          required
        />
        <p className="validator-hint hidden">Must be a valid email address</p>

        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          className="input validator"
          placeholder="Password"
          minLength={6}
          required
        />
        <p className="validator-hint hidden">
          Must be at least 6 characters long
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-neutral mt-4"
        >
          {isLoading && <span className="loading loading-spinner" />}
          Login
        </button>
      </fieldset>
      {submitError && <p className="text-error">{submitError}</p>}
    </form>
  );
}
