import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700']
});


export const metadata: Metadata = {
  title: "Evently",
  description: "Event management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={poppins.variable}
      >
        {children}
      </body>
    </html>
  );
}
