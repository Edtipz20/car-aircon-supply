const AdminDashboardLoading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded-full" />
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-lg p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-5 w-14 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock skeleton */}
        <div className="border border-border rounded-lg p-5">
          <div className="h-5 w-24 bg-muted rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders skeleton */}
        <div className="border border-border rounded-lg p-5">
          <div className="h-5 w-28 bg-muted rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="h-4 w-14 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLoading;
