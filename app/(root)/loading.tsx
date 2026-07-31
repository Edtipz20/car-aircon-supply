const HomepageLoading = () => {
  return (
    <div className="my-10 px-5 md:px-28 mt-10 md:mt-28 animate-pulse">
      <h2 className="h2-bold text-center mb-16">
        <span className="text-accent">{"// "}</span>
        <span className="inline-block h-6 w-40 bg-muted rounded align-middle" />
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-full max-w-sm mx-auto space-y-3">
            <div className="aspect-square bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded mx-auto" />
            <div className="h-6 w-1/3 bg-muted rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomepageLoading;
