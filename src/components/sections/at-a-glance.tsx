'use client';

import type { COBEOptions } from 'cobe';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo, useRef, useState } from 'react';
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

// ── Base globe config for Lahore, Pakistan (31.5497, 74.3436) ──
// COBE coordinate system:
//   phi = horizontal rotation (longitude). 0 = prime meridian facing camera
//   theta > 0 = tilt forward, revealing northern hemisphere
// Lahore: 31.55°N, 74.34°E
//   phi  = 74.3436 × π/180 ≈ 1.297 (set via initialPhi)
//   theta = 0.55 to face ~31° north latitude
const LAHORE_GLOBE_BASE: Omit<COBEOptions, 'markerColor'> = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.55,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  scale: 1.05,
  baseColor: [0.3, 0.3, 0.3],
  glowColor: [0.15, 0.15, 0.15],
  markers: [{ location: [31.5497, 74.3436], size: 0.15 }],
};

// Initial phi to point at Lahore longitude
const LAHORE_INITIAL_PHI = 1.297;

// ── Tech stacks with brand colors ──
const STACKS_ROW_1 = [
  { icon: SiReact, label: 'React', color: '#61DAFB' },
  {
    icon: SiNextdotjs,
    label: 'Next.js',
    color: '#000000',
    darkColor: '#ffffff',
  },
  { icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
  { icon: SiJavascript, label: 'JavaScript', color: '#F7DF1E' },
  { icon: SiHtml5, label: 'HTML5', color: '#E34F26' },
  { icon: SiCss3, label: 'CSS3', color: '#1572B6' },
  { icon: SiTailwindcss, label: 'Tailwind CSS', color: '#06B6D4' },
  { icon: SiBootstrap, label: 'Bootstrap', color: '#7952B3' },
];

const STACKS_ROW_2 = [
  { icon: SiNodedotjs, label: 'Node.js', color: '#339933' },
  {
    icon: SiExpress,
    label: 'Express.js',
    color: '#000000',
    darkColor: '#ffffff',
  },
  { icon: SiPrisma, label: 'Prisma', color: '#2D3748' },
  { icon: SiPostgresql, label: 'PostgreSQL', color: '#4169E1' },
  { icon: SiMongodb, label: 'MongoDB', color: '#47A248' },
  { icon: SiSupabase, label: 'Supabase', color: '#3FCF8E' },
  { icon: SiGit, label: 'Git', color: '#F05032' },
  { icon: SiFigma, label: 'Figma', color: '#F24E1E' },
];

// ── Social links with brand colors ──
const SOCIALS = [
  {
    icon: RiGithubFill,
    href: 'https://github.com/MoaazMustafa',
    label: 'GitHub',
    color: '#000000',
    darkColor: '#ffffff',
  },
  {
    icon: RiLinkedinBoxFill,
    href: 'https://www.linkedin.com/in/moaaz-mustafa-20a742367',
    label: 'LinkedIn',
    color: '#0A66C2',
  },
  {
    icon: RiTwitterXFill,
    href: 'https://x.com/_moaaz_mustafa',
    label: 'Twitter',
    color: '#000000',
    darkColor: '#ffffff',
  },
  {
    icon: RiMailFill,
    href: 'mailto:contactwithmoaaz@gmail.com',
    label: 'Email',
    color: '#EA4335',
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
        'border-border bg-card/80 relative overflow-hidden rounded-xl border p-4 lg:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Marquee row for stacks with hover tooltip ──
function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof STACKS_ROW_1;
  reverse?: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const duplicated = [...items, ...items];
  const hoveredItem =
    hoveredIndex !== null ? items[hoveredIndex % items.length] : null;
  const inactiveColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)';

  // Pick the right color per theme
  const getColor = (item: (typeof items)[number]) =>
    isDark && item.darkColor ? item.darkColor : item.color;

  const hoveredColor = hoveredItem ? getColor(hoveredItem) : '#000';

  const handleIconHover = (
    index: number,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    setHoveredIndex(index);
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const iconRect = e.currentTarget.getBoundingClientRect();
      setTooltipX(iconRect.left - containerRect.left + iconRect.width / 2);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredIndex(null);
      }}
    >
      {/* Tooltip rendered OUTSIDE overflow-hidden so it stays visible */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key={hoveredItem.label}
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute -top-7 z-30 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold whitespace-nowrap shadow-lg"
            style={{
              left: tooltipX,
              backgroundColor: hoveredColor,
              color:
                hoveredColor === '#F7DF1E' ||
                hoveredColor === '#ffffff' ||
                hoveredColor === '#61DAFB' ||
                hoveredColor === '#06B6D4' ||
                hoveredColor === '#3FCF8E'
                  ? '#000'
                  : '#fff',
              boxShadow: `0 0 12px ${hoveredColor}60`,
            }}
          >
            {hoveredItem.label}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="flex overflow-x-hidden py-2"
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
          )}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {duplicated.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const itemColor = getColor(item);
            return (
              <div
                key={`${item.label}-${i}`}
                className="flex cursor-pointer items-center justify-center"
                style={{
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 200ms',
                }}
                onMouseEnter={(e) => handleIconHover(i, e)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <item.icon
                  className="size-10 transition-colors duration-200"
                  style={{
                    color: isHovered ? itemColor : inactiveColor,
                    filter: isHovered
                      ? `drop-shadow(0 0 6px ${itemColor}80)`
                      : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
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

  // Build globe config with primary-colored marker
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };
  const globeConfig = useMemo<COBEOptions>(
    () => ({
      ...LAHORE_GLOBE_BASE,
      markerColor: hexToRgb(currentColors.primary),
      dark: resolvedTheme === 'dark' ? 1 : 0,
      mapBrightness: resolvedTheme === 'dark' ? 6 : 1.2,
      baseColor: resolvedTheme === 'dark' ? [0.3, 0.3, 0.3] : [1, 1, 1],
      glowColor: resolvedTheme === 'dark' ? [0.15, 0.15, 0.15] : [1, 1, 1],
    }),
    [currentColors.primary, resolvedTheme],
  );

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
          className="text-foreground text-center font-sans text-3xl font-semibold sm:text-4xl"
        >
          At a Glance
        </motion.h2>

        {/* Bento grid — 12-col flat grid, 2 rows */}
        <div className="mt-12 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-12">
          {/* ── Row 1, Left: Location / Globe ── */}
          <motion.div variants={itemVariants} className="md:col-span-5">
            <BentoCard className="h-[340px]">
              <div className="text-muted-foreground relative z-10 flex items-center gap-2 text-sm">
                <MapPin className="size-4" />
                <span>
                  Lahore,{' '}
                  <span className="text-foreground font-semibold">
                    Pakistan
                  </span>
                </span>
              </div>
              <div
                className="absolute inset-x-0 bottom-[-170px] h-[388px]"
                style={{
                  maskImage:
                    'radial-gradient(circle at 50% 50%, rgb(0,0,0) 60%, rgb(0,0,0,0) 70%)',
                  WebkitMaskImage:
                    'radial-gradient(circle at 50% 50%, rgb(0,0,0) 60%, rgb(0,0,0,0) 70%)',
                }}
              >
                <Globe
                  key={`globe-${resolvedTheme}-${currentColors.primary}`}
                  config={globeConfig}
                  autoRotate={true}
                  initialPhi={LAHORE_INITIAL_PHI}
                />
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 1, Right: GitHub Contributions ── */}
          <motion.div variants={itemVariants} className="min-w-0 md:col-span-7">
            <BentoCard className="flex h-[340px] flex-col">
              <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                <RiGithubFill className="size-4" />
                <span>
                  <span className="text-foreground font-semibold">GitHub</span>{' '}
                  Contributions
                </span>
              </div>
              <div className="no-visible-scrollbar flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
                <GitHubCalendar
                  key={`cal-${resolvedTheme}-${currentColors.primary}`}
                  username="MoaazMustafa"
                  blockSize={14}
                  blockMargin={4}
                  blockRadius={3}
                  showMonthLabels={false}
                  colorScheme={(resolvedTheme as 'light' | 'dark') ?? 'dark'}
                  theme={githubTheme}
                />
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 2, Left: Stacks ── */}
          <motion.div variants={itemVariants} className="md:col-span-6">
            <BentoCard className="h-60">
              <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
                <Zap className="size-4" />
                <span className="text-foreground font-semibold">Stacks</span>
              </div>
              <div className="flex flex-col gap-2">
                <MarqueeRow items={STACKS_ROW_1} />
                <MarqueeRow items={STACKS_ROW_2} reverse />
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 2, Middle: Connect ── */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <BentoCard className="flex h-60 flex-col">
              <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
                <RiMailFill className="size-4" />
                <span className="text-foreground font-semibold">Connect</span>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="grid grid-cols-2 gap-3">
                  {SOCIALS.map((social) => {
                    const socialColor =
                      resolvedTheme === 'dark' && social.darkColor
                        ? social.darkColor
                        : social.color;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="group/social border-border bg-muted/50 relative flex size-14 items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-1"
                        style={
                          {
                            '--social-color': socialColor,
                          } as React.CSSProperties
                        }
                      >
                        <social.icon className="text-muted-foreground relative z-10 size-6 transition-all duration-300 group-hover/social:text-(--social-color) group-hover/social:drop-shadow-[0_0_8px_var(--social-color)]" />
                        {/* Glow background on hover */}
                        <span
                          className="absolute inset-0 rounded-xl opacity-0 transition-all duration-300 group-hover/social:opacity-100"
                          style={{
                            background: `radial-gradient(circle at center, ${socialColor}15 0%, transparent 70%)`,
                            boxShadow: `0 0 20px ${socialColor}30, inset 0 0 20px ${socialColor}10`,
                            border: `1px solid ${socialColor}40`,
                          }}
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* ── Row 2, Right: Highlights ── */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <BentoCard className="flex h-60 flex-col justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Zap className="size-4" />
                <span className="text-foreground font-semibold">
                  Highlights
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {[
                  { value: '5+', label: 'Production Apps' },
                  { value: '641+', label: 'GitHub Contributions' },
                  { value: '3+', label: 'Years Experience' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border-border/50 bg-muted/30 flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <span className="text-muted-foreground text-xs">
                      {stat.label}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: currentColors.primary }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                <span className="border-border bg-muted/50 text-muted-foreground rounded-full border px-2.5 py-0.5 text-[10px]">
                  Full Stack
                </span>
                <span className="border-border bg-muted/50 text-muted-foreground rounded-full border px-2.5 py-0.5 text-[10px]">
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
