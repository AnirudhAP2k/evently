import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex h-screen flex-col">
        <Navbar />
        <SessionProvider>
          <main className="flex-1">
            {children}
          </main>
        </SessionProvider>
        <Footer />
      </div>
    );
  }