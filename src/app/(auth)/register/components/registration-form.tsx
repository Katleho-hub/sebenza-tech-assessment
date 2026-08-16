"use client";

import { RegisterSchema } from "@/lib/schema/auth";
import { formatZodError } from "@/utils/format-zod-error";
import { type SubmitEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function RegistrationForm() {
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null,
  );

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
    setPasswordMatchError(null);

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData(form);
    const passwordInput = formData.get("password");
    const confirmInput = formData.get("confirmPassword");

    if (passwordInput !== confirmInput) {
      setPasswordMatchError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const result = RegisterSchema.safeParse({
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: passwordInput as string,
    });

    if (!result.success) {
      console.error("Zod Validation failed:", formatZodError(result.error));
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch("/api/auth/register", {
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
          data?.error || "Something went wrong, please try again.",
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
        <legend className="fieldset-legend">Register</legend>

        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          className="input validator"
          placeholder="Username"
          pattern="[A-Za-z][A-Za-z0-9\-]*"
          minLength={3}
          maxLength={30}
          required
        />
        <p className="validator-hint hidden">
          Must be 3 to 30 characters
          <br />
          containing only letters, numbers or dash
        </p>

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
          minLength={8}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          required
        />
        <p className="validator-hint hidden">
          Must be more than 8 characters, including
          <br />
          At least one number <br />
          At least one lowercase letter <br />
          At least one uppercase letter
        </p>

        <label htmlFor="confirmPassword" className="label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          className={`input validator ${passwordMatchError ? "input-error" : ""}`}
          placeholder="Confirm Password"
          minLength={8}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          required
        />
        <p
          className={`${passwordMatchError ? "text-error" : "hidden validator-hint"}`}
        >
          {passwordMatchError ? (
            passwordMatchError
          ) : (
            <>
              Must be more than 8 characters, including
              <br />
              At least one number <br />
              At least one lowercase letter <br />
              At least one uppercase letter
            </>
          )}
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-neutral mt-4"
        >
          {isLoading && <span className="loading loading-spinner" />}
          Register
        </button>
      </fieldset>
      {submitError && <p className="text-error">{submitError}</p>}
    </form>
  );
}
