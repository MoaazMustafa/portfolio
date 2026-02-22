'use client';

import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with real-time inventory management, payment integration, and admin dashboard.',
    image: '/img/project-1.jpg',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB'],
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: true,
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'Collaborative task management platform with real-time updates, drag-and-drop interface, and team collaboration features.',
    image: '/img/project-2.jpg',
    tags: ['React', 'Node.js', 'Socket.io', 'PostgreSQL'],
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: true,
  },
  {
    id: 3,
    title: 'AI Content Generator',
    description:
      'AI-powered content generation tool using OpenAI API for creating blog posts, social media content, and marketing copy.',
    image: '/img/project-3.jpg',
    tags: ['Next.js', 'OpenAI', 'Tailwind CSS', 'Prisma'],
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: true,
  },
];

export function ProjectShowcase() {
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-orbitron relative mb-6 inline-block text-4xl font-black sm:text-5xl lg:text-6xl"
          >
            <span className="from-primary via-primary-400 to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
              Featured Projects
            </span>
            <motion.div
              className="bg-primary absolute -bottom-2 left-0 h-1"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg"
          >
            Some of my recent work showcasing my expertise in building modern
            web applications
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* <GlassSurface
                borderRadius={16}
                backgroundOpacity={0.05}
                saturation={1.1}
                borderWidth={0.06}
                brightness={55}
                blur={12}
                displace={0.4}
                className="hover:shadow-primary/20 !h-full !w-full overflow-hidden p-4 transition-all duration-300 hover:shadow-2xl"
              > */}
              {/* Project Image */}
              <div className="from-primary/20 to-primary/5 relative h-48 w-full overflow-hidden bg-linear-to-br">
                <div className="flex h-full items-center justify-center">
                  <div className="text-primary/20 text-6xl font-bold">
                    {project.id}
                  </div>
                </div>
                {/* Overlay on Hover */}
                <motion.div
                  className="bg-primary/90 absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  initial={false}
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-primary-foreground/20 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors"
                  >
                    <Github className="h-6 w-6 text-white" />
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-primary-foreground/20 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors"
                  >
                    <ExternalLink className="h-6 w-6 text-white" />
                  </a>
                </motion.div>
              </div>

              {/* Project Details */}
              <div className="p-6">
                <h3 className="text-foreground group-hover:text-primary mb-3 text-xl font-bold transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 border text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </a>
                </div>
              </div>
              {/* </GlassSurface> */}
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link href="/projects">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
