import { getServerSession } from 'next-auth/next';

import { SettingsForm } from '@/components/dashboard/settings-form';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-xl font-semibold">Unable to Load Settings</h2>
        <p className="text-muted-foreground mt-2">
          You must be signed in to manage account settings.
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      title: true,
      bio: true,
      image: true,
      githubUrl: true,
      linkedinUrl: true,
      websiteUrl: true,
    },
  });

  if (!user || !user.email) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-xl font-semibold">Profile Not Found</h2>
        <p className="text-muted-foreground mt-2">
          Your account record was not found in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsForm
        email={user.email}
        initialValues={{
          name: user.name || '',
          title: user.title || '',
          bio: user.bio || '',
          image: user.image || '',
          githubUrl: user.githubUrl || '',
          linkedinUrl: user.linkedinUrl || '',
          websiteUrl: user.websiteUrl || '',
        }}
      />
    </div>
  );
}
