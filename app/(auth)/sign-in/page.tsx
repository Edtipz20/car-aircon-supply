import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import CredentialsSignInForm from "./credentials-signin-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = () => {
  return (
    <div className="w-full max-w-md">
      <Card>
        <CardTitle className="text-center text-primary text-3xl lg:text-4xl">
          Login
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground mb-8">
          Please login using account detail bellow.
        </CardDescription>
        <CardContent className="space-y-4">
          {/* Form */}
          <Suspense
            fallback={<div className="text-center py-4">Loading form...</div>}
          >
            <CredentialsSignInForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
