'use client';

import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const stats = [
  { value: '3+', label: 'Years of work' },
  { value: '50+', label: 'Completed projects' },
  { value: '30+', label: 'Satisfied Customers' },
];

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

export function About() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase"
          >
            Who I am
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-orbitron text-4xl font-black sm:text-5xl lg:text-6xl"
          >
            <span className="from-primary via-primary-400 to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
              About Me
            </span>
          </motion.h2>
        </motion.div>

        {/* Main Content */}
        <div className="mb-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="border-primary/20 shadow-primary/10 relative aspect-square overflow-hidden rounded-2xl border-4 shadow-2xl">
              <Image
                src="/img/IMG-20240924-WA0072 (1).jpg"
                alt="Moaaz Mustafa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="from-primary/20 absolute inset-0 bg-linear-to-t to-transparent" />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 space-y-6 lg:order-2"
          >
            <div>
              <h3 className="text-foreground mb-4 text-3xl font-bold">
                Moaaz Mustafa
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I am an expert full-stack developer and designer, specializing
                in the MERN stack and specializing in Next.js. My educational
                background includes a software engineering degree, fostering a
                strong technical aptitude. Throughout my career, I have
                contributed to diverse projects while honing my coding skills
                and collaborative abilities.
              </p>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                My dedication to clean code and smooth user experiences drives
                my work. I am eager to take on new challenges to stay updated
                with industry trends. If you are looking for a dedicated
                professional with a combination of technical expertise and
                design sensibility, I look forward to learning how I can enhance
                your team.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="bg-primary/10 hover:bg-primary/20 border-primary/20 flex h-12 w-12 items-center justify-center rounded-lg border transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="text-primary h-5 w-5" />
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/about">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Get In Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card/50 border-border group hover:shadow-primary/10 relative overflow-hidden rounded-xl border p-8 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="from-primary/5 to-primary/0 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="text-primary mb-2 text-4xl font-bold lg:text-5xl">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="from-primary/5 to-primary/5 pointer-events-none absolute inset-0 bg-linear-to-b via-transparent opacity-50" />
    </section>
  );
}
