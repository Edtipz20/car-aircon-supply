"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getMyCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { Separator } from "@/components/ui/separator";

type Cart = Awaited<ReturnType<typeof getMyCart>>;

const CartSheet = ({ cart }: { cart: Cart }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const itemCount = cart?.items.reduce((acc, item) => acc + item.qty, 0) ?? 0;

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      await removeItemFromCart(productId);
      router.refresh();
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative cursor-pointer">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl">Cart</SheetTitle>
        </SheetHeader>
        <Separator />

        {!cart || cart.items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 space-y-4 divide-y divide-border">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex mt-3 gap-3 py-4 first:pt-0 relative"
                >
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={isPending}
                    className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-white border rounded-full w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded border object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.qty} x ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-4 pt-4 pb-2 space-y-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal:</span>
                <span className="text-accent">
                  ${Number(cart.itemsPrice).toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 h-15 border-accent text-accent hover:bg-accent hover:text-white"
                >
                  <Link href="/cart" onClick={() => setOpen(false)}>
                    View Cart
                  </Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 h-15 bg-primary text-white hover:bg-primary/90"
                >
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    Checkout
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Free shipping nationwide.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
