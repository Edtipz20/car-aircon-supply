import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { getMyCart } from "@/lib/actions/cart.action";
import CheckoutForm from "./checkout-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

const CheckoutPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/checkout");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <CheckoutForm
      cart={cart}
      userEmail={session.user.email ?? ""}
      existingAddress={user?.address as never}
    />
  );
};

export default CheckoutPage;
