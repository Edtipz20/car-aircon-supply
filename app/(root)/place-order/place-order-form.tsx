"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader, Truck } from "lucide-react";
import { createOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner";
import type { ShippingAddress } from "@/lib/validators";

type Cart = {
  items: {
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: string;
    qty: number;
  }[];
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
};

const PlaceOrderForm = ({
  cart,
  address,
  paymentMethod,
}: {
  cart: Cart;
  address: ShippingAddress;
  paymentMethod: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePlaceOrder = () => {
    startTransition(async () => {
      const res = await createOrder();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push(`/order/${res.orderId}`);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping address */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Shipping Address</h2>
            <Link href="/checkout" className="text-sm text-accent">
              Edit
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">{address.fullName}</p>
          <p className="text-sm text-muted-foreground">
            {address.mobileNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.streetAddress}
            {address.apartment ? `, ${address.apartment}` : ""},{" "}
            {address.barangay}, {address.city}, {address.region}{" "}
            {address.postalCode}, {address.country}
          </p>
        </div>

        {/* Payment method */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Payment Method</h2>
            <Link href="/checkout" className="text-sm text-accent">
              Edit
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            {paymentMethod === "CashOnDelivery"
              ? "Cash on Delivery"
              : paymentMethod}
          </div>
        </div>

        {/* Items */}
        <div className="border border-border rounded-lg p-5">
          <h2 className="font-bold mb-4">Order Items</h2>
          <div className="divide-y divide-border">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 py-3"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="rounded border object-cover"
                />
                <Link
                  href={`/product/${item.slug}`}
                  className="flex-1 text-sm font-medium hover:text-accent"
                >
                  {item.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  x{item.qty}
                </span>
                <span className="text-sm font-semibold">
                  ${(Number(item.price) * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Totals + place order */}
      <div className="border border-border rounded-lg p-5 h-fit space-y-3">
        <div className="flex justify-between text-sm">
          <span>Items</span>
          <span>${Number(cart.itemsPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {Number(cart.shippingPrice) === 0
              ? "Free"
              : `$${Number(cart.shippingPrice).toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${Number(cart.taxPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
          <span>Total</span>
          <span>${Number(cart.totalPrice).toFixed(2)}</span>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={isPending}
          className="w-full h-14 bg-accent hover:bg-accent-dark text-white mt-4"
        >
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PlaceOrderForm;
