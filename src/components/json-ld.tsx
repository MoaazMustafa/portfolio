const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.moaazmustafa.dev';

function PersonSchema() {
  const person = {
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: 'Moaaz Mustafa',
    alternateName: [
      'Moaz Mustafa',
      'Muaz Mustafa',
      'Maaz Mustafa',
      'MOAAZ',
      'moaazmustafa',
      'MOaaz Mustafa',
    ],
    url: baseUrl,
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/img/Moaaz%20Mustafa.jpeg`,
      width: 512,
      height: 512,
    },
    jobTitle: 'Software Engineer',
    description:
      'Full Stack Developer and Software Engineer specializing in Next.js, React, TypeScript, and the MERN stack. Crafting innovative digital solutions with modern web technologies.',
    email: 'contactwithmoaaz@gmail.com',
    sameAs: [
      'https://github.com/MoaazMustafa',
      'https://linkedin.com/in/moaazmustafa',
      'https://x.com/itx_moaaz',
      'https://youtube.com/@moaazmustafa',
      'https://instagram.com/itx_moaaz',
    ],
    knowsAbout: [
      'Software Engineering',
      'Full Stack Development',
      'Next.js',
      'React',
      'TypeScript',
      'JavaScript',
      'MERN Stack',
      'Node.js',
      'PostgreSQL',
      'Prisma',
      'Tailwind CSS',
      'Web Design',
      'UI/UX Design',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
    },
  };

  return person;
}

export function JsonLd() {
  const person = PersonSchema();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Moaaz Mustafa - Software Engineer & Tech Enthusiast',
        description:
          'Portfolio of Moaaz Mustafa — a software engineer crafting innovative digital solutions with modern web technologies.',
        author: { '@id': `${baseUrl}/#person` },
        publisher: { '@id': `${baseUrl}/#person` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${baseUrl}/#profilepage`,
        url: baseUrl,
        name: 'Moaaz Mustafa Portfolio',
        description:
          'Explore the portfolio of Moaaz Mustafa — projects, skills, and experiences in software engineering.',
        mainEntity: { '@id': `${baseUrl}/#person` },
        isPartOf: { '@id': `${baseUrl}/#website` },
        dateCreated: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
        inLanguage: 'en-US',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
