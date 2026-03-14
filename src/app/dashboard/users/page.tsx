import { Button } from '@/components/ui/button';

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Collaborators</h1>
        <Button>Invite User</Button>
      </div>
      <div className="text-muted-foreground flex items-center justify-center rounded-lg border border-dashed p-8 shadow-sm">
        List of authorized users and collaborators.
      </div>
    </div>
  );
}
