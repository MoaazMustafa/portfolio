import type { Job } from '@/components/job-search';

export const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote / New York",
    type: "Full-time",
    experience: "5+ years",
    salary: "$120,000 - $160,000",
    remote: true,
    urgent: true,
    description: "Lead development of scalable web applications using modern technologies. Work closely with product and design teams to deliver exceptional user experiences. You'll be responsible for architecting solutions that can handle millions of users while maintaining excellent performance and reliability.",
    requirements: [
      "5+ years of full-stack development experience",
      "Expert knowledge of React, Node.js, and TypeScript",
      "Experience with cloud platforms (AWS/GCP/Azure)",
      "Strong understanding of database design and optimization",
      "Experience with microservices architecture",
      "Knowledge of testing frameworks and CI/CD pipelines"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work hours and remote-first culture",
      "Professional development budget ($5,000/year)",
      "Latest MacBook Pro and tech setup",
      "Unlimited PTO policy",
      "Home office stipend",
      "Annual company retreats"
    ],
    responsibilities: [
      "Design and implement scalable backend services",
      "Build responsive frontend interfaces with React",
      "Collaborate with product managers and designers",
      "Mentor junior developers and conduct code reviews",
      "Participate in architecture decisions and technical planning",
      "Optimize application performance and reliability"
    ],
    qualifications: [
      "Experience with GraphQL and REST APIs",
      "Knowledge of containerization (Docker, Kubernetes)",
      "Familiarity with monitoring and observability tools",
      "Open source contributions",
      "Experience in a startup environment",
      "Strong communication and leadership skills"
    ],
    posted: "2 days ago",
    team: "Core Platform",
    applicationCount: 47
  },
  {
    id: 2,
    title: "UI/UX Designer",
    department: "Design",
    location: "San Francisco / Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "$90,000 - $130,000",
    remote: true,
    urgent: true,
    description: "Create beautiful, intuitive user interfaces and experiences that delight our users. Collaborate with engineering and product teams to bring designs to life and shape the future of our products.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma, Sketch, or Adobe Creative Suite",
      "Strong portfolio showcasing web and mobile designs",
      "Understanding of design systems and accessibility",
      "Experience with user research and testing",
      "Knowledge of frontend technologies (HTML/CSS)"
    ],
    benefits: [
      "Creative freedom and design autonomy",
      "Access to latest design tools and software",
      "Opportunity to shape product direction",
      "Conference and workshop attendance budget",
      "Collaborative and inspiring work environment",
      "Flexible work arrangements",
      "Health and wellness benefits",
      "Stock options"
    ],
    responsibilities: [
      "Design user-centered interfaces for web and mobile",
      "Create and maintain design systems",
      "Conduct user research and usability testing",
      "Collaborate with developers on implementation",
      "Present designs to stakeholders and gather feedback",
      "Stay updated with design trends and best practices"
    ],
    qualifications: [
      "Experience with prototyping tools",
      "Knowledge of accessibility standards (WCAG)",
      "Familiarity with agile development processes",
      "Strong visual design skills",
      "Experience with A/B testing",
      "Portfolio demonstrating problem-solving approach"
    ],
    posted: "1 week ago",
    team: "Product Design",
    applicationCount: 32
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Austin / Remote",
    type: "Full-time",
    experience: "4+ years",
    salary: "$110,000 - $150,000",
    remote: true,
    urgent: false,
    description: "Build and maintain our cloud infrastructure to ensure scalability, security, and reliability of our systems as we grow. Work with cutting-edge technologies and help architect solutions that support millions of users.",
    requirements: [
      "4+ years of DevOps/Infrastructure experience",
      "Expertise in Docker, Kubernetes, and CI/CD",
      "Experience with AWS/GCP cloud platforms",
      "Knowledge of monitoring and alerting systems",
      "Strong scripting skills (Python, Bash, etc.)",
      "Experience with Infrastructure as Code"
    ],
    benefits: [
      "Work with cutting-edge infrastructure technologies",
      "Opportunity to architect scalable systems",
      "Flexible schedule and remote work options",
      "Professional certification support",
      "Stock options and performance bonuses",
      "Learning and development budget",
      "Health insurance and retirement benefits",
      "Equipment and home office allowance"
    ],
    responsibilities: [
      "Design and implement CI/CD pipelines",
      "Manage cloud infrastructure and deployments",
      "Monitor system performance and reliability",
      "Implement security best practices",
      "Automate operational tasks and processes",
      "Collaborate with development teams on deployment strategies"
    ],
    qualifications: [
      "Experience with Terraform or CloudFormation",
      "Knowledge of security tools and practices",
      "Familiarity with service mesh technologies",
      "Experience with log aggregation and analysis",
      "Understanding of network and security concepts",
      "Strong problem-solving and troubleshooting skills"
    ],
    posted: "3 days ago",
    team: "Platform",
    applicationCount: 28
  },
  {
    id: 4,
    title: "Mobile Developer",
    department: "Engineering",
    location: "Los Angeles / Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "$100,000 - $140,000",
    remote: true,
    urgent: false,
    description: "Develop native and cross-platform mobile applications that provide exceptional user experiences. Focus on performance, user experience, and platform-specific optimizations while working with a talented team.",
    requirements: [
      "3+ years of mobile development experience",
      "Proficiency in React Native or Flutter",
      "Experience with iOS/Android native development",
      "Knowledge of mobile app deployment and testing",
      "Understanding of mobile UI/UX principles",
      "Experience with mobile performance optimization"
    ],
    benefits: [
      "Work on apps used by millions of users",
      "Latest mobile devices for testing",
      "Opportunity to influence mobile strategy",
      "Mentorship and career growth programs",
      "Competitive compensation and benefits",
      "Flexible work hours and location",
      "Professional development opportunities",
      "Team building events and activities"
    ],
    responsibilities: [
      "Develop cross-platform mobile applications",
      "Optimize app performance and user experience",
      "Implement native platform features",
      "Collaborate with designers on UI implementation",
      "Write unit and integration tests",
      "Participate in code reviews and technical discussions"
    ],
    qualifications: [
      "Experience with mobile state management",
      "Knowledge of mobile security best practices",
      "Familiarity with mobile analytics and crash reporting",
      "Understanding of app store submission processes",
      "Experience with mobile testing frameworks",
      "Strong attention to detail and user experience"
    ],
    posted: "5 days ago",
    team: "Mobile",
    applicationCount: 19
  },
  {
    id: 5,
    title: "Product Manager",
    department: "Product",
    location: "Seattle / Hybrid",
    type: "Full-time",
    experience: "4+ years",
    salary: "$130,000 - $170,000",
    remote: false,
    urgent: false,
    description: "Drive product strategy and roadmap while working cross-functionally to deliver products that delight users and drive business growth. Lead initiatives from conception to launch and beyond.",
    requirements: [
      "4+ years of product management experience",
      "Strong analytical and data-driven mindset",
      "Experience with agile development methodologies",
      "Excellent communication and leadership skills",
      "Understanding of technical concepts and constraints",
      "Experience with user research and product analytics"
    ],
    benefits: [
      "Shape the future of our products",
      "Work with world-class engineering and design teams",
      "Access to user research and analytics tools",
      "Opportunity for rapid career advancement",
      "Comprehensive benefits and equity package",
      "Professional development and training",
      "Flexible hybrid work arrangement",
      "Executive coaching and mentorship"
    ],
    responsibilities: [
      "Define product vision and strategy",
      "Prioritize features based on user needs and business goals",
      "Work closely with engineering and design teams",
      "Conduct user research and analyze product metrics",
      "Communicate product plans to stakeholders",
      "Lead product launches and go-to-market strategies"
    ],
    qualifications: [
      "MBA or equivalent advanced degree preferred",
      "Experience with B2B or B2C product management",
      "Knowledge of product analytics tools",
      "Strong presentation and storytelling skills",
      "Experience managing product backlogs",
      "Understanding of market research and competitive analysis"
    ],
    posted: "1 week ago",
    team: "Product Strategy",
    applicationCount: 41
  },
  {
    id: 6,
    title: "Junior Frontend Developer",
    department: "Engineering",
    location: "Chicago / Remote",
    type: "Full-time",
    experience: "1-2 years",
    salary: "$70,000 - $90,000",
    remote: true,
    urgent: false,
    description: "Join our frontend team to build responsive, accessible web applications. Perfect opportunity for a developer looking to grow their skills in a supportive and collaborative environment.",
    requirements: [
      "1-2 years of frontend development experience",
      "Knowledge of HTML, CSS, JavaScript, and React",
      "Understanding of responsive design principles",
      "Eagerness to learn and grow in a fast-paced environment",
      "Basic understanding of version control (Git)",
      "Familiarity with modern build tools"
    ],
    benefits: [
      "Mentorship from senior developers",
      "Opportunity to work on diverse projects",
      "Learning and development stipend",
      "Collaborative and supportive team culture",
      "Clear path for career progression",
      "Competitive entry-level compensation",
      "Remote work flexibility",
      "Health and wellness benefits"
    ],
    responsibilities: [
      "Develop responsive web interfaces",
      "Implement designs with attention to detail",
      "Write clean, maintainable code",
      "Participate in code reviews and team meetings",
      "Learn new technologies and best practices",
      "Collaborate with designers and backend developers"
    ],
    qualifications: [
      "Portfolio of personal or school projects",
      "Basic understanding of web accessibility",
      "Familiarity with CSS preprocessors",
      "Knowledge of testing fundamentals",
      "Strong problem-solving skills",
      "Good communication and teamwork abilities"
    ],
    posted: "4 days ago",
    team: "Frontend",
    applicationCount: 23
  }
];

export function getJobById(id: number): Job | undefined {
  return jobs.find(job => job.id === id);
}

export function getAllJobs(): Job[] {
  return jobs;
}