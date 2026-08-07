import { redirect } from "next/navigation";
import { Metadata } from "next";
import { signOutUser } from "@/lib/actions/user.action";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/db/prisma";
import { ShippingAddress } from "@/lib/validators";
import Orders from "./orders";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "./edit-profile-dialog";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "My Account",
};

type MyOrdersPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const ProfilePage = async ({ searchParams }: MyOrdersPageProps) => {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/user/profile");

  const { page } = await searchParams;
  const requestedPage = Number(page) || 1;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const address = user?.address as ShippingAddress | null;

  return (
    <>
      <div className="flex justify-between max-w-7xl mx-auto pt-10 text-primary">
        <div>
          <p className="font-bold uppercase">
            <span className="text-accent">{"// "} </span>Welcome to your store
          </p>
          <h1 className="h2-bold mb-8">My Account</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button
            type="submit"
            variant="outline"
            className="text-xl font-bold cursor-pointer border-primary hover:text-accent hover:bg-transparent hover:border-accent py-2 px-6"
          >
            Logout
          </Button>
        </form>
      </div>
      <Separator />

      <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 mx-auto gap-6 mt-6">
        {/* Order history */}
        <section className="col-span-2 space-y-3">
          <h1 className="h3-bold text-gray-500">Order History</h1>
          <Orders requestedPage={requestedPage} />
        </section>
        <section className="space-y-3">
          <h1 className="h3-bold text-gray-500">Account Details</h1>
          <div className="">
            <p className="text-2xl font-bold">{session.user.name}</p>
            <p>Email: {session.user.email}</p>
          </div>
          <Separator />
          {address ? (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Shipping Address
              </p>
              <p className="text-sm">
                {address.streetAddress}
                {address.apartment ? `, ${address.apartment}` : ""},{" "}
                {address.barangay}, {address.city}, {address.region}{" "}
                {address.postalCode}, {address.country}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No saved address yet
            </p>
          )}

          {/* Edit button */}
          <EditProfileDialog
            name={session.user.name ?? ""}
            email={session.user.email ?? ""}
          />
        </section>
      </div>
    </>
  );
};

export default ProfilePage;
