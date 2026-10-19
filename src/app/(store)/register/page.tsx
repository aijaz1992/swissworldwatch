import { RegisterForm } from "@/components/store/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Register" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold">Register</h1>
      <p className="mt-2 text-sm text-neutral-600">Customer accounts can place orders. They cannot edit the catalog.</p>
      <div className="mt-6 border border-neutral-200 p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
