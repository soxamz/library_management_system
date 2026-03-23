import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issued Books",
  description:
    "Track issued books, return status, and circulation history across members.",
};

export default function IssuedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
