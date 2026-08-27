/**
 * Route-level loading state. Skeletons in the shape of the content that is
 * coming, rather than a spinner — a spinner tells you nothing about what is
 * about to appear.
 */
export default function Loading() {
  return (
    <div className="theme-sand min-h-[100svh] bg-background pt-32">
      <div className="container-editorial">
        <div className="h-3 w-40 animate-pulse rounded-pill bg-surface-raised" />
        <div className="mt-8 h-16 w-3/4 animate-pulse rounded-lg bg-surface-raised" />
        <div className="mt-4 h-16 w-1/2 animate-pulse rounded-lg bg-surface-raised" />
        <div className="mt-10 h-4 w-2/3 animate-pulse rounded-pill bg-surface-raised" />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-lg bg-surface-raised"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  );
}
