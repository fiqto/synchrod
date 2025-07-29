export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-secondary border border-border rounded-2xl p-8 animate-pulse">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-border rounded-xl"></div>
        <div className="w-16 h-6 bg-border rounded-full"></div>
      </div>
      <div className="h-6 bg-border rounded mb-3"></div>
      <div className="h-4 bg-border rounded mb-2"></div>
      <div className="h-4 bg-border rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-border rounded w-20"></div>
    </div>
  );
}