"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPlus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/team");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch {
      // API may not exist yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    setSubmitting(true);

    try {
      await fetch("/api/dashboard/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      setInviteEmail("");
      setInviteRole("staff");
      setDialogOpen(false);
      fetchMembers();
    } catch {
      // API may not exist yet
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(memberId: string) {
    try {
      await fetch(`/api/dashboard/team/${memberId}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch {
      // API may not exist yet
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500">
            Manage who has access to this dashboard
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInvite} className="mt-4 space-y-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="team@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(v) => v && setInviteRole(v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={submitting || !inviteEmail}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  "Send Invite"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 rounded-xl border bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">
              No team members found. Invite someone to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-gray-500">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {member.role === "admin" ? "Admin" : "Staff"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
