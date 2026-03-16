import {
  DashboardHeaderSkeleton,
  FormSkeleton,
} from '@/components/dashboard/dashboard-skeleton';

export default function SettingsLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <DashboardHeaderSkeleton />
      <div className="mx-auto max-w-2xl py-8">
        <FormSkeleton />
      </div>
    </div>
  );
}
