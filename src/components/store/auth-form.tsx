"use client";

import { loginAction, registerAction, type FormState } from "@/actions/store";
import { SubmitButton } from "@/components/store/submit-button";
import Link from "next/link";
import { useActionState } from "react";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && <p role="alert" className="text-sm text-sale">{state.error}</p>}
      <label className="block text-sm">
        Email
        <input className="input mt-1" type="email" name="email" autoComplete="email" required />
      </label>
      <label className="block text-sm">
        Password
        <input className="input mt-1" type="password" name="password" autoComplete="current-password" required />
      </label>
      <SubmitButton className="btn-sky w-full py-2.5" pendingLabel="Signing in…">
        Login
      </SubmitButton>
      <p className="text-sm text-neutral-600">
        New here? <Link href="/register" className="text-sky">Create an account</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState<FormState, FormData>(registerAction, {});
  return (
    <form action={action} className="space-y-4">
      {state.error && <p role="alert" className="text-sm text-sale">{state.error}</p>}
      <label className="block text-sm">
        Name
        <input className="input mt-1" name="name" autoComplete="name" required />
      </label>
      <label className="block text-sm">
        Email
        <input className="input mt-1" type="email" name="email" autoComplete="email" required />
      </label>
      <label className="block text-sm">
        Password
        <input className="input mt-1" type="password" name="password" autoComplete="new-password" minLength={8} required />
      </label>
      <SubmitButton className="btn-sky w-full py-2.5" pendingLabel="Creating account…">
        Register
      </SubmitButton>
      <p className="text-sm text-neutral-600">
        Already registered? <Link href="/login" className="text-sky">Login</Link>
      </p>
    </form>
  );
}
