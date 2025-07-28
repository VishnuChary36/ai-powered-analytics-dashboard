import { DashboardData, MetricData, ChartDataPoint, TableRow } from './types';

const campaigns = [
  'Summer Sale 2024', 'Black Friday Campaign', 'Brand Awareness Q1', 'Product Launch',
  'Holiday Promotion', 'Back to School', 'Valentine\'s Special', 'Spring Collection'
];

const statuses: ('active' | 'paused' | 'completed')[] = ['active', 'paused', 'completed'];

function generateRandomData(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMetrics(): MetricData[] {
  const baseRevenue = 124750;
  const baseUsers = 48392;
  const baseConversions = 2847;
  const baseGrowth = 12.5;

  return [
    {
      title: 'Total Revenue',
      value: `$${(baseRevenue + generateRandomData(-5000, 15000)).toLocaleString()}`,
      change: generateRandomData(-5, 25),
      changeType: Math.random() > 0.3 ? 'increase' : 'decrease',
      icon: 'TrendingUp',
      color: 'text-emerald-600'
    },
    {
      title: 'Active Users',
      value: (baseUsers + generateRandomData(-2000, 8000)).toLocaleString(),
      change: generateRandomData(-3, 18),
      changeType: Math.random() > 0.2 ? 'increase' : 'decrease',
      icon: 'Users',
      color: 'text-blue-600'
    },
    {
      title: 'Conversions',
      value: (baseConversions + generateRandomData(-200, 500)).toLocaleString(),
      change: generateRandomData(-8, 22),
      changeType: Math.random() > 0.25 ? 'increase' : 'decrease',
      icon: 'Target',
      color: 'text-purple-600'
    },
    {
      title: 'Growth Rate',
      value: `${(baseGrowth + generateRandomData(-3, 8)).toFixed(1)}%`,
      change: generateRandomData(-2, 15),
      changeType: Math.random() > 0.35 ? 'increase' : 'decrease',
      icon: 'BarChart3',
      color: 'text-orange-600'
    }
  ];
}

function generateChartData() {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const year = 2024;
  return {
    revenue: months.map((month, i) => ({
      name: month,
      value: generateRandomData(80000, 160000),
      revenue: generateRandomData(80000, 160000),
      date: new Date(year, i, 1).toISOString().split('T')[0]
    })),
    userGrowth: months.map((month, i) => ({
      name: month,
      value: generateRandomData(35000, 65000),
      users: generateRandomData(35000, 65000),
      date: new Date(year, i, 1).toISOString().split('T')[0]
    })),
    conversionRate: months.map((month, i) => ({
      name: month,
      value: generateRandomData(2, 8),
      conversions: generateRandomData(2000, 4000),
      date: new Date(year, i, 1).toISOString().split('T')[0]
    })),
    channelBreakdown: [
      { name: 'Google Ads', value: generateRandomData(25, 35) },
      { name: 'Facebook', value: generateRandomData(20, 30) },
      { name: 'Instagram', value: generateRandomData(15, 25) },
      { name: 'LinkedIn', value: generateRandomData(10, 20) },
      { name: 'Twitter', value: generateRandomData(5, 15) },
      { name: 'Others', value: generateRandomData(5, 10) }
    ],
    performanceComparison: [
      { name: 'Q1', value: generateRandomData(70, 90), revenue: generateRandomData(300000, 400000), date: new Date(2024, 0, 1).toISOString().split('T')[0] },
      { name: 'Q2', value: generateRandomData(75, 95), revenue: generateRandomData(350000, 450000), date: new Date(2024, 3, 1).toISOString().split('T')[0] },
      { name: 'Q3', value: generateRandomData(80, 100), revenue: generateRandomData(400000, 500000), date: new Date(2024, 6, 1).toISOString().split('T')[0] },
      { name: 'Q4', value: generateRandomData(85, 105), revenue: generateRandomData(450000, 550000), date: new Date(2024, 9, 1).toISOString().split('T')[0] }
    ]
  };
}

function generateTableData(): TableRow[] {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `campaign-${i + 1}`,
    campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
    impressions: generateRandomData(10000, 500000),
    clicks: generateRandomData(500, 25000),
    conversions: generateRandomData(20, 1200),
    ctr: parseFloat((generateRandomData(1, 8) + Math.random()).toFixed(2)),
    cpc: parseFloat((generateRandomData(1, 5) + Math.random()).toFixed(2)),
    revenue: generateRandomData(1000, 50000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  }));
}

export function generateMockData(): DashboardData {
  return {
    metrics: generateMetrics(),
    chartData: generateChartData(),
    tableData: generateTableData()
  };
}