import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
  description:
    "View and manage library members, contact details, and account status.",
};

export default function MembersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
