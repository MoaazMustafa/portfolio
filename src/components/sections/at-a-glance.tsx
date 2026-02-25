'use client';

import type { COBEOptions } from 'cobe';
import { motion, useInView } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiMailFill,
  RiTwitterXFill,
} from 'react-icons/ri';
import {
  SiBootstrap,
  SiCss3,
  SiExpress,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';

import { Globe } from '@/components/ui/globe';
import { useColorTheme } from '@/hooks';
import { cn } from '@/lib/utils';

// ── Globe config for Lahore, Pakistan (31.5497, 74.3436) ──
const LAHORE_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0.1,
  theta: -0.3,
  dark: 1,
  diffuse: 2,
  mapSamples: 16000,
  mapBrightness: 2,
  scale: 1.05,
  baseColor: [0.8, 0.8, 0.8],
  markerColor: [1, 1, 1],
  glowColor: [0.5, 0.5, 0.5],
  markers: [{ location: [31.5497, 74.3436], size: 0.1 }],
};

// ── Tech stacks from GitHub README ──
const STACKS_ROW_1 = [
  { icon: SiReact, label: 'React' },
  { icon: SiNextdotjs, label: 'Next.js' },
  { icon: SiTypescript, label: 'TypeScript' },
  { icon: SiJavascript, label: 'JavaScript' },
  { icon: SiHtml5, label: 'HTML5' },
  { icon: SiCss3, label: 'CSS3' },
  { icon: SiTailwindcss, label: 'Tailwind CSS' },
  { icon: SiBootstrap, label: 'Bootstrap' },
];

const STACKS_ROW_2 = [
  { icon: SiNodedotjs, label: 'Node.js' },
  { icon: SiExpress, label: 'Express.js' },
  { icon: SiPrisma, label: 'Prisma' },
  { icon: SiPostgresql, label: 'PostgreSQL' },
  { icon: SiMongodb, label: 'MongoDB' },
  { icon: SiSupabase, label: 'Supabase' },
  { icon: SiGit, label: 'Git' },
  { icon: SiFigma, label: 'Figma' },
];

// ── Social links ──
const SOCIALS = [
  {
    icon: RiGithubFill,
    href: 'https://github.com/MoaazMustafa',
    label: 'GitHub',
  },
  {
    icon: RiLinkedinBoxFill,
    href: 'https://www.linkedin.com/in/moaaz-mustafa-20a742367',
    label: 'LinkedIn',
  },
  {
    icon: RiTwitterXFill,
    href: 'https://x.com/_moaaz_mustafa',
    label: 'Twitter',
  },
  {
    icon: RiMailFill,
    href: 'mailto:contactwithmoaaz@gmail.com',
    label: 'Email',
  },
];

