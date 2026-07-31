"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from "@/lib/actions/cart.action";
import { toast } from "sonner";

type Cart = {
  items: {
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: string;
    qty: number;
    stock: number;
  }[];
  itemsPrice: string;
  totalPrice: string;
};

const CartTable = ({ cart }: { cart: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleIncrement = (productId: string) => {
    startTransition(async () => {
      const res = await addItemToCart({ productId, qty: 1 });
      if (!res.success) toast.error(res.message);
      router.refresh();
    });
  };

  const handleDecrement = (productId: string) => {
    startTransition(async () => {
      const res = await removeItemFromCart(productId);
      if (!res.success) toast.error(res.message);
      router.refresh();
    });
  };

  const handleRemoveAll = (productId: string, qty: number) => {
    startTransition(async () => {
      // removeItemFromCart only removes 1 unit per call, so call it qty times
      for (let i = 0; i < qty; i++) {
        await removeItemFromCart(productId);
      }
      router.refresh();
    });
  };

  const handleClearCart = () => {
    startTransition(async () => {
      const res = await clearCart();
      if (!res.success) toast.error(res.message);
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      {/* Items */}
      <div className="divide-y divide-border border-y border-border">
        {cart.items.map((item) => (
          <div
            key={item.productId}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-6 py-6"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="rounded border object-cover"
            />
            <Link
              href={`/product/${item.slug}`}
              className="font-semibold hover:text-accent"
            >
              {item.name}
            </Link>
            <span className="font-medium">
              ${Number(item.price).toFixed(2)}
            </span>

            <div className="flex items-center border border-border rounded-none overflow-hidden divide-x divide-border">
              <button
                onClick={() => handleDecrement(item.productId)}
                disabled={isPending}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-sm">
                {item.qty}
              </span>
              <button
                onClick={() => handleIncrement(item.productId)}
                disabled={isPending || item.qty >= item.stock}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <span className="font-semibold text-accent">
              ${(Number(item.price) * item.qty).toFixed(2)}
            </span>

            <button
              onClick={() => handleRemoveAll(item.productId, item.qty)}
              disabled={isPending}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleClearCart}
          disabled={isPending}
          className="bg-accent h-15 text-lg text-white hover:bg-primary hover:text-white"
        >
          {isPending && <Loader className="h-4 w-4 animate-spin" />}
          Clear Cart
        </Button>
        <Button
          asChild
          variant="outline"
          className="bg-accent h-15 text-lg text-white hover:bg-primary hover:text-white"
        >
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-0 border border-border">
          <div className="flex justify-between px-4 py-3 border-b border-border bg-muted/50">
            <span className="font-medium">Subtotal</span>
            <span>${Number(cart.itemsPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 border-b border-border bg-muted/50">
            <span className="font-semibold">Total</span>
            <span className="font-bold">
              ${Number(cart.totalPrice).toFixed(2)}
            </span>
          </div>
          <Button
            asChild
            className="w-full text-lg bg-accent hover:bg-primary text-white h-15"
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
