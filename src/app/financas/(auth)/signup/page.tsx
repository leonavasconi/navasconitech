import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return <SignupForm redirectTo="/financas/dashboard" loginHref="/financas/login" />;
}
