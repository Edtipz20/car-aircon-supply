import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const SignUpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;
  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-xl">
      <Card>
        <CardTitle className="text-center text-primary text-3xl lg:text-4xl">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground mb-2">
          Please register using account detail bellow.
        </CardDescription>
        <CardContent className="space-y-4">
          {/* Form */}
          <SignUpForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
