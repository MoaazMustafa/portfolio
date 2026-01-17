'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/MoaazMustafa',
    icon: Github,
  },
  {
    name: 'Twitter',
    href: 'https://x.com/itx_moaaz',
    icon: Twitter,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/moaazmustafa',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@moaazmustafa',
    icon: Youtube,
  },
];

const navigationLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

const resourceLinks = [
  { name: 'Blog', href: '/blog' },
  { name: 'Uses', href: '/uses' },
  { name: 'Resume', href: '/Resume.pdf', external: true },
];

const moreLinks = [
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Footer glow background */}
      <motion.div
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="bg-primary-600 absolute right-10 -bottom-20 hidden h-80 w-120 rounded-full blur-3xl dark:block"
      />
      <motion.div
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          delay: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="bg-primary-300 absolute -right-15 -bottom-20 hidden h-65 w-105 rounded-full blur-3xl dark:block"
      />
      <motion.div
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          delay: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -right-20 -bottom-25 hidden h-50 w-95 rounded-full bg-white blur-3xl dark:block"
      />

      {/* Main Footer Card */}
      <div className="mx-auto max-w-7xl">
        <div className="bg-background/30 border-foreground/8 relative overflow-hidden rounded-3xl border p-8 backdrop-blur-sm sm:p-10 lg:p-12">
          {/* Subtle gradient overlay */}
          <div className="from-foreground/2 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent" />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="space-y-6">
                {/* Logo */}
                <div className="group flex items-center gap-3">
                  <div className="bg-foreground/5 ring-foreground/10 group-hover:ring-foreground/20 relative flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-all duration-300">
                    <Code2 className="text-foreground h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-foreground text-xl font-bold tracking-tight">
                    Maaz Mustafa
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                  Full Stack Developer crafting exceptional digital experiences
                  with modern technologies.
                </p>

                {/* Contact Email */}
                <a
                  href="mailto:contactwithmoaaz@gmail.com"
                  className="group hover:text-primary-600 text-muted-foreground inline-flex items-center gap-2 text-sm transition-colors duration-200"
                >
                  <Mail className="h-4 w-4" />
                  <span>contactwithmoaaz@gmail.com</span>
                </a>

                {/* Location */}
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Pakistan</span>
                </div>

                {/* Status Badge */}
                <div className="bg-foreground/5 ring-foreground/10 text-muted-foreground inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  Available for work
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
              {/* Navigation */}
              <div className="space-y-4">
                <h4 className="text-foreground text-sm font-semibold">
                  Navigation
                </h4>
                <ul className="space-y-3">
                  {navigationLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-primary-600 text-muted-foreground text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h4 className="text-foreground text-sm font-semibold">
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
                          className="group hover:text-primary-600 text-muted-foreground inline-flex items-center gap-1 text-sm transition-colors duration-200"
                        >
                          {link.name}
                          <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="hover:text-primary-600 text-muted-foreground text-sm transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* More */}
              <div className="space-y-4">
                <h4 className="text-foreground text-sm font-semibold">More</h4>
                <ul className="space-y-3">
                  {moreLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-primary-600 text-muted-foreground text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div className="space-y-4">
                <h4 className="text-foreground text-sm font-semibold">
                  Social
                </h4>
                <ul className="space-y-3">
                  {socialLinks.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:text-primary-600 text-muted-foreground inline-flex items-center gap-2 text-sm transition-colors duration-200"
                      >
                        <social.icon className="h-4 w-4" />
                        {social.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
