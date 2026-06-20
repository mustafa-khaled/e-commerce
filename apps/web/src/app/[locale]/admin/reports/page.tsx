"use client";

import { useState } from "react";
import { useAdminSales } from "@/lib/api/hooks/use-admin";

export default function AdminReportsPage() {
  const [groupBy, setGroupBy] = useState<'day' | 'product'>('day');
  const { data = [], isLoading } = useAdminSales(groupBy);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${groupBy === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setGroupBy('day')}
        >
          By Day
        </button>
        <button
          className={`px-3 py-1 rounded ${groupBy === 'product' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setGroupBy('product')}
        >
          By Product
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">{groupBy === 'day' ? 'Date' : 'Product'}</th>
            <th className="p-3 text-left">Orders/Qty</th>
            <th className="p-3 text-left">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {(data as Record<string, unknown>[]).map((row, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">{(row._id as string) || (row.title as string) || '-'}</td>
              <td className="p-3">{(row.orders as number) || (row.quantity as number) || 0}</td>
              <td className="p-3">{(row.revenue as number) || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
