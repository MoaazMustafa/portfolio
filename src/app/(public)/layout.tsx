import { Footer, Navbar } from '@/components';

export default function PublicLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
