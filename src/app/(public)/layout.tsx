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
          {/* Single page-wide parallax background */}
          <div
            className="parallax-bg pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          {children}
        </main>
        <Footer />
      </DevToolsProvider>
    </>
  );
}
