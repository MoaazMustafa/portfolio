import { Icon } from '@iconify/react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPublicProjectBySlug } from '@/lib/actions/project';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

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

// ─── Custom Markdown Components ───────────────────────────────────────────────
const markdownComponents: React.ComponentProps<
  typeof ReactMarkdown
>['components'] = {
  h1: ({ children }) => (
    <h1 className="text-foreground mt-8 mb-4 text-3xl font-bold tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-foreground mt-6 mb-3 text-2xl font-bold tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-foreground mt-5 mb-2 text-xl font-semibold">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-foreground mt-4 mb-2 text-lg font-semibold">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground mb-4 leading-7">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-muted-foreground mb-4 list-disc space-y-1 pl-6">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-muted-foreground mb-4 list-decimal space-y-1 pl-6">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  strong: ({ children }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-muted-foreground italic">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-primary/40 text-muted-foreground my-4 border-l-4 pl-4 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border/50 my-6" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    return isInline ? (
      <code
        className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className="font-mono text-sm" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-muted border-border/50 my-4 overflow-x-auto rounded-xl border p-4">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl">
      <table className="border-border w-full border-collapse border text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  th: ({ children }) => (
    <th className="border-border text-foreground border px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-border text-muted-foreground border px-4 py-2">
      {children}
    </td>
  ),
};
// ──────────────────────────────────────────────────────────────────────────────

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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {project.content.replace(/\\n/g, '\n')}
            </ReactMarkdown>
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
