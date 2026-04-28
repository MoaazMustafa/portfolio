import { Icon } from '@iconify/react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getPublicProjectBySlug,
  getPublicProjects,
} from '@/lib/actions/project';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Disable generateStaticParams in build to avoid DB connection issue
// export async function generateStaticParams() {
//   const projects = await getPublicProjects();
//   return projects.map((p) => ({ slug: p.slug }));
// }

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found | Moaaz Mustafa' };
  }

  return {
    title: `${project.title} | Moaaz Mustafa`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      ...(project.coverImage && { images: [project.coverImage] }),
    },
  };
}

export const revalidate = 3600;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) notFound();

  return (
    <section className="relative py-20 lg:py-32">
      <div className="relative container mx-auto max-w-4xl px-4">
        {/* Back link */}
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-1 text-sm transition-colors"
        >
          &larr; All Projects
        </Link>

        {/* Cover Image */}
        {project.coverImage && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Title + Meta */}
        <h1 className="font-orbitron mb-4 text-3xl font-black sm:text-4xl lg:text-5xl">
          <span className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
            {project.title}
          </span>
        </h1>

        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
          {project.description}
        </p>

        {/* Status + Date */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Badge variant="outline">{project.status.replace('_', ' ')}</Badge>
          {project.isFeatured && (
            <Badge className="bg-primary/10 text-primary border-primary/20 border">
              Featured
            </Badge>
          )}
          <span className="text-muted-foreground text-sm">
            {new Date(project.startDate).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
            {project.endDate
              ? ` — ${new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
              : ' — Present'}
          </span>
        </div>

        {/* Links */}
        <div className="mb-10 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Live Demo
              </Button>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">View Source</Button>
            </a>
          )}
        </div>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="mb-10">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <div
                  key={tech.id}
                  className="border-border bg-card/60 flex items-center gap-2 rounded-lg border px-3 py-2"
                >
                  {tech.icon && <Icon icon={tech.icon} className="h-5 w-5" />}
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {project.categories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.categories.map((cat) => (
                <Badge key={cat.id} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Collaborators */}
        {project.collaborators.length > 0 && (
          <div className="mb-10">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Collaborators
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.collaborators.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5"
                >
                  {user.image && (
                    <Image
                      src={user.image}
                      alt={user.name ?? ''}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extended content (markdown/rich text) */}
        {project.content && (
          <div className="border-border/50 border-t pt-10">
            <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
              {project.content}
            </div>
          </div>
        )}

        {/* Project images gallery */}
        {project.images.length > 0 && (
          <div className="mt-10">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Gallery
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-video overflow-hidden rounded-xl"
                >
                  <Image
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
