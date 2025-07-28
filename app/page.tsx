"use client";

import React, { useState, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { RevenueLineChart } from "@/components/charts/LineChart";
import { CampaignBarChart } from "@/components/charts/BarChart";
import { TrafficDonutChart } from "@/components/charts/DonutChart";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data, loading } = useRealTimeData();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Modal */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center space-y-4"
          >
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome to ADmyBRAND Insights
            </h1>
            <p className="text-muted-foreground">
              Your digital marketing analytics at a glance
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ADmyBRAND Insights</h1>
              <p className="text-muted-foreground">Marketing Analytics Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <DateRangePicker />
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Revenue"
            value={data.metrics.revenue}
            change={data.metrics.revenueChange}
            icon="revenue"
            loading={loading}
            format="currency"
          />
          <MetricCard
            label="Active Users"
            value={data.metrics.users}
            change={data.metrics.usersChange}
            icon="users"
            loading={loading}
            format="number"
          />
          <MetricCard
            label="Conversion Rate"
            value={data.metrics.conversions}
            change={data.metrics.conversionsChange}
            icon="conversions"
            loading={loading}
            format="percentage"
          />
          <MetricCard
            label="Growth Rate"
            value={`↑${data.metrics.growthRate}%`}
            icon="growth"
            loading={loading}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RevenueLineChart data={data.chartData} loading={loading} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CampaignBarChart data={data.barChartData} loading={loading} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <CampaignTable data={data.campaigns} loading={loading} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TrafficDonutChart data={data.trafficSources} loading={loading} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}