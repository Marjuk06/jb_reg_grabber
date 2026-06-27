import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Master Student Dashboard",
  description: "Merge and analyze student records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen relative flex flex-col overflow-x-hidden lg:overflow-hidden z-0 bg-[#030303] text-gray-100 font-sans antialiased">
        <div className="glow-blue"></div>
        <div className="glow-purple"></div>
        {children}
      </body>
    </html>
  );
}
