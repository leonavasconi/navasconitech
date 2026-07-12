import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm redirectTo="/financas/dashboard" signupHref="/financas/signup" />
    </Suspense>
  );
}
