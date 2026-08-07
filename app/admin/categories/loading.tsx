const AdminCategoriesLoading = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-36 bg-muted rounded" />
        <div className="h-9 w-36 bg-muted rounded" />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 h-11" />
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-4 py-3">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-8 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesLoading;
