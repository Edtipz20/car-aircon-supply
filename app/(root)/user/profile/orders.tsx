import { Badge } from "@/components/ui/badge";
import { getMyOrdersPaginated } from "@/lib/actions/order.action";
import Link from "next/link";

const Orders = async ({ requestedPage }: { requestedPage: number }) => {
  const { orders, currentPage, totalPages } =
    await getMyOrdersPaginated(requestedPage);
  return (
    <>
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
        <>
          <div className="border border-border overflow-hidden">
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
          {totalPages > 1 && (
            <nav
              aria-label="Orders pagination"
              className="mt-6 flex items-center justify-center gap-2"
            >
              <Link
                href={`/user/orders?page=${currentPage - 1}`}
                aria-disabled={currentPage === 1}
                className={`border px-3 py-2 text-sm ${
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-muted"
                }`}
              >
                Previous
              </Link>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <Link
                    key={pageNumber}
                    href={`/user/orders?page=${pageNumber}`}
                    aria-current={
                      pageNumber === currentPage ? "page" : undefined
                    }
                    className={`px-5 py-2 text-sm ${
                      pageNumber === currentPage
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "border hover:bg-muted"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}

              <Link
                href={`/user/orders?page=${currentPage + 1}`}
                aria-disabled={currentPage === totalPages}
                className={`border px-6 py-2 text-sm ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-muted"
                }`}
              >
                Next
              </Link>
            </nav>
          )}
        </>
      )}
    </>
  );
};

export default Orders;
