import {
  DashboardHeaderSkeleton,
  TableSkeleton,
} from '@/components/dashboard/dashboard-skeleton';

export default function CategoriesLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <DashboardHeaderSkeleton />
      <div className="h-8" />
      <TableSkeleton />
    </div>
  );
}
