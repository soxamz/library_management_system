"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialog } from "@/components/form-dialog";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import type { Book } from "@/lib/db";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { TablePageSkeleton } from "@/components/page-skeletons";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publication_year: new Date().getFullYear(),
    total_copies: 1,
  });

  useEffect(() => {
    fetchBooks();
  }, [search]);

  async function fetchBooks() {
    try {
      setLoading(true);
      const url =
        search ?
          `/api/books?search=${encodeURIComponent(search)}`
        : "/api/books";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load books";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBook() {
    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.isbn.trim()
    ) {
      toast.error("Title, author, and ISBN are required");
      return;
    }

    if (formData.total_copies < 1) {
      toast.error("Total copies must be at least 1");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add book");

      toast.success("Book added successfully");
      setFormData({
        title: "",
        author: "",
        isbn: "",
        publication_year: new Date().getFullYear(),
        total_copies: 1,
      });
      setOpenDialog(false);
      await fetchBooks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add book";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteBook(id: string | number) {
    try {
      const response = await fetch(`/api/books?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete book");

      toast.success("Book deleted successfully");
      await fetchBooks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete book";
      toast.error(message);
    }
  }

  function renderBookActions(book: Book) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteBook(book.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  const columns = [
    { key: "title" as const, label: "Title" },
    { key: "author" as const, label: "Author" },
    { key: "isbn" as const, label: "ISBN" },
    { key: "publication_year" as const, label: "Year" },
    {
      key: "total_copies" as const,
      label: "Copies",
      render: (value: number, row: Book) => `${row.copies_available}/${value}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Books Management</h1>
        <FormDialog
          open={openDialog}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          }
          title="Add New Book"
          description="Enter the book details below"
          onOpenChange={setOpenDialog}
        >
          <div className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  placeholder="Book title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Author</FieldLabel>
                <Input
                  placeholder="Author name"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>ISBN</FieldLabel>
                <Input
                  placeholder="ISBN"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Publication Year</FieldLabel>
                <Input
                  type="number"
                  value={formData.publication_year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publication_year: Number.parseInt(e.target.value, 10),
                    })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Total Copies</FieldLabel>
                <Input
                  type="number"
                  value={formData.total_copies}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_copies: Number.parseInt(e.target.value, 10),
                    })
                  }
                />
              </Field>
            </FieldGroup>
            <Button
              onClick={handleAddBook}
              className="w-full"
              disabled={submitting}
            >
              Add Book
            </Button>
          </div>
        </FormDialog>
      </div>

      <Input
        placeholder="Search books by title, author, or ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {loading ?
        <TablePageSkeleton />
      : <DataTable
          columns={columns}
          data={books}
          keyExtractor={(book) => book.id}
          actions={renderBookActions}
          emptyMessage="No books found"
        />
      }
    </div>
  );
}
