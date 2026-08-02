import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { getMyCart } from "@/lib/actions/cart.action";
import PlaceOrderForm from "./place-order-form";

const PlaceOrderPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/place-order");

  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.address) redirect("/checkout");

  return (
    <div className="px-5 md:px-28 py-10">
      <h1 className="h2-bold mb-8">Review Your Order</h1>
      <PlaceOrderForm
        cart={cart}
        address={user.address as never}
        paymentMethod={user.paymentMethod ?? ""}
      />
    </div>
  );
};

export default PlaceOrderPage;
