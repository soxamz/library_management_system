import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Manage the library catalog by adding, searching, and maintaining book records.",
};

export default function BooksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
