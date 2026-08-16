import type { Route } from "next";
import Link from "next/link";

export function OrDivider({ label, href }: { label: string; href: Route }) {
  return (
    <div className="w-xs">
      <div className="divider">OR</div>
      <Link className="link w-fit" href={href}>
        {label}
      </Link>
    </div>
  );
}
