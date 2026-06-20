"use client";

import { useState } from "react";
import Button from "@/components/button";
import {
  useAdminCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useSendCampaign,
} from "@/lib/api/hooks/use-admin";

const emptyForm = { name: "", subject: "", templateId: "" };

export default function AdminCampaignsPage() {
  const { data: campaigns = [], isLoading } = useAdminCampaigns();
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();
  const sendMutation = useSendCampaign();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, body: form });
        setEditingId(null);
      } else {
        await createMutation.mutateAsync(form);
      }
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save campaign");
    }
  };

  const startEdit = (c: (typeof campaigns)[0]) => {
    setEditingId(c._id);
    setForm({ name: c.name, subject: c.subject, templateId: c.templateId });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete campaign");
    }
  };

  const handleSend = async (id: string) => {
    if (!window.confirm("Send this campaign to all opted-in users?")) return;
    try {
      await sendMutation.mutateAsync(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send campaign");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Email Campaigns</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3 max-w-lg">
        <h2 className="font-semibold">{editingId ? "Edit Campaign" : "Create Campaign"}</h2>
        <input
          className="w-full border p-2 rounded"
          placeholder="Campaign Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Email Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Template ID"
          value={form.templateId}
          onChange={(e) => setForm({ ...form, templateId: e.target.value })}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {isLoading && <p>Loading campaigns...</p>}
      {!isLoading && campaigns.length === 0 && (
        <p className="text-gray-500">No campaigns yet. Create your first one!</p>
      )}
      {campaigns.length > 0 && (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Stats</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.subject}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    c.status === 'sent' ? 'bg-green-100 text-green-800' :
                    c.status === 'sending' ? 'bg-yellow-100 text-yellow-800' :
                    c.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-600">
                  S:{c.stats.sent} O:{c.stats.opened} C:{c.stats.clicked} F:{c.stats.failed}
                </td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600" onClick={() => startEdit(c)}>Edit</button>
                  {c.status === 'draft' && (
                    <button className="text-green-600" onClick={() => handleSend(c._id)}>Send</button>
                  )}
                  <button className="text-red-600" onClick={() => handleDelete(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
