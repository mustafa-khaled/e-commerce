"use client";

import Container from "@/components/container";
import { useAdminOverview } from "@/lib/api/hooks/use-admin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboardPage() {
  const { data: overview, isLoading } = useAdminOverview();

  const chartData = overview
    ? [
        { name: "Orders", value: overview.ordersCount },
        { name: "Revenue", value: overview.grossRevenue },
        { name: "AOV", value: overview.avgOrderValue },
      ]
    : [];

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {isLoading && <p>Loading dashboard...</p>}
      {overview && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-2xl font-bold">{overview.ordersCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Revenue (EGP)</p>
            <p className="text-2xl font-bold">{overview.grossRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Avg Order Value</p>
            <p className="text-2xl font-bold">{Math.round(overview.avgOrderValue).toLocaleString()}</p>
          </div>
        </div>
      )}
      <div className="bg-white p-4 rounded shadow h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
}
