'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Target, TrendingUp } from 'lucide-react';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { startOfMonth, endOfMonth } from 'date-fns';

const mockSummary = [
  { label: 'Total Audience', value: 45231, sub: '+12% from last month' },
  { label: 'New Users', value: 2350, sub: '+8% from last month' },
  { label: 'Segments', value: 12, sub: 'Active segments' },
  { label: 'Engagement Rate', value: '68.2%', sub: '+5.1% from last month' },
];

export default function AudiencePage() {
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
        setSummary(s => s.map(item => ({ ...item, value: typeof item.value === 'number' ? item.value + Math.floor(Math.random() * 100) : item.value })));
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
              <h1 className="text-3xl font-bold tracking-tight">Audience Management</h1>
              <p className="text-muted-foreground">Understand and segment your audience for better targeting</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <ExportButton data={summary} type="summary" filename="audience-summary" variant="default" />
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
                <CardDescription>Audience management features are under development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This page will include audience segmentation, demographic analysis, and targeting tools to help you better understand and reach your customers.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}