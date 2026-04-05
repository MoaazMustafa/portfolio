import { NextResponse } from 'next/server';

import { getAssistantPublicState } from '@/lib/assistant';

export const dynamic = 'force-dynamic';

/**
 * Public endpoint returning only the fields the floating widget needs:
 * enabled state, name, greeting, and suggested prompts.
 */
export async function GET() {
  try {
    const state = await getAssistantPublicState();
    return NextResponse.json(state);
  } catch {
    return NextResponse.json(
      { enabled: true, name: 'Moaaz', greeting: '', suggestedPrompts: [] },
      { status: 500 },
    );
  }
}
