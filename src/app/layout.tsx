import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Short link",
  description: "Made by Guilherme Aranega",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 flex justify-center items-center text-white">
        {children}
      </body>
    </html>
  );
}
