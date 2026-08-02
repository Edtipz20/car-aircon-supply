import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions/product.action";
import { Button } from "@/components/ui/button";

const SearchPage = async (props: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) => {
  const { q, category, page } = await props.searchParams;
  const currentPage = Number(page) || 1;

  const { products, totalPages, totalCount } = await getAllProducts({
    query: q,
    category,
    page: currentPage,
  });

  return (
    <div className="px-5 md:px-28 py-10">
      <h1 className="h2-bold mb-2">
        {q ? `Search results for "${q}"` : "All Products"}
      </h1>
      <p className="text-muted-foreground mb-8">
        {totalCount} {totalCount === 1 ? "product" : "products"} found
      </p>

      {products.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground">No products found</p>
          <Link href="/" className="text-accent font-medium">
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative mb-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium line-clamp-2">
                  {product.name}
                </p>
                <p className="text-accent font-bold mt-1">
                  ${Number(product.price).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const params = new URLSearchParams();
                if (q) params.set("q", q);
                if (category) params.set("category", category);
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
                    <Link href={`/search?${params.toString()}`}>{pageNum}</Link>
                  </Button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
