export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse rounded-full bg-ink/10 ${className}`} />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-ink/10" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="h-3 w-1/3" />
        <SkeletonLine className="h-2.5 w-1/4" />
      </div>
      <SkeletonLine className="h-3 w-12" />
    </div>
  );
}
