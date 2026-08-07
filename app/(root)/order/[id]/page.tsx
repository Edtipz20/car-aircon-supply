import { notFound } from "next/navigation";
import Image from "next/image";
import { getOrderById } from "@/lib/actions/order.action";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const address = order.shippingAddress as {
    fullName: string;
    mobileNumber: string;
    streetAddress: string;
    apartment?: string;
    barangay: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <CheckCircle className="h-12 w-12 text-accent mx-auto" />
        <h1 className="h2-bold">Order Confirmed</h1>
        <p className="text-muted-foreground">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <div className="border border-border rounded-lg p-5">
        <h2 className="font-bold mb-2">Shipping Address</h2>
        <p className="text-sm text-muted-foreground">{address.fullName}</p>
        <p className="text-sm text-muted-foreground">{address.mobileNumber}</p>
        <p className="text-sm text-muted-foreground">
          {address.streetAddress}
          {address.apartment ? `, ${address.apartment}` : ""},{" "}
          {address.barangay}, {address.city}, {address.region}{" "}
          {address.postalCode}, {address.country}
        </p>
      </div>

      <div className="border border-border rounded-lg p-5">
        <h2 className="font-bold mb-4">Items</h2>
        <div className="divide-y divide-border">
          {order.orderItems.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 py-3">
              <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={56}
                className="rounded border object-cover"
              />
              <span className="flex-1 text-sm font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground">x{item.qty}</span>
              <span className="text-sm font-semibold">
                ${(Number(item.price) * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-lg p-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Items</span>
          <span>${Number(order.itemsPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${Number(order.shippingPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${Number(order.taxPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
          <span>Total</span>
          <span>${Number(order.totalPrice).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
