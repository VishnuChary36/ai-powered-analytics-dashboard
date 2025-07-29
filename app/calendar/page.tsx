'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { startOfMonth, endOfMonth } from 'date-fns';

const mockSummary = [
  { label: 'Scheduled Campaigns', value: 24, sub: 'This month' },
  { label: 'Upcoming', value: 8, sub: 'Next 7 days' },
  { label: 'Completed', value: 16, sub: 'This month' },
  { label: 'Overdue', value: 2, sub: 'Needs attention' },
];

export default function CalendarPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState(mockSummary);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [dateRange]);

  useEffect(() => {
    // Simulate real-time updates every 20s
    const interval = setInterval(() => {
      setLoading(true);
      setTimeout(() => {
        setSummary(s => s.map(item => ({ ...item, value: typeof item.value === 'number' ? item.value + Math.floor(Math.random() * 3) : item.value })));
        setLoading(false);
      }, 1000);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Campaign Calendar</h1>
              <p className="text-muted-foreground">Schedule and manage your marketing campaigns timeline</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <ExportButton data={undefined} type="table" filename="calendar-summary" variant="default" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {loading
                ? Array(4).fill(0).map((_, i) => (
                  <Card key={i}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-6" /></CardHeader><CardContent><Skeleton className="h-8 w-20 mb-2" /><Skeleton className="h-4 w-16" /></CardContent></Card>
                ))
                : summary.map((item, i) => (
                  <Card key={i}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{item.label}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{item.value}</div><p className="text-xs text-muted-foreground">{item.sub}</p></CardContent></Card>
                ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Campaign calendar and scheduling features are under development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This page will include a full calendar view, campaign scheduling, deadline tracking, and automated reminders for your marketing activities.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}