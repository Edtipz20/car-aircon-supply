"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { signInDefaultValues } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const SignInButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="h-15 px-15 bg-accent text-white text-lg font-bold hover:bg-primary cursor-pointer"
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
};

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
            placeholder="Email"
            required
            className="border-2 rounded-none border-gray-300 h-15 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              defaultValue={signInDefaultValues.password}
              placeholder="Password"
              required
              className="border-2 rounded-none border-gray-300 h-15 pr-10 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {!data.success && data.message && (
          <p className="text-sm text-destructive text-center">{data.message}</p>
        )}
        <div className="flex items-center justify-between">
          <SignInButton />
          <p className="text-muted-foreground">Forgot your password?</p>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="link hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
