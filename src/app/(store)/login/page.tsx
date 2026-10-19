import { LoginForm } from "@/components/store/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(user.role === "ADMIN" && next?.startsWith("/admin") ? next : "/account");

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mt-2 text-sm text-neutral-600">Use your account to track orders. Admins land in the dashboard.</p>
      <div className="mt-6 border border-neutral-200 p-6">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
