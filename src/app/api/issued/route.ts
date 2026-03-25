import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import type { IssuedBook } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all"; // all, active, returned

    let query = `
      SELECT ib.id, ib.book_id, ib.member_id, ib.issue_date, ib.due_date, ib.return_date, ib.fine_amount as fine_paid, ib.created_at, m.name as member_name, b.title as book_title
      FROM issued_books_5234 ib
      JOIN members_5234 m ON ib.member_id = m.id
      JOIN books_5234 b ON ib.book_id = b.id
    `;

    if (filter === "active") {
      query += " WHERE ib.return_date IS NULL";
    } else if (filter === "returned") {
      query += " WHERE ib.return_date IS NOT NULL";
    }

    query += " ORDER BY ib.created_at DESC";

    const result = await db.query(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching issued books:", error);
    return NextResponse.json(
      { error: "Failed to fetch issued books" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { member_id, book_id, days_to_return = 14 } = body;

    // Check if book is available
    const bookCheck = await db.query<{ copies_available: number }>(
      "SELECT available_copies as copies_available FROM books_5234 WHERE id = $1",
      [book_id],
    );

    if (bookCheck.length === 0 || bookCheck[0].copies_available <= 0) {
      return NextResponse.json(
        { error: "Book is not available" },
        { status: 400 },
      );
    }

    // Calculate due date
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + days_to_return);

    // Create issued book record
    const result = await db.query<IssuedBook>(
      `INSERT INTO issued_books_5234 (member_id, book_id, issue_date, due_date, fine_amount)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING id, book_id, member_id, issue_date, due_date, return_date, fine_amount as fine_paid, created_at`,
      [member_id, book_id, issueDate.toISOString(), dueDate.toISOString()],
    );

    // Update available copies
    await db.query(
      "UPDATE books_5234 SET available_copies = available_copies - 1 WHERE id = $1",
      [book_id],
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating issued book:", error);
    return NextResponse.json(
      { error: "Failed to issue book" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, return_date, fine_paid = 0 } = body;

    const result = await db.query<IssuedBook>(
      `UPDATE issued_books_5234
       SET return_date = $1, fine_amount = $2
       WHERE id = $3
       RETURNING id, book_id, member_id, issue_date, due_date, return_date, fine_amount as fine_paid, created_at`,
      [return_date || new Date().toISOString(), fine_paid, id],
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Issued book not found" },
        { status: 404 },
      );
    }

    // Get book_id and update available copies
    const issuedBook = result[0];
    await db.query(
      "UPDATE books_5234 SET available_copies = available_copies + 1 WHERE id = $1",
      [issuedBook.book_id],
    );

    return NextResponse.json(issuedBook);
  } catch (error) {
    console.error("Error updating issued book:", error);
    return NextResponse.json(
      { error: "Failed to return book" },
      { status: 500 },
    );
  }
}
