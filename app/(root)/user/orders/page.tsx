import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getMyOrders } from "@/lib/actions/order.actions";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
};

const MyOrdersPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/user/orders");

  const orders = await getMyOrders();

  return (
    <div className="px-5 md:px-28 py-10">
      <h1 className="h2-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground">
            You haven&apos;t placed any orders yet
          </p>
          <Link href="/" className="text-accent font-medium">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Paid</th>
                <th className="px-4 py-3 font-medium">Delivered</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 font-medium">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Intl.DateTimeFormat("en-PH", {
                      dateStyle: "medium",
                    }).format(order.createdAt)}
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    ${Number(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    {order.isPaid ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Paid
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        Not Paid
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {order.isDelivered ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Delivered
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/order/${order.id}`}
                      className="text-accent font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
