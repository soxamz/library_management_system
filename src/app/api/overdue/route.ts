import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const FINE_PER_DAY = 10; // Rs. 10 per day

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const result = await db.query(
      `
      SELECT 
        ib.*,
        m.name as member_name,
        b.title as book_title,
        CEIL(EXTRACT(DAY FROM NOW() - ib.due_date)) as days_overdue,
        CASE 
          WHEN NOW() > ib.due_date AND ib.return_date IS NULL 
          THEN CEIL(EXTRACT(DAY FROM NOW() - ib.due_date)) * $1
          ELSE 0
        END as calculated_fine
      FROM issued_books_5234 ib
      JOIN members_5234 m ON ib.member_id = m.id
      JOIN books_5234 b ON ib.book_id = b.id
      WHERE ib.return_date IS NULL AND NOW() > ib.due_date
      ORDER BY ib.due_date ASC
    `,
      [FINE_PER_DAY],
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching overdue books:", error);
    return NextResponse.json(
      { error: "Failed to fetch overdue books" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issued_book_id, return_date } = body;

    // Calculate fine based on days overdue
    const issuedResult = await db.query<{ due_date: string }>(
      "SELECT due_date FROM issued_books_5234 WHERE id = $1",
      [issued_book_id],
    );

    if (issuedResult.length === 0) {
      return NextResponse.json(
        { error: "Issued book not found" },
        { status: 404 },
      );
    }

    const dueDate = new Date(issuedResult[0].due_date);
    const returnDate = return_date ? new Date(return_date) : new Date();
    const daysOverdue = Math.ceil(
      (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const fineAmount = Math.max(0, daysOverdue) * FINE_PER_DAY;

    // Update issued book with return date and fine
    const result = await db.query(
      `UPDATE issued_books_5234
       SET return_date = $1, fine_amount = $2
       WHERE id = $3
       RETURNING *`,
      [returnDate.toISOString(), fineAmount, issued_book_id],
    );

    // Update book available copies
    const issuedBook = result[0];
    await db.query(
      "UPDATE books_5234 SET available_copies = available_copies + 1 WHERE id = $1",
      [issuedBook.book_id],
    );

    return NextResponse.json({
      success: true,
      issued_book: issuedBook,
      fine_amount: fineAmount,
      days_overdue: Math.max(0, daysOverdue),
    });
  } catch (error) {
    console.error("Error processing overdue return:", error);
    return NextResponse.json(
      { error: "Failed to process return" },
      { status: 500 },
    );
  }
}
