'use client';

import { Icon } from '@iconify/react';
import {
  ArrowRight,
  Briefcase,
  Code2,
  Github,
  Linkedin,
  Mail,
  Palette,
  Rocket,
  Twitter,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Data ──

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/moaazmustafa',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com/in/moaazmustafa',
    label: 'LinkedIn',
  },
  {
    icon: Twitter,
    href: 'https://twitter.com/moaazmustafa',
    label: 'Twitter',
  },
  {
    icon: Mail,
    href: 'mailto:contactwithmoaaz@gmail.com',
    label: 'Email',
  },
];

const currentActivities = [
  {
    icon: Code2,
    title: 'Building with Next.js',
    description:
      'Crafting modern, performant web applications using Next.js 15, React 19, and TypeScript.',
  },
  {
    icon: Rocket,
    title: 'Exploring AI Tools',
    description:
      'Integrating AI-powered tools into development workflows to boost productivity and creativity.',
  },
  {
    icon: Palette,
    title: 'UI/UX & Design Systems',
    description:
      'Learning design principles, typography, and building consistent component libraries.',
  },
  {
    icon: Briefcase,
    title: 'Freelance & Collaboration',
    description:
      'Working with clients and teams to deliver polished digital products and experiences.',
  },
];

const growthTimeline = [
  {
    year: '2026',
    title: 'Scaling Up',
    description:
      'Focusing on scalable architectures, cloud infrastructure, and leading development teams on larger projects.',
  },
  {
    year: '2025',
    title: 'Sharpening the Craft',
    description:
      'Deepened expertise in full-stack development. Started exploring AI tools, open-source contributions, and advanced UI/UX patterns.',
  },
  {
    year: '2024',
    title: 'Professional Growth',
    description:
      'Took on more complex projects, improved code quality practices, and explored diverse tech stacks beyond the MERN ecosystem.',
  },
  {
    year: '2023',
    title: 'Finding My Flow',
    description:
      'Became comfortable with production-level development. Built multiple client projects and refined collaborative workflows.',
  },
  {
    year: '2022',
    title: 'Going Full-Stack',
    description:
      'Expanded from frontend into backend development with Node.js, Express, and databases. Started freelancing.',
  },
  {
    year: '2021',
    title: 'First Steps',
    description:
      'Began the coding journey. Built small side projects, learned HTML, CSS, JavaScript, and React fundamentals.',
  },
];

