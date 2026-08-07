import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/admin.action";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const AdminDashboard = async () => {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Total Revenue",
      value: `$${Number(stats.totalRevenue).toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      label: "Total Customers",
      value: stats.totalUsers,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="h2-bold">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border border-border p-5 shadow-md flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock alert */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="font-bold">Low Stock</h2>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All products are well stocked
            </p>
          ) : (
            <div className="space-y-2">
              {stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0 hover:text-accent"
                >
                  <span>{product.name}</span>
                  <Badge
                    variant="outline"
                    className={
                      product.stock === 0
                        ? "text-destructive border-destructive"
                        : "text-orange-600 border-orange-300"
                    }
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="border border-border rounded-lg p-5">
          <h2 className="font-bold mb-4">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0 hover:text-accent"
                >
                  <div>
                    <p className="font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.user.name}
                    </p>
                  </div>
                  <span className="font-semibold">
                    ${Number(order.totalPrice).toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats.pendingOrders > 0 && (
        <div className="border border-orange-300 bg-orange-50 rounded-lg p-4 text-sm text-orange-800">
          You have <strong>{stats.pendingOrders}</strong> order
          {stats.pendingOrders === 1 ? "" : "s"} awaiting delivery.
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
