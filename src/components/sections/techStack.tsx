import { TechStackClient } from '@/components/sections/tech-stack-client';
import { getPublicTechnologies } from '@/lib/actions/technology';

export async function TechStack() {
  const technologies = await getPublicTechnologies();

  if (technologies.length === 0) return null;

  // Group by category
  const categoryMap = new Map<
    string,
    { id: string; name: string; icon: string | null; category: string }[]
  >();

  for (const tech of technologies) {
    const existing = categoryMap.get(tech.category) ?? [];
    existing.push({
      id: tech.id,
      name: tech.name,
      icon: tech.icon,
      category: tech.category,
    });
    categoryMap.set(tech.category, existing);
  }

  const categories = Array.from(categoryMap.entries()).map(
    ([label, techs]) => ({
      label,
      techs,
    }),
  );

  const allTechs = technologies.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    category: t.category,
  }));

  return <TechStackClient categories={categories} allTechs={allTechs} />;
}
