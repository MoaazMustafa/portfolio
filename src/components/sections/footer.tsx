'use client';

import {
  ArrowUpRight,
  Code2,
  Coffee,
  Github,
  Heart,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';

import { Dock, DockIcon } from '@/components/ui/dock';
import { SparklesCore } from '@/components/ui/sparkles';
import { cn } from '@/lib/utils';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/MoaazMustafa',
    icon: Github,
    color: 'hover:text-[#333] dark:hover:text-white',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/moaazmustafa',
    icon: Linkedin,
    color: 'hover:text-[#0A66C2]',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/moaazmustafa',
    icon: Twitter,
    color: 'hover:text-[#1DA1F2]',
  },
  {
    name: 'Email',
    href: 'mailto:contact@moaazmustafa.com',
    icon: Mail,
    color: 'hover:text-primary',
  },
];

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

const resourceLinks = [
  { name: 'Blog', href: '/blog' },
  { name: 'Uses', href: '/uses' },
  { name: 'Resume', href: '/resume.pdf', external: true },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Sparkles Background Effect */}
      <div className="pointer-events-none absolute inset-0">
        <SparklesCore
          id="footer-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={50}
          particleColor="#acec00"
          className="h-full w-full"
        />
      </div>

      {/* Decorative background elements */}
      {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-1/2 -left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div> */}

      {/* Top gradient border */}
      <div className="via-primary/50 h-px w-full bg-linear-to-r from-transparent to-transparent" />

      <div className="relative">
        <div className="container mx-auto px-6 pt-9 pb-2 lg:pt-12 lg:pb-4">
          {/* Main Footer Grid */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-5">
              <div className="space-y-6">
                {/* Logo */}
                <div className="group flex items-center gap-3">
                  <div className="from-primary/20 to-primary/5 ring-primary/20 group-hover:ring-primary/40 relative flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ring-1 transition-all duration-300">
                    <Code2 className="text-primary h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    <div className="bg-primary/10 absolute inset-0 rounded-xl opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
                      Maaz Mustafa
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Full Stack Developer
                    </p>
                  </div>
                </div>

                {/* Description with Text Animation */}
                <div className="max-w-sm">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Crafting exceptional digital experiences with modern
                    technologies. Passionate about building products that make a
                    difference.
                  </p>
                </div>

                {/* Social Links Dock */}
                <div className="flex justify-start">
                  <Dock>
                    {socialLinks.map((social) => (
                      <DockIcon key={social.name} href={social.href}>
                        <social.icon
                          className={cn(
                            'h-full w-full p-2 text-zinc-700 transition-colors dark:text-zinc-300',
                            social.color,
                          )}
                        />
                      </DockIcon>
                    ))}
                  </Dock>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              {/* Navigation */}
              <div className="space-y-4">
                <h4 className="text-foreground text-base font-bold">
                  Navigation
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group text-muted-foreground hover:text-foreground inline-flex items-center text-base transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="bg-primary absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h4 className="text-foreground text-base font-bold">
                  Resources
                </h4>
                <ul className="space-y-3">
                  {resourceLinks.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-base transition-colors duration-200"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="bg-primary absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                          </span>
                          <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="group text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors duration-200"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="bg-primary absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get in Touch */}
              <div className="col-span-2 flex flex-col items-center justify-center space-y-4 overflow-hidden rounded-4xl sm:col-span-1">
                {/* <DitherShader
                  src="/31a71a762a1fa2f82f95cb795987fc41.jpeg"
                  gridSize={1}
                  ditherMode="bayer"
                  colorMode="duotone"
                  //use colors that match the site theme black and white
                  primaryColor={dark ? '#1a1a1a' : '#f0f0f0'}
                  secondaryColor="#acec00"
                  threshold={0.45}
                  className="h-72 w-[400px] sm:h-80 sm:w-[500px]"
                /> */}
                {/* <h4 className="text-foreground text-sm font-semibold">
                  Get in Touch
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Have a project in mind? Let&apos;s create something amazing
                  together.
                </p>
                <Link
                  href="/contact"
                  className="group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Say Hello
                </Link> */}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="via-border/50 my-10 h-px bg-linear-to-r from-transparent to-transparent" />

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright */}
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-2 sm:text-left">
              <p className="text-muted-foreground text-sm">
                © {currentYear} Maaz Mustafa
              </p>
              <span className="text-muted-foreground/50 hidden sm:inline">
                •
              </span>
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                Built with
                <Heart className="h-3.5 w-3.5 animate-pulse fill-red-500 text-red-500" />
                and
                <Coffee className="h-3.5 w-3.5 text-amber-600" />
              </p>
            </div>

            {/* Tech Stack Badge */}
            <div className="bg-muted/50 text-muted-foreground ring-border/50 flex items-center gap-2 rounded-full px-4 py-2 text-xs ring-1">
              <span className="font-medium">Next.js</span>
              <span className="text-border">•</span>
              <span className="font-medium">TypeScript</span>
              <span className="text-border">•</span>
              <span className="font-medium">Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
