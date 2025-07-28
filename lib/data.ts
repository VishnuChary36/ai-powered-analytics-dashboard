export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  budget: number;
  reach: number;
  clicks: number;
  conversions: number;
  date: string; // ISO date string
}

export interface MetricData {
  revenue: number;
  users: number;
  conversions: number;
  growthRate: number;
  revenueChange: number;
  usersChange: number;
  conversionsChange: number;
}

export interface ChartData {
  month: string;
  revenue: number;
  users: number;
}

export interface BarChartData {
  campaign: string;
  reach: number;
  engagement: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

// Mock data generator
export const generateMockData = () => {
  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Summer Sale 2024",
      status: "active",
      budget: 50000,
      reach: 125000,
      clicks: 8500,
      conversions: 425,
      date: "2024-06-01",
    },
    {
      id: "2",
      name: "Brand Awareness Q1",
      status: "completed",
      budget: 35000,
      reach: 98000,
      clicks: 6200,
      conversions: 310,
      date: "2024-03-15",
    },
    {
      id: "3",
      name: "Product Launch - X Series",
      status: "active",
      budget: 75000,
      reach: 200000,
      clicks: 15000,
      conversions: 750,
      date: "2024-05-10",
    },
    {
      id: "4",
      name: "Holiday Specials",
      status: "paused",
      budget: 60000,
      reach: 145000,
      clicks: 9800,
      conversions: 490,
      date: "2023-12-20",
    },
    {
      id: "5",
      name: "Influencer Collab",
      status: "active",
      budget: 40000,
      reach: 85000,
      clicks: 7200,
      conversions: 360,
      date: "2024-04-05",
    },
  ];

  const metrics: MetricData = {
    revenue: 235000,
    users: 10450,
    conversions: 3.4,
    growthRate: 12.8,
    revenueChange: 8.5,
    usersChange: -2.3,
    conversionsChange: 5.2,
  };

  const chartData: ChartData[] = [
    { month: "Jan", revenue: 180000, users: 8200 },
    { month: "Feb", revenue: 195000, users: 8800 },
    { month: "Mar", revenue: 210000, users: 9400 },
    { month: "Apr", revenue: 205000, users: 9100 },
    { month: "May", revenue: 225000, users: 10000 },
    { month: "Jun", revenue: 235000, users: 10450 },
  ];

  const barChartData: BarChartData[] = [
    { campaign: "Summer Sale", reach: 125000, engagement: 8500 },
    { campaign: "Brand Awareness", reach: 98000, engagement: 6200 },
    { campaign: "Product Launch", reach: 200000, engagement: 15000 },
    { campaign: "Holiday Specials", reach: 145000, engagement: 9800 },
    { campaign: "Influencer Collab", reach: 85000, engagement: 7200 },
  ];

  const trafficSources: TrafficSource[] = [
    { name: "Organic", value: 35, color: "#6366f1" },
    { name: "Paid", value: 30, color: "#8b5cf6" },
    { name: "Social", value: 20, color: "#3b82f6" },
    { name: "Referral", value: 15, color: "#10b981" },
  ];

  return { campaigns, metrics, chartData, barChartData, trafficSources };
};

// Simulate real-time updates
export const getRandomizedMetrics = (baseMetrics: MetricData): MetricData => {
  return {
    ...baseMetrics,
    revenue: baseMetrics.revenue + Math.floor(Math.random() * 5000 - 2500),
    users: baseMetrics.users + Math.floor(Math.random() * 100 - 50),
    conversions: Number((baseMetrics.conversions + (Math.random() * 0.2 - 0.1)).toFixed(2)),
    growthRate: Number((baseMetrics.growthRate + (Math.random() * 0.5 - 0.25)).toFixed(2)),
  };
};