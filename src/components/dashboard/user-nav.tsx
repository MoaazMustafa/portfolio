'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export function UserNav({ email }: { email?: string | null }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-muted-foreground hidden text-sm sm:inline-block">
        {email}
      </span>
      <Button
        variant="destructive"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign out
      </Button>
    </div>
  );
}
