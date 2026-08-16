"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Bundle = {
  id: string;
  name: string;
  cost: number;
};

export function Bundles({ userBalance }: { userBalance: number }) {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddFundsChecked, setIsAddFundsChecked] = useState(false);

  console.log("isLoading", isLoading);

  useEffect(() => {
    fetch("/api/bundles")
      .then((res) => res.json())
      .then((data) => {
        setBundles(data);
      });
  }, []);

  async function handleBuy(bundle: Bundle) {
    setSubmitError(null);
    setIsLoading(true);

    if (userBalance < bundle.cost && !isAddFundsChecked) {
      setSubmitError("Insufficient balance to redeem this bundle.");
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response1 = await fetch("/api/redeem", {
        signal: controller.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bundleId: bundle.id,
        }),
      });

      const data2 = await response1.json();
      console.log("data2", data2);

      if (!response1.ok) {
        setSubmitError(
          data2?.error || "Something went wrong, please try again.",
        );
        return;
      }

      const response = await fetch("/api/profile/balance", {
        signal: controller.signal,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bundle,
          type: isAddFundsChecked ? "CREDIT" : "DEBIT",
        }),
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
    <div className="flex flex-col gap-4">
      <span className="text-2xl font-bold">Available Wifi Bundles</span>
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
        <label className="label">
          <input
            type="checkbox"
            checked={isAddFundsChecked}
            onChange={(e) => setIsAddFundsChecked(e.target.checked)}
            value={"true"}
            className="checkbox checkbox-accent"
          />
          Add funds to your account balance by purchasing bundles.
        </label>
      </fieldset>
      <div className="stats bg-base-100 border-base-300 border">
        {bundles.map((bundle) => {
          const canBuy = userBalance >= bundle.cost;
          return (
            <div key={bundle.id} className="stat">
              <div className="stat-title">{bundle.name}</div>
              <div className="stat-value">{bundle.cost} SB</div>
              <div className="stat-actions">
                <button
                  className={`btn btn-md  ${!isAddFundsChecked ? "btn-secondary" : "btn-accent"}`}
                  disabled={(!canBuy && !isAddFundsChecked) || isLoading}
                  onClick={() => handleBuy(bundle)}
                >
                  {isAddFundsChecked ? "Add funds" : "Redeem"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {submitError && <p className="text-error">{submitError}</p>}
    </div>
  );
}
