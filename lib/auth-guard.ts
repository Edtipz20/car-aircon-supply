import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return session;
}
