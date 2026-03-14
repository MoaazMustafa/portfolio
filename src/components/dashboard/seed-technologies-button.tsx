'use client';

import { Database, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { seedTechnologies } from '@/lib/actions/technology';

export function SeedTechnologiesButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const result = await seedTechnologies();
      if (result.success) {
        toast.success(`Seeded ${result.count} technologies successfully!`);
      }
    } catch {
      toast.error('Failed to seed technologies');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleSeed} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Database className="mr-2 h-4 w-4" />
      )}
      Seed Defaults
    </Button>
  );
}
