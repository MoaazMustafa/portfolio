'use client';

import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { useColorTheme } from '@/hooks';
import { cn } from '@/lib/utils';

const TECH_CATEGORIES = [
  {
    label: 'All',
    techs: [] as { name: string; icon: string }[], // populated at runtime
  },
  {
    label: 'Frontend',
    techs: [
      { name: 'React', icon: 'logos:react' },
      { name: 'Next.js', icon: 'logos:nextjs-icon' },
      { name: 'TypeScript', icon: 'logos:typescript-icon' },
      { name: 'JavaScript', icon: 'logos:javascript' },
      { name: 'HTML5', icon: 'logos:html-5' },
      { name: 'CSS3', icon: 'logos:css-3' },
      { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
      { name: 'Bootstrap', icon: 'logos:bootstrap' },
      { name: 'Framer Motion', icon: 'logos:framer' },
      { name: 'Shadcn/ui', icon: 'simple-icons:shadcnui' },
      { name: 'Material UI', icon: 'logos:material-ui' },
      { name: 'Ant Design', icon: 'logos:ant-design' },
      { name: 'GSAP', icon: 'logos:greensock' },
      { name: 'Node Package Manager', icon: 'logos:npm-icon' },
      { name: 'ThreeJS', icon: 'logos:threejs' },
    ],
  },
  {
    label: 'Backend',
    techs: [
      { name: 'Node.js', icon: 'logos:nodejs-icon' },
      { name: 'Express.js', icon: 'logos:express' },
      { name: 'Prisma', icon: 'logos:prisma' },
      { name: 'GraphQL', icon: 'logos:graphql' },
      { name: 'REST API', icon: 'mdi:api' },
      { name: 'WebSockets', icon: 'logos:websocket' },
      { name: 'OpenAI', icon: 'logos:openai' },
      { name: 'Socket.io', icon: 'logos:socket-io' },
    ],
  },
  {
    label: 'Database',
    techs: [
      { name: 'PostgreSQL', icon: 'logos:postgresql' },
      { name: 'MongoDB', icon: 'logos:mongodb-icon' },
      { name: 'MySQL', icon: 'logos:mysql' },
      { name: 'Supabase', icon: 'logos:supabase-icon' },
      { name: 'Redis', icon: 'logos:redis' },
      { name: 'Firebase', icon: 'logos:firebase' },
    ],
  },
  {
    label: 'Mobile',
    techs: [
      { name: 'React Native', icon: 'logos:react' },
      { name: 'Flutter', icon: 'logos:flutter' },
      { name: 'Expo', icon: 'logos:expo' },
    ],
  },
  {
    label: 'DevOps & Tools',
    techs: [
      { name: 'Git', icon: 'logos:git-icon' },
      { name: 'GitHub', icon: 'logos:github-icon' },
      { name: 'Docker', icon: 'logos:docker-icon' },
      { name: 'Vercel', icon: 'logos:vercel-icon' },
      { name: 'AWS', icon: 'logos:aws' },
      { name: 'Cloudinary', icon: 'logos:cloudinary-icon' },
      { name: 'Figma', icon: 'logos:figma' },
      { name: 'VS Code', icon: 'logos:visual-studio-code' },
      { name: 'Visual Studio', icon: 'logos:visual-studio' },
      { name: 'Antigravity', icon: 'material-symbols:antigravity-outline' },
      { name: 'Postman', icon: 'logos:postman-icon' },
      { name: 'Adobe XD', icon: 'logos:adobe-xd' },
      { name: 'Adobe Photoshop', icon: 'logos:adobe-photoshop' },
      { name: 'MacOS', icon: 'catppuccin:macos' },
      { name: 'Windows', icon: 'devicon:windows11' },
      { name: 'Linux', icon: 'logos:linux-tux' },
      { name: 'Jira', icon: 'logos:jira' },
      { name: 'Clickup', icon: 'simple-icons:clickup' },
      { name: 'Discord', icon: 'logos:discord-icon' },
      { name: 'Slack', icon: 'logos:slack-icon' },
      { name: 'Google Chrome', icon: 'devicon:chrome' },
      { name: 'Safari Browser', icon: 'devicon:safari' },
      { name: 'Canva', icon: 'devicon:canva' },
    ],
  },
] as const;

// Collect all techs for the "All" tab
const ALL_TECHS = TECH_CATEGORIES.slice(1).flatMap((c) => c.techs);

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
]);

export function TechStack() {
  const { currentColors } = useColorTheme();
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  const activeTechs = useMemo(
    () =>
      activeTab === 'All'
        ? ALL_TECHS
        : (TECH_CATEGORIES.find((c) => c.label === activeTab)?.techs ??
          ALL_TECHS),
    [activeTab],
  );

  return (
    <section className="relative py-16 lg:py-24">
      <div className="relative container mx-auto max-w-5xl px-4">
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
          {TECH_CATEGORIES.map((cat) => {
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

        {/* Tech icons grid — compact, icon-only with hover tooltip */}
        <motion.div layout className="flex flex-wrap justify-center gap-2">
          <AnimatePresence mode="popLayout">
            {activeTechs.map((tech) => {
              const isHovered = hovered === tech.name;
              return (
                <motion.div
                  key={tech.name}
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
                  onMouseEnter={() => setHovered(tech.name)}
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
                    <Icon
                      icon={tech.icon}
                      className={cn(
                        'h-7 w-7 transition-all duration-200',
                        isHovered ? 'scale-110' : 'opacity-90',
                        DARK_ICONS.has(tech.icon) &&
                          'dark:brightness-[1.8] dark:invert',
                      )}
                    />
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
