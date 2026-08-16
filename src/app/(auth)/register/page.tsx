import { OrDivider } from "@/app/(auth)/components/or-divider";
import { RegistrationForm } from "./components/registration-form";

export default function Page() {
  return (
    <>
      <RegistrationForm />
      <OrDivider label="Login" href="/login" />
    </>
  );
}
