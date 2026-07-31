const ProductDetailsLoading = () => {
  return (
    <div className="animate-pulse">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image gallery skeleton */}
          <div className="space-y-3">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="flex gap-2">
              <div className="h-16 w-16 bg-muted rounded" />
              <div className="h-16 w-16 bg-muted rounded" />
              <div className="h-16 w-16 bg-muted rounded" />
            </div>
          </div>

          {/* Info skeleton */}
          <div className="flex flex-col gap-4">
            <div className="h-7 w-3/4 bg-muted rounded" />
            <div className="h-10 w-1/3 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
            </div>

            <div className="h-px bg-muted my-2" />

            <div className="space-y-3">
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-4 w-1/4 bg-muted rounded" />
            </div>

            <div className="h-px bg-muted my-2" />

            <div className="h-12 w-full bg-muted rounded" />
            <div className="h-10 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </section>

      {/* Tabs skeleton */}
      <section className="mt-8">
        <div className="flex gap-6 border-b pb-3">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded" />
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
        <div className="pt-6 space-y-3">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsLoading;
