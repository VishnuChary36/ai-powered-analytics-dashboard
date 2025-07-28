import { useEffect, useState } from "react";
import {
  generateMockData,
  getRandomizedMetrics,
  MetricData,
  Campaign,
  ChartData,
  BarChartData,
  TrafficSource,
} from "@/lib/data";

interface DashboardData {
  metrics: MetricData;
  campaigns: Campaign[];
  chartData: ChartData[];
  barChartData: BarChartData[];
  trafficSources: TrafficSource[];
}

export function useRealTimeData(updateInterval = 5000) {
  const [data, setData] = useState<DashboardData>(() => generateMockData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Set up real-time updates
    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        metrics: getRandomizedMetrics(prevData.metrics),
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return { data, loading };
}