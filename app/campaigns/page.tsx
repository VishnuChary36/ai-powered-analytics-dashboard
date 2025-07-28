'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { DataTable } from '@/components/dashboard/DataTable';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { generateMockData } from '@/lib/mockData';
import { DashboardData } from '@/lib/types';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Plus, 
  Play, 
  Pause, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign,
  Eye,
  MousePointer
} from 'lucide-react';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { FloatingExportButton } from '@/components/dashboard/FloatingExportButton';
import { useToast } from '@/hooks/use-toast';

export default function CampaignsPage() {
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



  const handleCreateCampaign = () => {
    toast({
      title: "Create Campaign",
      description: "Campaign creation feature will be implemented soon.",
    });
  };

  const handleCampaignAction = (action: string, campaignName: string) => {
    toast({
      title: `Campaign ${action}`,
      description: `${campaignName} has been ${action.toLowerCase()}.`,
    });
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

  const activeCampaigns = data?.tableData.filter(campaign => campaign.status === 'active').length || 0;
  const pausedCampaigns = data?.tableData.filter(campaign => campaign.status === 'paused').length || 0;
  const completedCampaigns = data?.tableData.filter(campaign => campaign.status === 'completed').length || 0;
  const totalImpressions = data?.tableData.reduce((sum, campaign) => sum + campaign.impressions, 0) || 0;
  const totalClicks = data?.tableData.reduce((sum, campaign) => sum + campaign.clicks, 0) || 0;
  const totalRevenue = data?.tableData.reduce((sum, campaign) => sum + campaign.revenue, 0) || 0;

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
                <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
                <p className="text-muted-foreground">
                  Manage and monitor all your marketing campaigns in one place
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCampaign} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Campaign
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={handleResetFilters} className="px-3 py-1 rounded bg-muted text-sm hover:bg-muted/80 border">Reset Filters</button>
            </div>

            {/* Campaign Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Play className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently running
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paused Campaigns</CardTitle>
                  <Pause className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pausedCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    Temporarily stopped
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Campaigns</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{completedCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully finished
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    From all campaigns
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Total Impressions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalImpressions.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Across all active campaigns
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5" />
                    Total Clicks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalClicks.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    User engagement metric
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Average CTR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {data ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click-through rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common campaign management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCampaignAction('Paused', 'Selected campaigns')}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause All Active
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCampaignAction('Resumed', 'Selected campaigns')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume Paused
                  </Button>
                  <ExportButton 
                    data={data} 
                    type="campaigns" 
                    filename="campaigns-export"
                    variant="outline"
                    size="sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Campaign Data Table */}
            <DataTable
              data={data}
              isLoading={isLoading || refreshing}
              dateRange={dateRange}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchTermChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onDateRangeChange={setDateRange}
            />
          </main>
        </div>
        
        {/* Floating Export Button */}
        <FloatingExportButton 
          data={data} 
          type="campaigns" 
          filename="campaigns-export"
        />
      </div>
    </ThemeProvider>
  );
}