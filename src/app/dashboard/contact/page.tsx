import { ContactSubmissions } from '@/components/dashboard/contact-submissions';
import { getContactSubmissions } from '@/lib/actions/contact';

export const metadata = {
  title: 'Contact Submissions - Dashboard',
  description: 'View contact form submissions',
};

export default async function ContactDashboardPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Contact Submissions
        </h1>
        <p className="text-muted-foreground">
          Messages from your contact form
        </p>
      </div>
      <ContactSubmissions initialSubmissions={submissions} />
    </div>
  );
}
