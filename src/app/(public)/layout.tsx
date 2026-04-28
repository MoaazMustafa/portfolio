import { DevToolsProvider, Footer, Navbar } from '@/components';
import { AskMoaazWidget } from '@/components/ask-moaaz-widget';
import { getAssistantPublicState } from '@/lib/assistant';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const assistantState = await getAssistantPublicState();

  return (
    <>
      <DevToolsProvider>
        <Navbar showAssistantButton={assistantState.enabled} />
        <main id="main-content" className="relative">
          {children}
        </main>
        <Footer />
        <AskMoaazWidget />
      </DevToolsProvider>
    </>
  );
}
