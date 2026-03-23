"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  BookMarked,
  AlertCircle,
  BarChart3,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Overview", href: "/", icon: BarChart3 },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Members", href: "/members", icon: Users },
  { name: "Issued Books", href: "/issued", icon: BookMarked },
  { name: "Overdue Books", href: "/overdue", icon: AlertCircle },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

type NavLinksProps = {
  onNavigate?: () => void;
};

function NavLinks({ onNavigate }: Readonly<NavLinksProps>) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              className="border-border"
              aria-label="Open navigation menu"
            />
          }
        >
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[84vw] max-w-80 p-0"
          showCloseButton
        >
          <div className="flex h-full flex-col">
            <div className="border-b px-4 py-4">
              <h1 className="text-xl font-bold">Library Management</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:h-screen md:w-64 md:fixed md:flex-col md:border-r md:bg-background">
      <div className="p-6">
        <h1 className="text-lg font-bold">Library Management</h1>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-6">
        <NavLinks />
      </nav>
    </aside>
  );
}
