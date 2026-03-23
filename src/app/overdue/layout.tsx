import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overdue Books",
  description:
    "Monitor overdue books, calculate fines, and process delayed returns quickly.",
};

export default function OverdueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
