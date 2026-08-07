const MyOrdersLoading = () => {
  return (
    <div className="px-5 py-10 md:px-28">
      <div className="mb-8 h-9 w-40 animate-pulse rounded-md bg-muted" />

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {["Order", "Date", "Total", "Paid", "Delivered", ""].map(
                (header, index) => (
                  <th key={index} className="px-4 py-3 text-left font-medium">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 6 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4">
                    <div
                      className={`h-5 animate-pulse rounded bg-muted ${
                        cellIndex === 0
                          ? "w-24"
                          : cellIndex === 1
                            ? "w-28"
                            : cellIndex === 2
                              ? "w-16"
                              : cellIndex === 3 || cellIndex === 4
                                ? "w-20"
                                : "ml-auto w-10"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersLoading;
