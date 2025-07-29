'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { generateMockData } from '@/lib/mockData';
import { DashboardData } from '@/lib/types';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { FloatingExportButton } from '@/components/dashboard/FloatingExportButton';
import { useToast } from '@/hooks/use-toast';

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ from: null, to: null });
  };



  useEffect(() => {
    // Simulate initial data loading
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setData(generateMockData());
      setIsLoading(false);
    };

    loadData();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 1000); // Show skeleton for 1s
      setData(generateMockData());
    }, 30000);

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
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
                <p className="text-muted-foreground">
                  Deep dive into your marketing performance with detailed analytics
                </p>
              </div>
              <ExportButton
                data={data ?? undefined}
                type="analytics"
                filename="advanced-analytics-report"
                variant="default"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={handleResetFilters} className="px-3 py-1 rounded bg-muted text-sm hover:bg-muted/80 border">Reset Filters</button>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.24%</div>
                  <p className="text-xs text-muted-foreground">
                    +0.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,247</div>
                  <p className="text-xs text-muted-foreground">
                    +12.3% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Return on Ad Spend</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2x</div>
                  <p className="text-xs text-muted-foreground">
                    +0.3x from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,847</div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <MetricsGrid data={data} isLoading={isLoading || refreshing} />
            <ChartsSection
              data={data}
              isLoading={isLoading || refreshing}
              dateRange={dateRange}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchTermChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onDateRangeChange={setDateRange}
            />

            {/* Additional Analytics Sections */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Organic Search</span>
                      <span className="text-sm font-medium">45.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Direct</span>
                      <span className="text-sm font-medium">23.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Social Media</span>
                      <span className="text-sm font-medium">18.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Paid Ads</span>
                      <span className="text-sm font-medium">12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>User device preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Desktop</span>
                      <span className="text-sm font-medium">52.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile</span>
                      <span className="text-sm font-medium">38.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tablet</span>
                      <span className="text-sm font-medium">9.0%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        {/* Floating Export Button */}
        <FloatingExportButton
          data={data ?? undefined}
          type="analytics"
          filename="analytics-export"
        />
      </div>
    </ThemeProvider>
  );
}