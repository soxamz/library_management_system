"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { TablePageSkeleton } from "@/components/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

interface OverdueBook {
  id: number;
  member_id: number;
  book_id: number;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  fine_paid: number;
  member_name: string;
  book_title: string;
  days_overdue: number;
  calculated_fine: number;
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function OverdueBooksPage() {
  const [overdue, setOverdue] = useState<OverdueBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalFine, setTotalFine] = useState(0);

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  async function fetchOverdueBooks() {
    try {
      setLoading(true);
      const response = await fetch("/api/overdue");
      if (!response.ok) throw new Error("Failed to fetch overdue books");
      const data = await response.json();
      const normalizedData: OverdueBook[] = data.map((book: OverdueBook) => ({
        ...book,
        days_overdue: toNumber(book.days_overdue),
        calculated_fine: toNumber(book.calculated_fine),
      }));
      setOverdue(normalizedData);

      const total = normalizedData.reduce(
        (sum: number, book: OverdueBook) => sum + book.calculated_fine,
        0,
      );
      setTotalFine(total);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load overdue books";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReturnBook(id: number) {
    try {
      const overdueBook = overdue.find((b) => b.id === id);
      if (!overdueBook) return;

      const response = await fetch("/api/overdue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issued_book_id: id,
          return_date: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to process return");

      const result = await response.json();
      toast.success(
        `Book returned. Fine: ₹${result.fine_amount} for ${result.days_overdue} days overdue`,
      );
      await fetchOverdueBooks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to process return";
      toast.error(message);
    }
  }

  const columns = [
    { key: "member_name" as const, label: "Member" },
    { key: "book_title" as const, label: "Book" },
    {
      key: "due_date" as const,
      label: "Due Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "days_overdue" as const,
      label: "Days Overdue",
      render: (value: number) => (
        <span className="font-semibold text-red-600">{value}</span>
      ),
    },
    {
      key: "calculated_fine" as const,
      label: "Fine (₹)",
      render: (value: number) => (
        <span className="font-semibold text-red-600">₹{value}</span>
      ),
    },
  ];

  function renderOverdueActions(book: OverdueBook) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => handleReturnBook(book.id)}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Process Return
      </Button>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="mb-3 h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["total", "fine", "avg"].map((id) => (
            <div key={`overdue-card-${id}`} className="rounded-lg border p-6">
              <Skeleton className="mb-3 h-4 w-28" />
              <Skeleton className="h-9 w-36" />
            </div>
          ))}
        </div>

        <TablePageSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overdue Books</h1>
        <p className="text-muted-foreground">
          Manage books that have exceeded their due date
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Overdue
          </h3>
          <p className="text-3xl font-bold mt-2">{overdue.length}</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Fine
          </h3>
          <p className="text-3xl font-bold mt-2 text-red-600">
            ₹{totalFine.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Avg. Days Overdue
          </h3>
          <p className="text-3xl font-bold mt-2">
            {overdue.length > 0 ?
              (
                overdue.reduce((sum, book) => sum + book.days_overdue, 0) /
                overdue.length
              ).toFixed(1)
            : "0"}
          </p>
        </div>
      </div>

      {overdue.length === 0 ?
        <div className="border rounded-lg p-12 text-center">
          <p className="text-lg text-muted-foreground">No overdue books!</p>
          <p className="text-sm text-muted-foreground">
            All books are on track.
          </p>
        </div>
      : <DataTable
          columns={columns}
          data={overdue}
          keyExtractor={(book) => book.id}
          actions={renderOverdueActions}
          emptyMessage="No overdue books"
        />
      }
    </div>
  );
}
