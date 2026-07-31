const CartLoading = () => {
  return (
    <div className="px-5 md:px-28 py-10 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded mb-8" />

      {/* Items */}
      <div className="divide-y divide-border border-y border-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-6 py-6"
          >
            <div className="w-20 h-20 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-4 w-14 bg-muted rounded" />
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-4 w-14 bg-muted rounded" />
            <div className="h-4 w-4 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-8">
        <div className="h-15 w-32 bg-muted rounded" />
        <div className="h-15 w-40 bg-muted rounded" />
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-8">
        <div className="w-full max-w-sm border border-border">
          <div className="flex justify-between px-4 py-3 border-b border-border">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-14 bg-muted rounded" />
          </div>
          <div className="flex justify-between px-4 py-3 border-b border-border">
            <div className="h-4 w-12 bg-muted rounded" />
            <div className="h-4 w-14 bg-muted rounded" />
          </div>
          <div className="h-15 w-full bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default CartLoading;
