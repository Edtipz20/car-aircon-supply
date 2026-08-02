import Link from "next/link";
import { getMyCart } from "@/lib/actions/cart.action";
import CartTable from "./cart-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <div className="px-5 md:px-28 py-10">
      <h1 className="h2-bold mb-8">Your shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Link href="/" className="text-accent font-medium">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <CartTable cart={cart} />
      )}
    </div>
  );
};

export default CartPage;
