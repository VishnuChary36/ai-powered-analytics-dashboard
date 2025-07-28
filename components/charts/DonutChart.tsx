"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  loading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-lg font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function TrafficDonutChart({ data, loading }: DonutChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
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
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}