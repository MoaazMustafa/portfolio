import { NextResponse } from 'next/server';

export const revalidate = 86400; // ISR – revalidate every 24 h

interface Achievement {
  name: string;
  tier: string;
  badgeUrl: string;
}

export async function GET() {
  try {
    const res = await fetch(
      'https://github.com/MoaazMustafa?tab=achievements',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html',
        },
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) return NextResponse.json([]);

    const html = await res.text();
    return NextResponse.json(parseAchievements(html));
  } catch {
    return NextResponse.json([]);
  }
}

// ── Parse achievement cards from GitHub profile HTML ──
function parseAchievements(html: string): Achievement[] {
  const achievements: Achievement[] = [];
  const seen = new Set<string>();

  // The page contains <details> cards with `data-achievement-slug="…"`.
  // Each card has an <img class="achievement-badge-card" /> and an optional
  // <span class="achievement-tier-label …">x2</span>.
  const sections = html.split('data-achievement-slug=');

  for (const section of sections.slice(1)) {
    // Badge image + name from alt text
    const imgMatch = section.match(
      /<img\s[^>]*?src="([^"]+)"[^>]*?alt="Achievement:\s*([^"]+)"[^>]*?>/i,
    );
    if (!imgMatch) continue;

    const badgeUrl = imgMatch[1];
    const name = imgMatch[2].trim();

    if (seen.has(name)) continue;
    seen.add(name);

    // Tier badge (e.g. "x2") inside nearby <span>
    let tier = '';
    const tierMatch = section.substring(0, 1500).match(/>x(\d+)</i);
    if (tierMatch) tier = `x${tierMatch[1]}`;

    achievements.push({ name, tier, badgeUrl });
  }

  return achievements;
}
