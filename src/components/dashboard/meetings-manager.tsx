'use client';

import type { MeetingBooking, MeetingSlot } from '@prisma/client';
import { Calendar, Clock, Plus, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createMeetingSlots,
  deleteBooking,
  deleteMeetingSlot,
} from '@/lib/actions/meeting';

type SlotWithBooking = MeetingSlot & { booking: MeetingBooking | null };
type BookingWithSlot = MeetingBooking & { slot: MeetingSlot };

interface Props {
  initialSlots: SlotWithBooking[];
  initialBookings: BookingWithSlot[];
}

function AddSlotsDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [duration, setDuration] = useState(30);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setLoading(true);

    const slots: { date: Date; startTime: string; endTime: string }[] = [];
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += duration) {
        const endM = m + duration;
        const endH = h + Math.floor(endM / 60);
        const endMin = endM % 60;
        if (endH > endHour || (endH === endHour && endMin > 0)) break;

        slots.push({
          date: new Date(date + 'T00:00:00'),
          startTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
          endTime: `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
        });
      }
    }

    try {
      await createMeetingSlots(slots);
      router.refresh();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Date</Label>
        {/* //update it to use calendar.tsx  */}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Start Hour</Label>
          <Input
            type="number"
            value={startHour}
            onChange={(e) => setStartHour(parseInt(e.target.value))}
            min={0}
            max={23}
          />
        </div>
        <div className="space-y-2">
          <Label>End Hour</Label>
          <Input
            type="number"
            value={endHour}
            onChange={(e) => setEndHour(parseInt(e.target.value))}
            min={1}
            max={24}
          />
        </div>
        <div className="space-y-2">
          <Label>Duration (min)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min={15}
            max={120}
            step={15}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Slots'}
        </Button>
      </div>
    </form>
  );
}

export function MeetingsManager({ initialSlots, initialBookings }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const upcomingBookings = initialBookings.filter(
    (b) => new Date(b.slot.date) >= new Date(),
  );

  async function handleDeleteSlot(id: string) {
    await deleteMeetingSlot(id);
    router.refresh();
  }

  async function handleDeleteBooking(id: string) {
    await deleteBooking(id);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Add slots */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Time Slots
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Available Time Slots</DialogTitle>
          </DialogHeader>
          <AddSlotsDialog onClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Upcoming Bookings ({upcomingBookings.length})
        </h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No upcoming bookings</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4" />
                      {booking.name}
                    </CardTitle>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cancel {booking.name}&apos;s meeting? The slot will
                            become available again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteBooking(booking.id)}
                          >
                            Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {booking.email}
                    {booking.company && ` · ${booking.company}`}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(booking.slot.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.slot.startTime} - {booking.slot.endTime}
                    </span>
                  </div>
                  {booking.message && (
                    <p className="text-muted-foreground mt-2 text-xs">
                      {booking.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Slots */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          All Slots ({initialSlots.length})
        </h2>
        {initialSlots.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No slots created. Add time slots above.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {initialSlots.map((slot) => (
              <div
                key={slot.id}
                className="border-border flex items-center justify-between rounded-lg border p-3"
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {new Date(slot.date).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {slot.isBooked ? (
                    <Badge>Booked</Badge>
                  ) : (
                    <Badge variant="outline">Available</Badge>
                  )}
                  {!slot.isBooked && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-8 w-8"
                      onClick={() => handleDeleteSlot(slot.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
