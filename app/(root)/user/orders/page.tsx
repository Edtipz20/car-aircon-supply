// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { auth } from "@/auth";
// import { getMyOrders } from "@/lib/actions/order.actions";
// import { Badge } from "@/components/ui/badge";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "My Orders",
// };

// const MyOrdersPage = async (props: {
//   searchParams: Promise<{ page: string }>;
// }) => {
//   const session = await auth();
//   if (!session?.user?.id) redirect("/sign-in?callbackUrl=/user/orders");

//   const { page } = await props.searchParams;

//   const orders = await getMyOrders({ page: Number(page) || 1 });

//   return (
//     <div className="px-5 md:px-28 py-10">
//       <h1 className="h2-bold mb-8">My Orders</h1>

// {
//   orders.data.length === 0 ? (
//     <div className="text-center py-20 space-y-4">
//       <p className="text-muted-foreground">
//         You haven&apos;t placed any orders yet
//       </p>
//       <Link href="/" className="text-accent font-medium">
//         Start Shopping
//       </Link>
//     </div>
//   ) : (
//     <div className="border border-border rounded-lg overflow-hidden">
//       <table className="w-full text-sm">
//         <thead className="bg-muted/50 text-left">
//           <tr>
//             <th className="px-4 py-3 font-medium">Order</th>
//             <th className="px-4 py-3 font-medium">Date</th>
//             <th className="px-4 py-3 font-medium">Total</th>
//             <th className="px-4 py-3 font-medium">Paid</th>
//             <th className="px-4 py-3 font-medium">Delivered</th>
//             <th className="px-4 py-3 font-medium"></th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-border">
//           {orders.data.map((order) => (
//             <tr key={order.id}>
//               <td className="px-4 py-4 font-medium">
//                 #{order.id.slice(0, 8).toUpperCase()}
//               </td>
//               <td className="px-4 py-4 text-muted-foreground">
//                 {new Intl.DateTimeFormat("en-PH", {
//                   dateStyle: "medium",
//                 }).format(order.createdAt)}
//               </td>
//               <td className="px-4 py-4 font-semibold">
//                 ${Number(order.totalPrice).toFixed(2)}
//               </td>
//               <td className="px-4 py-4">
//                 {order.isPaid ? (
//                   <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
//                     Paid
//                   </Badge>
//                 ) : (
//                   <Badge variant="outline" className="text-muted-foreground">
//                     Not Paid
//                   </Badge>
//                 )}
//               </td>
//               <td className="px-4 py-4">
//                 {order.isDelivered ? (
//                   <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
//                     Delivered
//                   </Badge>
//                 ) : (
//                   <Badge variant="outline" className="text-muted-foreground">
//                     Pending
//                   </Badge>
//                 )}
//               </td>
//               <td className="px-4 py-4 text-right">
//                 <Link
//                   href={`/order/${order.id}`}
//                   className="text-accent font-medium"
//                 >
//                   View
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
//     </div>
//   );
// };

// export default MyOrdersPage;

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getMyOrdersPaginated } from "@/lib/actions/order.action";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
};

type MyOrdersPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const MyOrdersPage = async ({ searchParams }: MyOrdersPageProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/user/orders");
  }

  const { page } = await searchParams;
  const requestedPage = Number(page) || 1;

  const { orders, currentPage, totalPages } =
    await getMyOrdersPaginated(requestedPage);

  return (
    <div className="px-5 py-10 md:px-28">
      <h1 className="h2-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="space-y-4 py-20 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t placed any orders yet
          </p>
          <Link href="/" className="font-medium text-accent">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-hidden border border-border">
            <table className="w-full text-sm">
              {/* Keep your existing table header */}
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
                    {/* Keep your existing table cells */}
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
    </div>
  );
};

export default MyOrdersPage;
