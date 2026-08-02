const SearchLoading = () => {
  return (
    <div className="px-5 md:px-28 py-10 animate-pulse">
      <div className="h-7 w-64 bg-muted rounded mb-2" />
      <div className="h-4 w-32 bg-muted rounded mb-8" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-lg p-3 space-y-3"
          >
            <div className="aspect-square bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-5 w-1/3 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchLoading;
