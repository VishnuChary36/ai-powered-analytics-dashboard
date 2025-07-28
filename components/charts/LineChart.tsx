"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface LineChartProps {
  data: Array<{
    month: string;
    revenue: number;
    users: number;
  }>;
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Revenue" ? formatCurrency(entry.value) : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueLineChart({ data, loading }: LineChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              name="Revenue"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="Users"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}