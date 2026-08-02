import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileForm from "./profile-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
};

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/user/profile");

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <h1 className="h2-bold mb-8">My Account</h1>
      <ProfileForm
        name={session.user.name ?? ""}
        email={session.user.email ?? ""}
      />
    </div>
  );
};

export default ProfilePage;
