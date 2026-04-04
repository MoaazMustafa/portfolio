'use client';

import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { useColorTheme } from '@/hooks';
import { cn } from '@/lib/utils';

// Icons that are black/dark and need to be inverted in dark mode
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
  'devicon:apple',
  'mdi:api',
  'logos:threejs',
]);

interface Tech {
  id: string;
  name: string;
  icon: string | null;
  category: string;
}

interface TechStackClientProps {
  categories: { label: string; techs: Tech[] }[];
  allTechs: Tech[];
}

export function TechStackClient({
  categories,
  allTechs,
}: TechStackClientProps) {
  const { currentColors } = useColorTheme();
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = useMemo(
    () => [{ label: 'All', techs: allTechs }, ...categories],
    [categories, allTechs],
  );

  const activeTechs = useMemo(
    () =>
      activeTab === 'All'
        ? allTechs
        : (tabs.find((t) => t.label === activeTab)?.techs ?? allTechs),
    [activeTab, tabs, allTechs],
  );

  return (
    <section className="relative py-16 lg:py-24">
      <div className="relative container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase"
          >
            What I work with
          </motion.p>
          <h2 className="font-orbitron text-3xl font-black sm:text-4xl lg:text-5xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.primary}aa)`,
              }}
            >
              Tech Stack
            </span>
          </h2>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {tabs.map((cat) => {
            const isActive = activeTab === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveTab(cat.label)}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="tech-tab-bg"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: currentColors.primary }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tech icons grid */}
        <motion.div layout className="flex flex-wrap justify-center gap-2">
          <AnimatePresence mode="popLayout">
            {activeTechs.map((tech) => {
              const isHovered = hovered === tech.id;
              return (
                <motion.div
                  key={tech.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="group relative flex items-center justify-center"
                  onMouseEnter={() => setHovered(tech.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.div
                    className={cn(
                      'flex h-14 w-14 cursor-default items-center justify-center rounded-xl border transition-all duration-200',
                      'border-border/60 bg-card/40 hover:bg-card hover:border-primary hover:border',
                    )}
                    style={{
                      boxShadow: isHovered
                        ? `0 0 16px ${currentColors.primary}30, 0 0 0 1px ${currentColors.primary}50`
                        : undefined,
                    }}
                    whileHover={{ y: -3, scale: 1.1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 20,
                    }}
                  >
                    {tech.icon && (
                      <Icon
                        icon={tech.icon}
                        className={cn(
                          'h-7 w-7 transition-all duration-200',
                          isHovered ? 'scale-110' : 'opacity-90',
                          DARK_ICONS.has(tech.icon) &&
                            'dark:brightness-[1.8] dark:invert',
                        )}
                      />
                    )}
                  </motion.div>

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.9 }}
                        transition={{ duration: 0.12 }}
                        className="pointer-events-none absolute -top-8 z-30 rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap shadow-lg"
                        style={{
                          backgroundColor: currentColors.primary,
                          color: '#fff',
                          boxShadow: `0 4px 12px ${currentColors.primary}40`,
                        }}
                      >
                        {tech.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
