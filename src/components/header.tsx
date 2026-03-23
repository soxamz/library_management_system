"use client";

import { usePathname } from "next/navigation";
import { MobileSidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

const breadcrumbs: Record<string, string> = {
  "/": "Overview",
  "/books": "Books",
  "/members": "Members",
  "/issued": "Issued Books",
  "/overdue": "Overdue Books",
  "/reports": "Reports",
};

export function Header() {
  const pathname = usePathname();
  const title = breadcrumbs[pathname] || "Library Management System";

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <MobileSidebar />
          <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
            {title}
          </h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
