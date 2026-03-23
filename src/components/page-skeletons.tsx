import { Skeleton } from "@/components/ui/skeleton";

type TablePageSkeletonProps = {
  showFilterTabs?: boolean;
};

export function DashboardPageSkeleton() {
  const statSkeletonIds = ["a", "b", "c", "d", "e", "f"];
  const summarySkeletonIds = ["left", "right"];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-6">
        <Skeleton className="mb-3 h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statSkeletonIds.map((id) => (
          <div key={`dash-stat-${id}`} className="rounded-xl border p-5">
            <Skeleton className="mb-3 h-4 w-24" />
            <Skeleton className="mb-2 h-8 w-28" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {summarySkeletonIds.map((id) => (
          <div key={`dash-summary-${id}`} className="rounded-xl border p-6">
            <Skeleton className="mb-4 h-5 w-36" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsPageSkeleton() {
  const kpiSkeletonIds = ["books", "members", "issues", "overdue"];
  const chartSkeletonIds = ["pie", "bar"];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-6">
        <Skeleton className="mb-3 h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiSkeletonIds.map((id) => (
          <div key={`report-kpi-${id}`} className="rounded-xl border p-4">
            <Skeleton className="mb-3 h-4 w-24" />
            <Skeleton className="mb-2 h-8 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {chartSkeletonIds.map((id) => (
          <div key={`report-chart-${id}`} className="rounded-xl border p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <Skeleton className="h-75 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TablePageSkeleton({
  showFilterTabs = false,
}: Readonly<TablePageSkeletonProps>) {
  const tableHeadIds = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const tableRowIds = ["r1", "r2", "r3", "r4", "r5", "r6"];
  const tableColIds = ["c1", "c2", "c3", "c4", "c5", "c6"];

  return (
    <div className="space-y-6">
      {showFilterTabs ?
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-16" />
        </div>
      : null}

      <div className="rounded-lg border p-4">
        <div className="mb-4 grid grid-cols-6 gap-3">
          {tableHeadIds.map((id) => (
            <Skeleton key={`table-head-${id}`} className="h-4 w-20" />
          ))}
        </div>

        <div className="space-y-3">
          {tableRowIds.map((rowId) => (
            <div key={`table-row-${rowId}`} className="grid grid-cols-6 gap-3">
              {tableColIds.map((colId) => (
                <Skeleton
                  key={`table-cell-${rowId}-${colId}`}
                  className="h-5 w-full"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
