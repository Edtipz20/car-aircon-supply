const ProfileLoading = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between max-w-7xl mx-auto pt-16">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="h-6 w-16 bg-muted rounded" />
      </div>
      <div className="h-px bg-muted mt-4 max-w-7xl mx-auto" />

      <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 mx-auto gap-6 mt-6">
        {/* Order history skeleton */}
        <section className="col-span-2 space-y-3">
          <div className="h-6 w-36 bg-muted rounded mb-2" />
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/50 h-10" />
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 px-4 py-4">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-4 w-14 bg-muted rounded" />
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-5 w-20 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Account details skeleton */}
        <section className="space-y-3">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="pt-2 border-t border-border space-y-2">
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
          </div>
          <div className="h-8 w-28 bg-muted rounded mt-2" />
        </section>
      </div>
    </div>
  );
};

export default ProfileLoading;
