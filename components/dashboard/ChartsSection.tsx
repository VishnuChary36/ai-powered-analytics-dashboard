'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardData } from '@/lib/types';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { DateRange } from '@/components/ui/date-range-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { isAfter, isBefore, parseISO } from 'date-fns';

interface ChartsSectionProps {
  data: DashboardData | null;
  isLoading: boolean;
  dateRange: DateRange;
  searchTerm: string;
  statusFilter: string;
  onSearchTermChange?: (term: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onDateRangeChange?: (range: DateRange) => void;
}

const COLORS = ['#3B82F6', '#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ChartsSection({ data, isLoading, dateRange, searchTerm, statusFilter, onSearchTermChange, onStatusFilterChange, onDateRangeChange }: ChartsSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-60 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-60 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Filter chart data by date, campaign, and status
  const filterByAll = (arr: any[]) =>
    arr.filter(point => {
      let matches = true;
      if (point.date) {
        const d = parseISO(point.date);
        matches = matches && (!dateRange.from || !isAfter(d, dateRange.to!)) && (!dateRange.to || !isBefore(d, dateRange.from!));
      }
      if (point.campaign) {
        matches = matches && point.campaign.toLowerCase().includes((searchTerm || '').toLowerCase());
      }
      if (point.status) {
        matches = matches && (statusFilter === 'all' || point.status === statusFilter);
      }
      return matches;
    });

  const filteredRevenue = data ? filterByAll(data.chartData.revenue) : [];
  const filteredUserGrowth = data ? filterByAll(data.chartData.userGrowth) : [];
  const filteredConversionRate = data ? filterByAll(data.chartData.conversionRate) : [];
  const filteredPerformance = data ? filterByAll(data.chartData.performanceComparison) : [];

  return (
    <div className="space-y-6">
      {/* Unified filter bar for charts */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-2">
        <div className="relative flex-1">
          <input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={e => onSearchTermChange && onSearchTermChange(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => onStatusFilterChange && onStatusFilterChange(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-[180px]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
        {onDateRangeChange && (
          <div className="w-full sm:w-auto">
            <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Growth Trends</CardTitle>
          <CardDescription>
            Monthly performance overview with key metrics comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">User Growth</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={filteredRevenue}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    className="drop-shadow-sm"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredUserGrowth}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#14B8A6' }}
                    activeDot={{ r: 8, fill: '#14B8A6' }}
                    className="drop-shadow-sm"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="conversions" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredConversionRate}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} className="drop-shadow-sm" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Channel performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.chartData.channelBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  className="drop-shadow-sm"
                >
                  {data.chartData.channelBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly Performance</CardTitle>
            <CardDescription>Revenue comparison by quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filteredPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  className="drop-shadow-sm"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}