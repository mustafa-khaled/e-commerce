"use client";

import { useAdminReturns, useUpdateReturnStatus } from "@/lib/api/hooks/use-admin";
import Button from "@/components/button";

const STATUSES = ["requested", "approved", "rejected", "received", "refunded"];

export default function AdminReturnsPage() {
  const { data: returns = [], isLoading } = useAdminReturns();
  const updateMutation = useUpdateReturnStatus();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Returns</h1>
      {isLoading && <p>Loading returns...</p>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Return #</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-3">{r.returnNumber}</td>
              <td className="p-3">{r.status}</td>
              <td className="p-3 flex flex-wrap gap-1">
                {STATUSES.filter((s) => s !== r.status).map((status) => (
                  <Button
                    key={status}
                    variant="secondary"
                    className="text-xs py-1"
                    onClick={() => updateMutation.mutate({ id: r._id, status })}
                    disabled={updateMutation.isPending}
                  >
                    {status}
                  </Button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
