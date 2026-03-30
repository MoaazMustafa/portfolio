import type { Metadata } from 'next';
import Link from 'next/link';

import { ProjectCard } from '@/components/sections/project-card';
import { getPublicProjects } from '@/lib/actions/project';

export const metadata: Metadata = {
  title: 'Projects | Moaaz Mustafa',
  description:
    'Explore innovative projects and solutions built by Moaaz Mustafa. Web applications, mobile apps, and more.',
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  if (projects.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-orbitron text-4xl font-black sm:text-5xl">
            <span className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Projects coming soon — check back shortly!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 lg:py-32">
      <div className="relative container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-orbitron mb-6 text-4xl font-black sm:text-5xl lg:text-6xl">
            <span className="from-primary via-primary-400 to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
              All Projects
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            A collection of my work — web apps, tools, and experiments
          </p>
        </div>

        {/* Grid */}
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
      </div>
    </section>
  );
}
