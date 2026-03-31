'use client';

import { Icon } from '@iconify/react';
import {
  ArrowRight,
  Briefcase,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Data ──

const socialLinks = [
  { icon: Github, href: 'https://github.com/moaazmustafa', label: 'GitHub' },
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
  'Building modern, scalable web applications with **Next.js 15** and **React 19**',
  'Exploring AI-powered developer tools and integrating them into everyday workflows',
  'Learning advanced UI/UX patterns, design systems, and typography for the web',
  'Working with clients and teams to deliver polished digital products',
];

const favoriteTech = [
  { name: 'Next.js', icon: 'logos:nextjs-icon' },
  { name: 'React', icon: 'logos:react' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
  { name: 'Node.js', icon: 'logos:nodejs-icon' },
  { name: 'PostgreSQL', icon: 'logos:postgresql' },
  { name: 'Prisma', icon: 'logos:prisma' },
];

const DARK_ICONS = new Set(['logos:nextjs-icon', 'logos:prisma']);

const experiences = [
  {
    role: 'Full-Stack Developer',
    company: 'Freelance / Contract',
    companyUrl: '',
    location: 'Remote',
    period: 'JAN 2024 — PRESENT',
    duration: '1 yr+',
    description:
      'Building end-to-end web applications for clients using Next.js, TypeScript, and modern cloud infrastructure.',
    bullets: [
      'Designed and shipped multiple production applications with Next.js App Router, Prisma, and PostgreSQL.',
      'Implemented authentication flows, dashboard systems, and CMS platforms from scratch.',
      'Collaborated directly with stakeholders to translate requirements into polished user interfaces.',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Previous Role',
    companyUrl: '',
    location: 'Lahore, Pakistan',
    period: 'JUN 2022 — DEC 2023',
    duration: '1 yr 6 mos',
    description:
      'Developed responsive web applications and contributed to component libraries using React and Tailwind CSS.',
    bullets: [
      'Built reusable component systems and contributed to design system documentation.',
      'Improved site performance and Core Web Vitals scores across multiple projects.',
      'Mentored junior developers on React patterns and modern CSS techniques.',
    ],
  },
  {
    role: 'Web Development Intern',
    company: 'Early Career',
    companyUrl: '',
    location: 'Lahore, Pakistan',
    period: 'JAN 2021 — MAY 2022',
    duration: '1 yr 4 mos',
    description:
      'Started the journey into professional web development, learning the fundamentals of HTML, CSS, JavaScript, and React.',
    bullets: [
      'Completed multiple projects covering the full frontend development lifecycle.',
      'Learned version control with Git and collaborative development workflows.',
    ],
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

// ── Component ──

export function AboutPage() {
  return (
    <div className="relative">
      <HeroImageSection />
      <BioSection />
      <ExperienceSection />
      <GrowthSection />
      <ConnectSection />
    </div>
  );
}

// ── Hero: Image collage with overlay (Clarence-style) ──

function HeroImageSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-0">
      {/* Noise / grain overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      <div className="container mx-auto max-w-5xl px-4">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="font-orbitron text-4xl font-black sm:text-5xl lg:text-6xl">
            <span className="from-primary via-primary-400 to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
              About Me
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            A story of growth and discovery
          </p>
        </motion.div>

        {/* Image Collage Grid (Clarence-style asymmetric grid) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto grid max-w-4xl grid-cols-12 gap-3"
        >
          {/* Main large image */}
          <div className="col-span-7 row-span-2">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
              <Image
                src="/img/Moaaz Mustafa.jpeg"
                alt="Moaaz Mustafa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 58vw"
                priority
              />
              <div className="from-background/60 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
            </div>
          </div>

          {/* Secondary image */}
          <div className="col-span-5">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
              <Image
                src="/img/IMG-20240924-WA0072 (1).jpg"
                alt="Moaaz at work"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
              <div className="from-background/40 absolute inset-0 bg-linear-to-t to-transparent" />
            </div>
          </div>

          {/* Accent card filling remaining space */}
          <div className="col-span-5 flex items-center">
            <div className="border-border bg-card/90 flex w-full flex-col gap-2 rounded-2xl border p-5 backdrop-blur-sm">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                Based in
              </span>
              <span className="text-foreground flex items-center gap-2 text-lg font-bold">
                <MapPin className="text-primary h-5 w-5" />
                Lahore, Pakistan
              </span>
              <span className="text-muted-foreground text-sm">
                Available for remote work worldwide
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Bio Section (Clarence-style: name, role, bio text, tech icons, "what I'm up to") ──

function BioSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Name & Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
            Moaaz Mustafa
          </h2>
          <p className="text-primary mt-1 text-lg font-medium">
            Full-Stack Developer & Software Engineer
          </p>
        </motion.div>

        {/* Bio paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 space-y-4"
        >
          <p className="text-muted-foreground text-lg leading-relaxed">
            I am a full-stack developer and designer, specializing in the MERN
            stack and Next.js. My educational background includes a software
            engineering degree, fostering a strong technical aptitude.
            Throughout my career, I have contributed to diverse projects while
            honing my coding skills and collaborative abilities.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            My dedication to clean code and smooth user experiences drives my
            work. I am eager to take on new challenges to stay updated with
            industry trends. If you are looking for a dedicated professional
            with a combination of technical expertise and design sensibility, I
            look forward to learning how I can enhance your team.
          </p>
        </motion.div>

        {/* Favorite tech stack - inline icon row (Clarence-style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <p className="text-muted-foreground mb-4 text-sm">
            Current favorite tech stack:
          </p>
          <div className="flex flex-wrap gap-3">
            {favoriteTech.map((tech) => (
              <div
                key={tech.name}
                className="border-border bg-card/80 group hover:border-primary/30 flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200 hover:shadow-sm"
                title={tech.name}
              >
                <Icon
                  icon={tech.icon}
                  className={cn(
                    'h-5 w-5',
                    DARK_ICONS.has(tech.icon) && 'dark:invert',
                  )}
                />
                <span className="text-foreground text-sm font-medium">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What I'm up to now - Clarence style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="text-foreground mb-4 text-2xl font-bold">
            What I&apos;m up to now
          </h3>
          <ul className="space-y-3">
            {currentActivities.map((activity, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                className="text-muted-foreground flex items-start gap-3 text-base leading-relaxed"
              >
                <span className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span
                  dangerouslySetInnerHTML={{
                    __html: activity.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-foreground font-semibold">$1</strong>',
                    ),
                  }}
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

// ── Experience Section (Clarence-style: vertical timeline with company cards) ──

function ExperienceSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-orbitron text-foreground text-3xl font-bold sm:text-4xl">
            Experiences
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="bg-border absolute top-0 bottom-0 left-1.75 w-px" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-10"
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    'absolute top-2 left-0 h-3.75 w-3.75 rounded-full border-3',
                    index === 0
                      ? 'bg-primary border-primary shadow-primary/30 shadow-md'
                      : 'bg-background border-primary/40',
                  )}
                />

                {/* Experience Card */}
                <div className="border-border bg-card/60 group hover:shadow-primary/5 relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  {/* Subtle gradient on hover */}
                  <div className="from-primary/3 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative">
                    {/* Role & Company */}
                    <h3 className="text-foreground text-xl font-bold">
                      {exp.role}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-primary flex items-center gap-1.5 font-medium">
                        <Briefcase className="h-4 w-4" />
                        {exp.company}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground flex items-center gap-1 text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        {exp.location}
                      </span>
                    </div>

                    {/* Period & Duration */}
                    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-mono text-xs tracking-wider">
                        {exp.period}
                      </span>
                      <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs">
                        {exp.duration}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Bullet points */}
                    <ul className="mt-4 space-y-2">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="text-muted-foreground flex items-start gap-2.5 text-sm leading-relaxed"
                        >
                          <span className="bg-primary/60 mt-2 h-1 w-1 shrink-0 rounded-full" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Growth Section (year cards - Clarence's "Learn about my growth") ──

function GrowthSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-orbitron text-foreground text-3xl font-bold sm:text-4xl">
            My Growth Journey
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Every year brings new challenges and lessons. Here&apos;s how
            it&apos;s going.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {growthTimeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="border-border bg-card/60 group hover:shadow-primary/5 relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Hover gradient */}
              <div className="from-primary/4 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <span
                  className={cn(
                    'font-orbitron text-2xl font-black',
                    index === 0 ? 'text-primary' : 'text-muted-foreground/50',
                  )}
                >
                  {item.year}
                </span>
                <h3 className="text-foreground mt-2 text-lg font-bold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Connect / Social Links ──

function ConnectSection() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-orbitron text-foreground mb-3 text-3xl font-bold sm:text-4xl">
            Let&apos;s Connect
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
            I&apos;m always open to new opportunities, collaborations, or just a
            friendly chat about tech.
          </p>

          {/* Social Icons */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                whileHover={{ scale: 1.08 }}
                className="border-border bg-card/80 hover:border-primary/30 hover:bg-primary/5 flex items-center gap-2 rounded-lg border px-4 py-2.5 transition-all duration-200"
                aria-label={social.label}
              >
                <social.icon className="text-primary h-5 w-5" />
                <span className="text-foreground text-sm font-medium">
                  {social.label}
                </span>
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
