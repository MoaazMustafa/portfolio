'use client';

import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import Orb from '@/components/orb';
import { Button } from '@/components/ui/button';
import TextType from '@/components/ui/text-type';
import VariableProximity from '@/components/ui/variable-proximity';

const roles = [
  'Software Engineer',
  'Frontend Engineer',
  'MERN Stack Developer',
  'Web Designer',
];

export function Hero() {
  //   const handleComplete = () => {
  //     setTimeout(() => {
  //       setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
  //       setKey((prev) => prev + 1);
  //     }, 2000);
  //   };
  const containerRef = useRef(null);
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="container mx-auto mt-12 max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Right Side - Image with Orb Background - Shows first on mobile */}
          <div className="relative flex items-center justify-center lg:order-2 lg:justify-end">
            <div className="relative h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] lg:h-[600px] lg:w-[600px]">
              {/* Orb Background - Sibling */}
              <div className="absolute inset-0 z-0">
                <Orb hue={75} hoverIntensity={2} rotateOnHover={true} />
              </div>

              {/* Profile Image Container - Sibling with pointer-events-none */}
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="shadow-primary/20 relative h-64 w-64 overflow-hidden rounded-full shadow-2xl sm:h-80 sm:w-80 lg:h-87 lg:w-87">
                  <Image
                    src="/31a71a762a1fa2f82f95cb795987fc41.jpeg"
                    alt="Moaaz Mustafa"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                  />
                  {/* Overlay gradient */}
                  <div className="from-primary/10 absolute inset-0 bg-linear-to-t to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Left Side - Personal Details */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:order-1 lg:space-y-8 lg:text-left">
            {/* Greeting */}
            <div
              className="space-y-2"
              ref={containerRef}
              style={{ position: 'relative' }}
            >
              <p className="text-primary text-lg font-medium sm:text-xl">
                Hello, I&apos;m
              </p>
              <VariableProximity
                label="MOAAZ MUSTAFA"
                className="variable-proximity-demo font-orbitron text-foreground text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
                fromFontVariationSettings="'wght' 100"
                toFontVariationSettings="'wght' 1000"
                containerRef={containerRef}
                radius={150}
                falloff="exponential"
              />
            </div>

            {/* Animated Roles - TextType */}
            <div className="flex items-center justify-center gap-2 text-lg lg:justify-start sm:text-xl">
              <span className="text-muted-foreground text-lg">I&apos;m a</span>
              <div className="relative flex h-8 items-center sm:h-10">
                <TextType
                  //   key={key}
                  className="font-semibold"
                  text={roles}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                  //   reverseMode={true}
                  as={'h2'}
                />
              </div>
            </div>

            {/* Short Bio */}
            <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed lg:mx-0 sm:text-lg">
              Passionate about crafting elegant digital experiences and turning
              ideas into reality through code. I specialize in building modern,
              scalable web applications with a focus on user experience and
              clean architecture.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link href="/projects">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                >
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Get In Touch
                </Button>
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <a
                href="https://github.com/MoaazMustafa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/in/moaazmustafa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/moaazmustafa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="mailto:contactwithmoaaz@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="from-background to-background/0 pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t" />
    </section>
  );
}
