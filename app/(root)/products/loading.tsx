const ProductsLoading = () => {
  return (
    <div className="px-5 md:px-28 py-10 animate-pulse">
      <div className="h-7 w-40 bg-muted rounded mb-2" />
      <div className="h-4 w-24 bg-muted rounded mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Filters sidebar skeleton */}
        <aside className="space-y-8">
          <div>
            <div className="h-5 w-20 bg-muted rounded mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-24 bg-muted rounded" />
              ))}
            </div>
          </div>
          <div>
            <div className="h-5 w-16 bg-muted rounded mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-20 bg-muted rounded" />
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="flex justify-end gap-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 w-24 bg-muted rounded" />
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-full space-y-3">
                <div className="aspect-square bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded mx-auto" />
                <div className="h-6 w-1/3 bg-muted rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsLoading;
