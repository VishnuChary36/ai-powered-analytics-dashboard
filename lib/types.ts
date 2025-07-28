export interface MetricData {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  revenue?: number;
  users?: number;
  conversions?: number;
  date?: string;
}

export interface TableRow {
  id: string;
  campaign: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  revenue: number;
  status: 'active' | 'paused' | 'completed';
  date: string;
}

export interface DashboardData {
  metrics: MetricData[];
  chartData: {
    revenue: ChartDataPoint[];
    userGrowth: ChartDataPoint[];
    conversionRate: ChartDataPoint[];
    channelBreakdown: ChartDataPoint[];
    performanceComparison: ChartDataPoint[];
  };
  tableData: TableRow[];
}