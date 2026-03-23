import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

const sql = connectionString ? neon(connectionString) : null;

export const db = {
  query: <T = any>(queryString: string, params?: any[]) => {
    if (!sql) {
      throw new Error(
        "Database connection is not configured. Set DATABASE_URL or NEON_DATABASE_URL.",
      );
    }

    return sql.query(queryString, params) as unknown as Promise<T[]>;
  },
};

export type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publication_year: number;
  copies_available: number;
  total_copies: number;
  created_at: string;
};

export type Member = {
  id: number;
  name: string;
  email: string;
  phone: string;
  membership_date: string;
  is_active: boolean;
  created_at: string;
};

export type Librarian = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type IssuedBook = {
  id: number;
  book_id: number;
  member_id: number;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  fine_paid: number;
  created_at: string;
};

export type DashboardStats = {
  total_books: number;
  available_books: number;
  total_members: number;
  active_issues: number;
  overdue_books: number;
  total_fines: number;
};

export type OverdueBook = IssuedBook & {
  member_name: string;
  book_title: string;
  days_overdue: number;
  calculated_fine: number;
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
