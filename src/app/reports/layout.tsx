import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Analyze library performance through circulation trends, availability, and key statistics.",
};

export default function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
