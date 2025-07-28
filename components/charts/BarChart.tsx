"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartProps {
  data: Array<{
    campaign: string;
    reach: number;
    engagement: number;
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
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CampaignBarChart({ data, loading }: BarChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
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
        <CardTitle>Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="campaign" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="reach" 
              fill="#3b82f6" 
              name="Reach"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="engagement" 
              fill="#10b981" 
              name="Engagement"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}