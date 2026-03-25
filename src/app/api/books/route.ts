import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import type { Book } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    let query =
      "SELECT id, title, author, isbn, publication_year, total_copies, available_copies as copies_available, created_at FROM books_5234";
    const params: any[] = [];

    if (search) {
      query +=
        " WHERE LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1) OR LOWER(isbn) = $1";
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query(query, params);
    return NextResponse.json(result as Book[]);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, isbn, publication_year, total_copies } = body;

    const result = await db.query(
      `INSERT INTO books_5234 (title, author, isbn, publication_year, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $5)
       RETURNING id, title, author, isbn, publication_year, total_copies, available_copies as copies_available, created_at`,
      [
        title,
        author,
        isbn,
        publication_year || new Date().getFullYear(),
        total_copies || 1,
      ],
    );

    return NextResponse.json(result[0] as Book, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, author, isbn, publication_year, total_copies } = body;

    const result = await db.query(
      `UPDATE books_5234
       SET title = $1, author = $2, isbn = $3,
           publication_year = $4, total_copies = $5
       WHERE id = $6
       RETURNING id, title, author, isbn, publication_year, total_copies, available_copies as copies_available, created_at`,
      [title, author, isbn, publication_year, total_copies, id],
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(result[0] as Book);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 },
      );
    }

    await db.query("DELETE FROM books_5234 WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 },
    );
  }
}
