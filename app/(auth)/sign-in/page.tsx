import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import CredentialsSignInForm from "./credentials-signin-form";

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
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
