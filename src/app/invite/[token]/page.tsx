import { OnboardingForm } from '@/components/onboarding-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getInvitation } from '@/lib/actions/invitation';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;
  const result = await getInvitation(token);

  if (result.error || !result.invitation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">
              Invalid Invitation
            </CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired. Please ask for a
              new one.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Set up your account
          </CardTitle>
          <CardDescription>
            Complete your profile to join the team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm token={token} email={result.invitation.email} />
        </CardContent>
      </Card>
    </div>
  );
}
