import * as z from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .refine(
      (email) => {
        const domain = email.split('@')[1];
        // Block disposable/temp email domains
        const blocked = ['tempmail.com', 'throwaway.email', 'mailinator.com', 'guerrillamail.com'];
        return !blocked.includes(domain);
      },
      { message: 'Please use a non-disposable email address' },
    ),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const meetingBookingSchema = z.object({
  slotId: z.string().min(1, 'Please select a time slot'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  message: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type MeetingBookingFormValues = z.infer<typeof meetingBookingSchema>;
