"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignUpButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="h-15 px-15 bg-accent text-white text-lg font-bold hover:bg-primary cursor-pointer"
      disabled={pending}
    >
      {pending ? "Creating account..." : "Create"}
    </Button>
  );
};

const SignUpForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const router = useRouter();
  const [state, formAction] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      router.push(callbackUrl || "/");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router, callbackUrl]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Name"
          required
          autoComplete="name"
          className="border-2 rounded-none border-gray-200 h-15 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          className="border-2 rounded-none border-gray-200 h-15 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="border-2 rounded-none border-gray-200 h-15 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="border-2 rounded-none border-gray-200 h-15 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
        />
      </div>
      {state && !state.success && (
        <div className="text-center text-destructive">{state.message}</div>
      )}
      <div className="flex flex-col items-start gap-4">
        <SignUpButton />
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/sign-in${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`}
            className="text-accent font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