// ── Shared card wrapper ──
function BentoCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/10 bg-white/3 p-4 lg:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Marquee row for stacks ──
function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof STACKS_ROW_1;
  reverse?: boolean;
}) {
  const duplicated = [...items, ...items];
  return (
    <div
      className="group relative flex overflow-hidden py-2"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div
        className={cn(
          'flex min-w-max shrink-0 gap-8',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          'group-hover:paused',
        )}
      >
        {duplicated.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex items-center justify-center"
            title={item.label}
          >
            <item.icon className="size-10 text-white/80 transition-colors hover:text-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main section ──
export function AtAGlance() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { resolvedTheme } = useTheme();
  const { currentColors } = useColorTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0, 0, 0.58, 1] as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0, 0, 0.58, 1] as const },
    },
  };

  // Theme-aware GitHub heatmap colors using the current color theme
  const githubTheme = {
    dark: [
      '#161b22',
      `color-mix(in srgb, ${currentColors.primary} 25%, #161b22)`,
      `color-mix(in srgb, ${currentColors.primary} 50%, #161b22)`,
      `color-mix(in srgb, ${currentColors.primary} 75%, #161b22)`,
      currentColors.primary,
    ] as [string, string, string, string, string],
    light: [
      '#ebedf0',
      `color-mix(in srgb, ${currentColors.primary} 25%, #ebedf0)`,
      `color-mix(in srgb, ${currentColors.primary} 50%, #ebedf0)`,
      `color-mix(in srgb, ${currentColors.primary} 75%, #ebedf0)`,
      currentColors.primary,
    ] as [string, string, string, string, string],
  };

  return (
    <section ref={sectionRef} className="mx-auto my-24 max-w-7xl px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section title */}
        <motion.h2
          variants={itemVariants}
          className="text-center font-sans text-3xl font-semibold text-white sm:text-4xl"
        >
          At a Glance
        </motion.h2>

        {/* Bento grid — 12-col flat grid, 2 rows */}
        <div className="mt-12 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-12">
          {/* ── Row 1, Left: Location / Globe ── */}
          <motion.div variants={itemVariants} className="md:col-span-7">
            <BentoCard className="h-[340px]">
              <div className="relative z-10 flex items-center gap-2 text-sm text-white/70">
                <MapPin className="size-4" />
                <span>
                  Lahore,{' '}
                  <span className="font-semibold text-white">Pakistan</span>
                </span>
              </div>
              <div
                className="absolute inset-x-0 bottom-[-190px] h-[388px]"
                style={{
                  maskImage:
                    'radial-gradient(circle at 50% 50%, rgb(0,0,0) 60%, rgb(0,0,0,0) 70%)',
                  WebkitMaskImage:
                    'radial-gradient(circle at 50% 50%, rgb(0,0,0) 60%, rgb(0,0,0,0) 70%)',
                }}
              >
                <Globe config={LAHORE_GLOBE_CONFIG} />
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 1, Right: GitHub Contributions ── */}
          <motion.div variants={itemVariants} className="min-w-0 md:col-span-5">
            <BentoCard className="flex h-[340px] flex-col">
              <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
                <RiGithubFill className="size-4" />
                <span>
                  <span className="font-semibold text-white">GitHub</span>{' '}
                  Contributions
                </span>
              </div>
              <div
                className="flex min-w-0 flex-1 items-start"
                style={{ maxWidth: '100%', overflow: 'hidden' }}
              >
                <GitHubCalendar
                  username="MoaazMustafa"
                  blockSize={10}
                  blockMargin={3}
                  blockRadius={2}
                  showMonthLabels={false}
                  colorScheme={(resolvedTheme as 'light' | 'dark') ?? 'dark'}
                  theme={githubTheme}
                  style={{ maxWidth: '100%', overflow: 'hidden' }}
                />
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 2, Left: Stacks ── */}
          <motion.div variants={itemVariants} className="md:col-span-5">
            <BentoCard className="h-60">
              <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
                <Zap className="size-4" />
                <span className="font-semibold text-white">Stacks</span>
              </div>
              <div className="flex flex-col gap-2">
                <MarqueeRow items={STACKS_ROW_1} />
                <MarqueeRow items={STACKS_ROW_2} reverse />
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 2, Middle: Connect ── */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <BentoCard className="flex h-60 flex-col">
              <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
                <RiMailFill className="size-4" />
                <span className="font-semibold text-white">Connect</span>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="grid grid-cols-2 gap-3">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group/social flex size-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                    >
                      <social.icon className="size-6 text-white/60 transition-colors group-hover/social:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 2, Right: Stats ── */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <BentoCard className="flex h-60 flex-col items-center justify-center text-center">
              <div
                className="mb-3 text-5xl font-bold"
                style={{ color: currentColors.primary }}
              >
                5+
              </div>
              <p className="text-sm font-medium text-white/70">
                Production Apps
              </p>
              <p className="text-sm text-white/50">Deployed & Maintained</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  Full Stack
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  Hafiz e Quran
                </span>
              </div>
            </BentoCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
