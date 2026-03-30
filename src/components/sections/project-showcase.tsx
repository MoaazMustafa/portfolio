import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { ProjectCard } from '@/components/sections/project-card';
import { Button } from '@/components/ui/button';
import { getFeaturedProjects } from '@/lib/actions/project';

export async function ProjectShowcase() {
  const projects = await getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <section className="relative py-20 lg:py-32">
      <div className="relative container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-orbitron relative mb-6 inline-block text-4xl font-black sm:text-5xl lg:text-6xl">
            <span className="from-primary via-primary-400 to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Some of my recent work showcasing my expertise in building modern
            web applications
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block"
            >
              <ProjectCard project={project} index={index} />
            </Link>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className="mt-12 text-center">
          <Link href="/projects">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
