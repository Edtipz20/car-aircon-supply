import Link from "next/link";
import {
  getAllCategories,
  getAllProductsAdmin,
} from "@/lib/actions/product.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteProductButton from "./delete-product-button";
import ProductDialog from "./product-dialog";

const AdminProductsPage = async (props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) => {
  const { query, page } = await props.searchParams;
  const currentPage = Number(page) || 1;

  const { products, totalPages, totalCount } = await getAllProductsAdmin({
    query,
    page: currentPage,
  });

  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="h2-bold">
          <span className="text-accent">{"// "}</span>Products
        </h1>
        <ProductDialog mode="create" categories={categories} />
      </div>

      <form action="/admin/products" method="GET" className="max-w-sm">
        <Input
          name="query"
          defaultValue={query}
          placeholder="Search products..."
        />
      </form>

      <p className="text-sm text-muted-foreground">{totalCount} products</p>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category.name}
                </td>
                <td className="px-4 py-3">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={product.stock === 0 ? "text-destructive" : ""}
                  >
                    {product.stock === 0 ? "Out of Stock" : product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <ProductDialog
                    mode="edit"
                    productId={product.id}
                    categories={categories}
                    defaultValues={{
                      name: product.name,
                      slug: product.slug,
                      categoryId: product.categoryId,
                      brand: product.brand,
                      description: product.description,
                      stock: product.stock,
                      images: product.images,
                      isFeatured: product.isFeatured,
                      banner: product.banner,
                      price: product.price.toString(),
                    }}
                  />
                  <DeleteProductButton productId={product.id} />
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
            if (query) params.set("query", query);
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
                <Link href={`/admin/products?${params.toString()}`}>
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

export default AdminProductsPage;
