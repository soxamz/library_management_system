import type { DashboardStats } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    // Get total books
    const booksResult = await db.query<{
      total_books: number;
      available_books: number;
    }>(
      "SELECT COALESCE(SUM(total_copies), 0) as total_books, COALESCE(SUM(available_copies), 0) as available_books FROM books",
    );

    const totalBooks = Number(booksResult[0]?.total_books) || 0;
    const availableBooks = Number(booksResult[0]?.available_books) || 0;

    // Get total active members
    const membersResult = await db.query<{ total_members: number }>(
      "SELECT COUNT(*) as total_members FROM members WHERE membership_status = 'active'",
    );

    const totalMembers = Number(membersResult[0]?.total_members) || 0;

    // Get active issues
    const activeIssuesResult = await db.query<{ active_issues: number }>(
      "SELECT COUNT(*) as active_issues FROM issued_books WHERE return_date IS NULL",
    );

    const activeIssues = Number(activeIssuesResult[0]?.active_issues) || 0;

    // Get overdue books count
    const overdueResult = await db.query<{ overdue_books: number }>(
      "SELECT COUNT(*) as overdue_books FROM issued_books WHERE return_date IS NULL AND NOW() > due_date",
    );

    const overdueBooks = Number(overdueResult[0]?.overdue_books) || 0;

    // Get total fines
    const finesResult = await db.query<{ total_fines: number }>(
      "SELECT COALESCE(SUM(fine_amount), 0) as total_fines FROM issued_books WHERE return_date IS NOT NULL",
    );

    const totalFines = Number(finesResult[0]?.total_fines) || 0;

    const stats: DashboardStats = {
      total_books: totalBooks,
      available_books: availableBooks,
      total_members: totalMembers,
      active_issues: activeIssues,
      overdue_books: overdueBooks,
      total_fines: totalFines,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
