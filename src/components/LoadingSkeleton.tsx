export function LoadingSkeleton({ label }: { label: string }) {
  return <div className="loading-section wrap" role="status"><span className="sr-only">{label}</span><div aria-hidden="true"><div className="skeleton loading-heading"/><div className="skeleton loading-line"/><div className="skeleton loading-line"/><div className="skeleton loading-panel"/></div></div>;
}
