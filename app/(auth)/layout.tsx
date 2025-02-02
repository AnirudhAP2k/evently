import React from "react";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="h-screen w-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
            <div className="flex flex-col items-center justify-center w-full h-full">
                {children}
            </div>
        </main>
    );
  }