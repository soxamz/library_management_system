"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import { toast } from "sonner";
import { Plus, Check } from "lucide-react";
import type { Book, Member } from "@/lib/db";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePageSkeleton } from "@/components/page-skeletons";

interface IssuedBook {
  id: number;
  member_id: number;
  book_id: number;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  fine_paid: number;
  member_name: string;
  book_title: string;
}

export default function IssuedBooksPage() {
  const [issued, setIssued] = useState<IssuedBook[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState("active");
  const [formData, setFormData] = useState({
    member_id: "",
    book_id: "",
    days_to_return: 14,
  });

  interface FormData {
    member_id: string | number;
    book_id: string | number;
    days_to_return: number;
  }

  useEffect(() => {
    fetchAllData();
  }, [filter]);

  async function fetchAllData() {
    try {
      setLoading(true);
      const [issueRes, booksRes, membersRes] = await Promise.all([
        fetch(`/api/issued?filter=${filter}`),
        fetch("/api/books"),
        fetch("/api/members"),
      ]);

      if (!issueRes.ok || !booksRes.ok || !membersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [issueData, booksData, membersData] = await Promise.all([
        issueRes.json(),
        booksRes.json(),
        membersRes.json(),
      ]);

      setIssued(issueData);
      setBooks(booksData);
      setMembers(membersData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleIssueBook() {
    if (!formData.member_id || !formData.book_id) {
      toast.error("Please select both member and book");
      return;
    }

    try {
      const response = await fetch("/api/issued", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to issue book");

      toast.success("Book issued successfully");
      setFormData({
        member_id: "",
        book_id: "",
        days_to_return: 14,
      });
      setOpenDialog(false);
      await fetchAllData();
    } catch (error) {
      toast.error("Failed to issue book");
    }
  }

  async function handleReturnBook(id: number) {
    try {
      const response = await fetch("/api/issued", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          return_date: new Date().toISOString(),
          fine_paid: 0,
        }),
      });
      if (!response.ok) throw new Error("Failed to return book");

      toast.success("Book returned successfully");
      await fetchAllData();
    } catch (error) {
      toast.error("Failed to return book");
    }
  }

  const columns = [
    { key: "member_name" as const, label: "Member" },
    { key: "book_title" as const, label: "Book" },
    {
      key: "issue_date" as const,
      label: "Issued Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "due_date" as const,
      label: "Due Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "return_date" as const,
      label: "Status",
      render: (value: string | null) => (
        <span className={value ? "text-green-600" : "text-blue-600"}>
          {value ? "Returned" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Issued Books Management</h1>
        <FormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Issue Book
            </Button>
          }
          title="Issue New Book"
          description="Select a member and book to issue"
          onOpenChange={setOpenDialog}
        >
          <div className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Member</FieldLabel>
                <Select
                  value={formData.member_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, member_id: value ?? "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={String(member.id)}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Book</FieldLabel>
                <Select
                  value={formData.book_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, book_id: value ?? "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books
                      .filter((book) => book.copies_available > 0)
                      .map((book) => (
                        <SelectItem key={book.id} value={String(book.id)}>
                          {book.title} ({book.copies_available} available)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Days to Return</FieldLabel>
                <Select
                  value={String(formData.days_to_return)}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      days_to_return: parseInt(value ?? "14", 10),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="21">21 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <Button onClick={handleIssueBook} className="w-full">
              Issue Book
            </Button>
          </div>
        </FormDialog>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active Issues
        </Button>
        <Button
          variant={filter === "returned" ? "default" : "outline"}
          onClick={() => setFilter("returned")}
        >
          Returned
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
      </div>

      {loading ?
        <TablePageSkeleton showFilterTabs />
      : <DataTable
          columns={columns}
          data={issued}
          keyExtractor={(item) => item.id}
          actions={(item) =>
            !item.return_date && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReturnBook(item.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )
          }
          emptyMessage="No issued books found"
        />
      }
    </div>
  );
}
