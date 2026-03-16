import {
  DashboardHeaderSkeleton,
  DashboardOverviewSkeleton,
  RecentActivitySkeleton,
  StatsSkeleton,
} from '@/components/dashboard/dashboard-skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <DashboardHeaderSkeleton />
      <StatsSkeleton />
      <DashboardOverviewSkeleton />
      <RecentActivitySkeleton />
    </div>
  );
}
