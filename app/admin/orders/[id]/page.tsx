import { notFound } from "next/navigation";
import Image from "next/image";
import { getOrderById } from "@/lib/actions/order.action";
import { Badge } from "@/components/ui/badge";
import OrderActions from "./order-actions";

const AdminOrderDetailPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="h2-bold">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {order.user.name} · {order.user.email}
          </p>
        </div>
        <OrderActions
          orderId={order.id}
          isPaid={order.isPaid}
          isDelivered={order.isDelivered}
        />
      </div>

      <div className="flex gap-3">
        {order.isPaid ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Paid{" "}
            {order.paidAt &&
              `on ${new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(order.paidAt)}`}
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-muted-foreground">
            Not Paid
          </Badge>
        )}
        {order.isDelivered ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Delivered{" "}
            {order.deliveredAt &&
              `on ${new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(order.deliveredAt)}`}
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-muted-foreground">
            Pending Delivery
          </Badge>
        )}
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

export default AdminOrderDetailPage;
