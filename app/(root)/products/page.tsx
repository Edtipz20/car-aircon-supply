import Link from "next/link";
import {
  getAllProducts,
  getAllCategories,
  getAllBrands,
} from "@/lib/actions/product.action";
import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name (A-Z)", value: "name" },
];

const ProductsPage = async (props: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const { category, brand, sort, page } = await props.searchParams;
  const currentPage = Number(page) || 1;

  const [{ products, totalPages, totalCount }, categories, brands] =
    await Promise.all([
      getAllProducts({ category, brand, sort, page: currentPage }),
      getAllCategories(),
      getAllBrands(),
    ]);

  const buildFilterUrl = (params: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    const merged = { category, brand, sort, ...params };
    Object.entries(merged).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    return `/products${search.toString() ? `?${search.toString()}` : ""}`;
  };

  return (
    <div className="px-5 md:px-28 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className="space-y-8">
          <h1 className="h2-bold mb-2">All Products</h1>
          <p className="text-muted-foreground mb-8">{totalCount} products</p>
          <div>
            <h3 className="font-bold mb-3">Category</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={buildFilterUrl({
                    category: undefined,
                    page: undefined,
                  })}
                  className={cn(
                    "hover:text-accent",
                    !category
                      ? "text-accent font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={buildFilterUrl({
                      category: cat.slug,
                      page: undefined,
                    })}
                    className={cn(
                      "hover:text-accent",
                      category === cat.slug
                        ? "text-accent font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Brand</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={buildFilterUrl({ brand: undefined, page: undefined })}
                  className={cn(
                    "hover:text-accent",
                    !brand
                      ? "text-accent font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  All
                </Link>
              </li>
              {brands.map((b) => (
                <li key={b}>
                  <Link
                    href={buildFilterUrl({ brand: b, page: undefined })}
                    className={cn(
                      "hover:text-accent",
                      brand === b
                        ? "text-accent font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {b}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="flex justify-end mb-6">
            <div className="flex gap-2 text-sm">
              {sortOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildFilterUrl({
                    sort: opt.value === "newest" ? undefined : opt.value,
                    page: undefined,
                  })}
                  className={cn(
                    "px-3 py-1 border",
                    (sort ?? "newest") === opt.value
                      ? "border-accent text-accent"
                      : "border-border text-muted-foreground hover:border-muted-foreground",
                  )}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No products match these filters
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        asChild
                        variant={
                          pageNum === currentPage ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          pageNum === currentPage ? "bg-accent text-white" : ""
                        }
                      >
                        <Link href={buildFilterUrl({ page: String(pageNum) })}>
                          {pageNum}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
