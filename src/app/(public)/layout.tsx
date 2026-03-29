import { DevToolsProvider, Footer, Navbar } from '@/components';

export default function PublicLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
      <DevToolsProvider>
        <Navbar />
        <main id="main-content" className="relative">
          {children}
        </main>
        <Footer />
      </DevToolsProvider>
    </>
  );
}
