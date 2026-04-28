'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  contactSchema,
  type ContactFormValues,
  meetingBookingSchema,
  type MeetingBookingFormValues,
} from '@/lib/validations/contact';

// ── Contact Form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  async function onSubmit(data: ContactFormValues) {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        form.reset();
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="text-primary h-5 w-5" />
          Send a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="bg-primary/10 text-primary mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Message Sent!</h3>
            <p className="text-muted-foreground mt-1">{message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setStatus('idle')}
            >
              Send another message
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="What's this about?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your project or idea..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {status === 'error' && (
                <p className="text-destructive text-sm">{message}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

// ── Meeting Scheduler ─────────────────────────────────────────────────────────

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

function MeetingScheduler() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/meeting?date=${date}`);
      const data = await res.json();
      if (data.success) {
        setSlots(data.slots);
      }
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const form = useForm<MeetingBookingFormValues>({
    resolver: zodResolver(meetingBookingSchema),
    defaultValues: {
      slotId: '',
      name: '',
      email: '',
      company: '',
      message: '',
      timezone: clientTimezone,
    },
  });

  useEffect(() => {
    if (selectedSlot) {
      form.setValue('slotId', selectedSlot.id);
    }
  }, [selectedSlot, form]);

  async function onSubmit(data: MeetingBookingFormValues) {
    setStatus('loading');
    try {
      const res = await fetch('/api/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        form.reset();
        setSelectedSlot(null);
        if (selectedDate) fetchSlots(selectedDate);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  // Generate next 14 days for date selection
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="text-primary h-5 w-5" />
          Schedule a Meeting
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <div className="bg-primary/10 text-primary mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Meeting Booked!</h3>
            <p className="text-muted-foreground mt-1">{message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setStatus('idle');
                setSelectedDate('');
              }}
            >
              Book another meeting
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Date selector */}
            <div>
              <p className="text-muted-foreground mb-3 text-sm font-medium">
                Select a date
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const d = new Date(date + 'T00:00:00');
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={cn(
                        'flex min-w-18 flex-col items-center rounded-lg border p-2 text-sm transition-all',
                        selectedDate === date
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      <span className="text-xs font-medium">
                        {d.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold">{d.getDate()}</span>
                      <span className="text-xs">
                        {d.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <p className="text-muted-foreground mb-3 text-sm font-medium">
                  Available times
                </p>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    No available slots for this date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          'flex items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm transition-all',
                          selectedSlot?.id === slot.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50',
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Booking form */}
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting agenda (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What would you like to discuss?"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {status === 'error' && (
                      <p className="text-destructive text-sm">{message}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        <>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Meeting
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Social & Info ─────────────────────────────────────────────────────────────

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/moaazmustafa',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/moaazmustafa',
    icon: Linkedin,
  },
  {
    label: 'Email',
    href: 'mailto:contactwithmoaaz@gmail.com',
    icon: Mail,
  },
  {
    label: 'Website',
    href: 'https://www.moaazmustafa.dev',
    icon: Globe,
  },
];

function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Location */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex items-center gap-3 pt-6">
          <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <MapPin className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Lahore, Pakistan</p>
            <p className="text-muted-foreground text-sm">
              Available for remote work worldwide
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social links */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Connect with me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:border-primary/50 hover:bg-primary/5 flex items-center gap-2 rounded-lg border p-3 transition-all"
              >
                <link.icon className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <h3 className="text-lg font-semibold">
            Looking for a developer?
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            I&apos;m available for freelance projects, collaborations, and
            full-time opportunities. Let&apos;s build something great together.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────

export function ContactSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Let&apos;s Connect
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mx-auto max-w-2xl text-lg"
        >
          Have a project in mind or just want to say hello? I&apos;d love to
          hear from you.
        </motion.p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column: Contact Form + Meeting Scheduler */}
        <div className="space-y-8 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MeetingScheduler />
          </motion.div>
        </div>

        {/* Right column: Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ContactInfo />
        </motion.div>
      </div>
    </section>
  );
}
