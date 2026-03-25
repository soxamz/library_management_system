import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import type { Member } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    let query =
      "SELECT id, name, email, phone, membership_date, (membership_status = 'active') as is_active, created_at FROM members_5234";
    const params: any[] = [];

    if (search) {
      query +=
        " WHERE LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1) OR LOWER(phone) LIKE LOWER($1)";
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query<Member>(query, params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    const result = await db.query<Member>(
      `INSERT INTO members_5234 (name, email, phone, membership_date, membership_status)
       VALUES ($1, $2, $3, NOW(), 'active')
       RETURNING id, name, email, phone, membership_date, (membership_status = 'active') as is_active, created_at`,
      [name, email, phone],
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone, is_active } = body;

    const result = await db.query<Member>(
      `UPDATE members_5234
       SET name = $1, email = $2, phone = $3, membership_status = $4
       WHERE id = $5
       RETURNING id, name, email, phone, membership_date, (membership_status = 'active') as is_active, created_at`,
      [name, email, phone, is_active ? "active" : "inactive", id],
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
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
        { error: "Member ID is required" },
        { status: 400 },
      );
    }

    await db.query("DELETE FROM members_5234 WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 },
    );
  }
}
