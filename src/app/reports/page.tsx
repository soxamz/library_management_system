"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { DashboardStats, Book, IssuedBook } from "@/lib/db";
import { ReportsPageSkeleton } from "@/components/page-skeletons";

const SHORT_LABEL_LIMIT = 14;

function formatBookLabel(label: string) {
  return label.length > SHORT_LABEL_LIMIT ?
      `${label.slice(0, SHORT_LABEL_LIMIT)}...`
    : label;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookData, setBookData] = useState<any[]>([]);
  const [issuanceData, setIssuanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  async function fetchReportData() {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, booksRes, issuedRes] = await Promise.all([
        fetch("/api/dashboard", { cache: "no-store" }),
        fetch("/api/books", { cache: "no-store" }),
        fetch("/api/issued", { cache: "no-store" }),
      ]);

      if (!statsRes.ok || !booksRes.ok || !issuedRes.ok) {
        throw new Error("Failed to fetch report data");
      }

      const [statsData, booksData, issuedData] = await Promise.all([
        statsRes.json(),
        booksRes.json(),
        issuedRes.json(),
      ]);

      setStats(statsData);

      // Prepare book distribution data
      const bookCounts = booksData.reduce((acc: any, book: Book) => {
        const copiesAvailable = Number(book.copies_available ?? 0);
        const totalCopies = Number(book.total_copies ?? 0);
        acc.push({
          name: book.title,
          issued: Math.max(totalCopies - copiesAvailable, 0),
          available: copiesAvailable,
        });
        return acc;
      }, []);
      setBookData(bookCounts.slice(0, 10)); // Show top 10

      // Prepare issuance trend data
      const issuanceByStatus = issuedData.reduce(
        (acc: any, item: IssuedBook) => {
          const status = item.return_date ? "Returned" : "Active";
          const existing = acc.find((d: any) => d.name === status);
          if (existing) {
            existing.value += 1;
          } else {
            acc.push({ name: status, value: 1 });
          }
          return acc;
        },
        [],
      );
      setIssuanceData(issuanceByStatus);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load report data";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ReportsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchReportData} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-linear-to-br from-secondary/60 to-background p-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Visual insights into your library operations
        </p>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Books
            </h3>
            <p className="text-2xl font-bold mt-1">{stats.total_books}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.available_books} available
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Members
            </h3>
            <p className="text-2xl font-bold mt-1">{stats.total_members}</p>
            <p className="text-xs text-muted-foreground mt-1">Active members</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Active Issues
            </h3>
            <p className="text-2xl font-bold mt-1">{stats.active_issues}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Books checked out
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Overdue
            </h3>
            <p className="text-2xl font-bold mt-1 text-red-600">
              {stats.overdue_books}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Overdue books</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Issuance Status Pie Chart */}
        {issuanceData.length > 0 && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Issuance Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issuanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issuanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Books Distribution Bar Chart */}
        {bookData.length > 0 && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Top Books by Copies</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={bookData}
                margin={{ top: 8, right: 10, left: 4, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={formatBookLabel}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={90}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  labelFormatter={(label) => `Book: ${label}`}
                />
                <Legend />
                <Bar dataKey="issued" stackId="a" fill="#ef4444" />
                <Bar dataKey="available" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Summary Statistics</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Circulation Rate</p>
              <p className="text-2xl font-bold mt-1">
                {stats.total_books > 0 ?
                  (
                    ((stats.total_books - stats.available_books) /
                      stats.total_books) *
                    100
                  ).toFixed(1)
                : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fine Collection</p>
              <p className="text-2xl font-bold mt-1">₹{stats.total_fines}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Average per Member
              </p>
              <p className="text-2xl font-bold mt-1">
                {stats.total_members > 0 ?
                  (stats.active_issues / stats.total_members).toFixed(2)
                : 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {!stats && (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No report data available yet.
        </div>
      )}
    </div>
  );
}
