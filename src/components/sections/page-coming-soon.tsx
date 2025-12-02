'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface PageComingSoonProps {
  readonly title: string;
  readonly description?: string;
}

export function PageComingSoon({
  title,
  description = 'This page is currently under construction. Check back soon for updates!',
}: PageComingSoonProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Animated Icon */}
        <div className="relative mb-8 inline-flex">
          <div className="from-primary/20 to-primary/10 animate-pulse rounded-full bg-linear-to-br p-6">
            <Sparkles className="text-primary h-16 w-16" aria-hidden="true" />
          </div>
          <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-2xl" />
        </div>

        {/* Title */}
        <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8 text-lg">{description}</p>

        {/* CTA */}
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground group">
            <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
