const swatches = [
  { name: "Ink", hex: "#102937", className: "bg-ink" },
  { name: "Navy", hex: "#091d26", className: "bg-primary" },
  { name: "Teal", hex: "#124d54", className: "bg-secondary" },
  { name: "Deep Teal", hex: "#094044", className: "bg-secondary-dark" },
  { name: "Coral", hex: "#f9744b", className: "bg-accent" },
  { name: "Burnt Coral", hex: "#d84f2a", className: "bg-accent-dark" },
  { name: "Stone", hex: "#e1d9cf", className: "bg-surface-muted" },
  { name: "Sand", hex: "#d6c4b0", className: "bg-border" },
  { name: "Mist", hex: "#ededed", className: "bg-surface" },
  { name: "Warm Mist", hex: "#ede6df", className: "bg-background" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondary">
              Prostore
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-primary sm:text-5xl">
              Store operations with a sharp coastal palette.
            </h1>
          </div>
          <button className="hidden h-11 rounded-lg bg-accent px-5 text-sm font-semibold text-primary transition hover:bg-accent-dark hover:text-primary-contrast sm:block">
            Open Store
          </button>
        </header>

        <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between rounded-lg border border-border bg-surface p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-secondary">Today</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-sm text-secondary">Revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-primary">
                    $18.4k
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <p className="text-sm text-primary-contrast">Orders</p>
                  <p className="mt-3 text-3xl font-semibold text-primary-contrast">
                    264
                  </p>
                </div>
                <div className="rounded-lg bg-accent p-4">
                  <p className="text-sm text-primary">Stock Alerts</p>
                  <p className="mt-3 text-3xl font-semibold text-primary">12</p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-border">
              {["Portable dock", "Desk lamp", "Travel keyboard"].map(
                (item, index) => (
                  <div
                    className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border bg-surface px-4 py-3 last:border-b-0"
                    key={item}
                  >
                    <span className="font-medium text-primary">{item}</span>
                    <span className="rounded-md bg-background px-3 py-1 text-sm text-secondary">
                      #{String(index + 1482)}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="rounded-lg bg-primary p-6 text-primary-contrast">
            <p className="text-sm font-medium text-surface-muted">Palette</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {swatches.map((swatch) => (
                <div
                  className="grid grid-cols-[3rem_1fr_auto] items-center gap-3"
                  key={swatch.hex}
                >
                  <div
                    className={`h-10 rounded-md border border-primary-contrast/20 ${swatch.className}`}
                  />
                  <span className="font-medium">{swatch.name}</span>
                  <code className="text-sm text-surface-muted">
                    {swatch.hex}
                  </code>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
