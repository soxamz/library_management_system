"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialog } from "@/components/form-dialog";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import type { Member } from "@/lib/db";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { TablePageSkeleton } from "@/components/page-skeletons";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchMembers();
  }, [search]);

  async function fetchMembers() {
    try {
      setLoading(true);
      const url =
        search ?
          `/api/members?search=${encodeURIComponent(search)}`
        : "/api/members";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMember() {
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add member");

      toast.success("Member added successfully");
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      setOpenDialog(false);
      await fetchMembers();
    } catch (error) {
      toast.error("Failed to add member");
    }
  }

  async function handleDeleteMember(id: string | number) {
    try {
      const response = await fetch(`/api/members?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete member");

      toast.success("Member deleted successfully");
      await fetchMembers();
    } catch (error) {
      toast.error("Failed to delete member");
    }
  }

  const columns = [
    { key: "name" as const, label: "Name" },
    { key: "email" as const, label: "Email" },
    { key: "phone" as const, label: "Phone" },
    {
      key: "is_active" as const,
      label: "Status",
      render: (value: boolean) => (
        <span className={value ? "text-green-600" : "text-gray-400"}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Members Management</h1>
        <FormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          }
          title="Add New Member"
          description="Enter the member details below"
          onOpenChange={setOpenDialog}
        >
          <div className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  placeholder="Member name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>
            <Button onClick={handleAddMember} className="w-full">
              Add Member
            </Button>
          </div>
        </FormDialog>
      </div>

      <Input
        placeholder="Search members by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {loading ?
        <TablePageSkeleton />
      : <DataTable
          columns={columns}
          data={members}
          keyExtractor={(member) => member.id}
          actions={(member) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteMember(member.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          emptyMessage="No members found"
        />
      }
    </div>
  );
}