const favoriteTech = [
  { name: 'Next.js', icon: 'logos:nextjs-icon', darkInvert: true },
  { name: 'React', icon: 'logos:react' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
  { name: 'Node.js', icon: 'logos:nodejs-icon' },
  { name: 'PostgreSQL', icon: 'logos:postgresql' },
  { name: 'Prisma', icon: 'logos:prisma', darkInvert: true },
  { name: 'Figma', icon: 'logos:figma' },
];

// ── Helpers ──

const DARK_ICONS = new Set(['logos:nextjs-icon', 'logos:prisma']);

// ── Component ──

export function AboutPage() {
  return (
    <div className="relative">
      {/* Hero / Introduction */}
      <IntroSection />

      {/* What I'm Currently Doing */}
      <CurrentlyDoingSection />

      {/* Growth Journey Timeline */}
      <GrowthTimelineSection />

      {/* Favorite Tech Stack */}
      <FavoriteTechSection />

      {/* Connect / Social Links */}
      <ConnectSection />
    </div>
  );
}

// ── Section 1: Introduction ──

function IntroSection() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase"
          >
            Who I am
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-orbitron text-4xl font-black sm:text-5xl lg:text-6xl"
          >
            <span className="from-primary via-primary-400 to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
              About Me
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg"
          >
            A story of growth, discovery, and passion for technology
          </motion.p>
        </motion.div>

        {/* Two-column: Photo + Bio */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="border-primary/20 shadow-primary/10 relative mx-auto aspect-square max-w-md overflow-hidden rounded-2xl border-4 shadow-2xl">
              <Image
                src="/img/Moaaz Mustafa.jpeg"
                alt="Moaaz Mustafa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="from-primary/20 absolute inset-0 bg-linear-to-t to-transparent" />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-foreground mb-1 text-3xl font-bold">
                Moaaz Mustafa
              </h2>
              <p className="text-primary text-lg font-medium">
                Full-Stack Developer & Software Engineer
              </p>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              I am an expert full-stack developer and designer, specializing in
              the MERN stack and Next.js. My educational background includes a
              software engineering degree, fostering a strong technical
              aptitude. Throughout my career, I have contributed to diverse
              projects while honing my coding skills and collaborative
              abilities.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              My dedication to clean code and smooth user experiences drives my
              work. I am eager to take on new challenges to stay updated with
              industry trends. If you are looking for a dedicated professional
              with a combination of technical expertise and design sensibility,
              I look forward to learning how I can enhance your team.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { value: '3+', label: 'Years of work' },
                { value: '50+', label: 'Projects' },
                { value: '30+', label: 'Happy clients' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-primary text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Section 2: What I'm Currently Doing ──

function CurrentlyDoingSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-orbitron text-foreground text-3xl font-bold sm:text-4xl">
            What I&apos;m Currently Doing
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
            Here&apos;s what I&apos;m focused on right now — building, learning,
            and growing every day.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {currentActivities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="border-border bg-card/80 group hover:shadow-primary/5 relative h-full overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                <div className="from-primary/5 to-primary/0 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex gap-4">
                  <div className="bg-primary/10 border-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
                    <activity.icon className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-foreground mb-1 text-lg font-semibold">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Growth Journey Timeline ──

function GrowthTimelineSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-orbitron text-foreground text-3xl font-bold sm:text-4xl">
            My Growth Journey
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
            Every year brings new challenges and lessons. Here&apos;s how the
            journey has unfolded so far.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="bg-border absolute top-0 bottom-0 left-4 w-px sm:left-8" />

          <div className="space-y-8">
            {growthTimeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex gap-6 pl-12 sm:pl-20"
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    'absolute top-1 left-2.5 h-3 w-3 rounded-full border-2 sm:left-6.5',
                    index === 0
                      ? 'bg-primary border-primary'
                      : 'bg-background border-primary/50',
                  )}
                />

                {/* Content */}
                <div className="border-border bg-card/80 hover:shadow-primary/5 flex-1 rounded-xl border p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'font-orbitron text-xs font-bold',
                        index === 0
                          ? 'border-primary text-primary'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      {item.year}
                    </Badge>
                    <h3 className="text-foreground text-lg font-semibold">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Favorite Tech Stack ──

function FavoriteTechSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-orbitron text-foreground text-3xl font-bold sm:text-4xl">
            Favorite Tech Stack
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
            The tools and technologies I reach for most when building products.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {favoriteTech.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="border-border bg-card/80 group hover:shadow-primary/5 relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="from-primary/5 to-primary/0 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <Icon
                  icon={tech.icon}
                  className={cn(
                    'h-10 w-10 transition-transform duration-300 group-hover:scale-110',
                    DARK_ICONS.has(tech.icon) && 'dark:invert',
                  )}
                />
              </div>
              <span className="text-foreground relative text-sm font-medium">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Connect / Social Links ──

function ConnectSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-orbitron text-foreground mb-3 text-3xl font-bold sm:text-4xl">
            Let&apos;s Connect
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
            I&apos;m always open to new opportunities, collaborations, or just a
            friendly chat about tech. Reach out through any of these channels.
          </p>

          {/* Social Icons */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-primary/10 hover:bg-primary/20 border-primary/20 flex h-14 w-14 items-center justify-center rounded-xl border transition-colors"
                aria-label={social.label}
              >
                <social.icon className="text-primary h-6 w-6" />
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground group"
              >
                Get In Touch
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                View My Work
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
