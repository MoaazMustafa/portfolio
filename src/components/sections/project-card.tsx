'use client';

import { Icon } from '@iconify/react';
import { Calendar, ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Dark icons that need inversion
const DARK_ICONS = new Set([
  'logos:nextjs-icon',
  'logos:express',
  'logos:prisma',
  'logos:framer',
  'logos:socket-io',
  'logos:github-icon',
  'logos:vercel-icon',
  'logos:expo',
  'simple-icons:shadcnui',
  'mdi:api',
  'logos:threejs',
]);

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    status: string;
    isFeatured: boolean;
    startDate: Date;
    endDate: Date | null;
    technologies: { id: string; name: string; icon: string | null }[];
    categories: { id: string; name: string }[];
  };
  index: number;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_STYLES: Record<string, string> = {
  Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Under_Development: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Planned: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  On_Hold: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const statusLabel = project.status.replace('_', ' ');
  const statusClass =
    STATUS_STYLES[project.status] ??
    'bg-muted text-muted-foreground border-border';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-white/15 hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
    >
      {/* Cover image area */}
      <div className="relative h-52 w-full overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="from-primary/20 via-primary/5 to-background flex h-full items-center justify-center bg-linear-to-br">
            <span className="text-primary/15 text-7xl font-black select-none">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top-right chips: status + featured */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {project.isFeatured && (
            <Badge className="border border-yellow-500/30 bg-yellow-500/15 text-[10px] font-semibold text-yellow-400 shadow-sm">
              ★ Featured
            </Badge>
          )}
          <Badge
            className={cn(
              'border text-[10px] font-semibold shadow-sm',
              statusClass,
            )}
          >
            {statusLabel}
          </Badge>
        </div>

        {/* Action icons — appear on hover, top-left */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Tech icon row — pinned at bottom of image */}
        {project.technologies.length > 0 && (
          <div className="absolute right-3 bottom-3 left-3 flex gap-1.5 overflow-hidden">
            {project.technologies.slice(0, 6).map((tech) => (
              <div
                key={tech.id}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black/40 backdrop-blur-sm"
                title={tech.name}
              >
                {tech.icon ? (
                  <Icon
                    icon={tech.icon}
                    className={cn(
                      'h-4 w-4',
                      DARK_ICONS.has(tech.icon) && 'brightness-[1.8] invert',
                    )}
                  />
                ) : (
                  <span className="text-[9px] font-bold text-white/70">
                    {tech.name.slice(0, 2)}
                  </span>
                )}
              </div>
            ))}
            {project.technologies.length > 6 && (
              <div className="flex h-7 shrink-0 items-center justify-center rounded-md bg-black/40 px-1.5 backdrop-blur-sm">
                <span className="text-[10px] font-medium text-white/70">
                  +{project.technologies.length - 6}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        {/* Categories */}
        {project.categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <span
                key={cat.id}
                className="text-primary text-[10px] font-semibold tracking-wider uppercase"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-foreground group-hover:text-primary mb-2 text-lg leading-snug font-bold transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Footer: date range */}
        <div className="border-border/40 flex items-center gap-2 border-t pt-3">
          <Calendar className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-muted-foreground text-xs">
            {formatDate(project.startDate)}
            {project.endDate
              ? ` — ${formatDate(project.endDate)}`
              : ' — Present'}
          </span>
        </div>
      </div>

      {/* Subtle glow on hover */}
      <div className="from-primary/10 pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.article>
  );
}
