import Link from "next/link";
import { getAllOrdersAdmin } from "@/lib/actions/order.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrderFilters from "./order-filters";

const AdminOrdersPage = async (props: {
  searchParams: Promise<{
    page?: string;
    paid?: string;
    delivered?: string;
    dateRange?: string;
  }>;
}) => {
  const { page, paid, delivered, dateRange } = await props.searchParams;
  const currentPage = Number(page) || 1;

  const { orders, totalPages, totalCount } = await getAllOrdersAdmin({
    page: currentPage,
    paid,
    delivered,
    dateRange,
  });

  return (
    <div className="space-y-6">
      <h1 className="h2-bold">
        <span className="text-accent">{"// "}</span>Orders
      </h1>
      <OrderFilters />
      <p className="text-sm text-muted-foreground">{totalCount} orders</p>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Delivered</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <p>{order.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.user.email}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Intl.DateTimeFormat("en-PH", {
                    dateStyle: "medium",
                  }).format(order.createdAt)}
                </td>
                <td className="px-4 py-3 font-semibold">
                  ${Number(order.totalPrice).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  {order.isPaid ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Paid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Not Paid
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {order.isDelivered ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Delivered
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Pending
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const params = new URLSearchParams();
            if (paid) params.set("paid", paid);
            if (delivered) params.set("delivered", delivered);
            if (dateRange) params.set("dateRange", dateRange);
            params.set("page", String(pageNum));
            return (
              <Button
                key={pageNum}
                asChild
                variant={pageNum === currentPage ? "default" : "outline"}
                size="sm"
                className={
                  pageNum === currentPage ? "bg-accent text-white" : ""
                }
              >
                <Link href={`/admin/orders?${params.toString()}`}>
                  {pageNum}
                </Link>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
