"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  BookMarked,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import type { DashboardStats } from "@/lib/db";
import { DashboardPageSkeleton } from "@/components/page-skeletons";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center">
        <p className="text-destructive">Unable to load dashboard data</p>
        <Button onClick={fetchStats} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const issuedPercentage =
    stats.total_books > 0 ?
      Math.round(
        ((stats.total_books - stats.available_books) / stats.total_books) * 100,
      )
    : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-linear-to-br from-secondary/60 to-background p-6">
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-muted-foreground">
          Here's an overview of your library's status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Books"
          value={stats.total_books}
          description="Books in inventory"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          title="Available Books"
          value={stats.available_books}
          description={`${issuedPercentage}% of books issued`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Active Members"
          value={stats.total_members}
          description="Currently active"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Active Issues"
          value={stats.active_issues}
          description="Books checked out"
          icon={<BookMarked className="h-4 w-4" />}
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdue_books}
          description="Awaiting return"
          icon={<AlertCircle className="h-4 w-4" />}
          trend={
            stats.overdue_books > 0 ?
              { value: stats.overdue_books, isPositive: false }
            : undefined
          }
        />
        <StatCard
          title="Total Fines Collected"
          value={`₹${stats.total_fines}`}
          description="From returned books"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Library Status</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Books Available:</span>
              <span className="font-medium">
                {stats.available_books}/{stats.total_books}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Active Issues:</span>
              <span className="font-medium">{stats.active_issues}</span>
            </p>
            <p className="flex justify-between">
              <span>Overdue Books:</span>
              <span className="font-medium text-red-600">
                {stats.overdue_books}
              </span>
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Member Insights</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Total Members:</span>
              <span className="font-medium">{stats.total_members}</span>
            </p>
            <p className="flex justify-between">
              <span>Avg Issues per Member:</span>
              <span className="font-medium">
                {stats.total_members > 0 ?
                  (stats.active_issues / stats.total_members).toFixed(2)
                : "0"}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Collection Rate:</span>
              <span className="font-medium">₹{stats.total_fines}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
