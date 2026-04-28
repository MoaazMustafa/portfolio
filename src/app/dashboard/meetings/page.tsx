import { MeetingsManager } from '@/components/dashboard/meetings-manager';
import { getAllBookings, getAllSlots } from '@/lib/actions/meeting';

export const metadata = {
  title: 'Meetings - Dashboard',
  description: 'Manage meeting slots and bookings',
};

export default async function MeetingsDashboardPage() {
  const [slots, bookings] = await Promise.all([
    getAllSlots(),
    getAllBookings(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
        <p className="text-muted-foreground">
          Manage available time slots and view bookings
        </p>
      </div>
      <MeetingsManager initialSlots={slots} initialBookings={bookings} />
    </div>
  );
}
