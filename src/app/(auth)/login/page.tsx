import { OrDivider } from "@/app/(auth)/components/or-divider";
import { LoginForm } from "@/app/(auth)/login/components/login-form";

export default function Page() {
  return (
    <>
      <LoginForm />
      <OrDivider label="Register" href="/register" />
    </>
  );
}
