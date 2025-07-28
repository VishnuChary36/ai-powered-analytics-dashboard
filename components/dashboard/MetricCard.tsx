"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Activity 
} from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: "revenue" | "users" | "conversions" | "growth";
  loading?: boolean;
  format?: "currency" | "number" | "percentage";
}

const icons = {
  revenue: DollarSign,
  users: Users,
  conversions: Target,
  growth: Activity,
};

export function MetricCard({
  label,
  value,
  change,
  icon,
  loading = false,
  format = "number",
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const Icon = icons[icon];
  
  useEffect(() => {
    if (typeof value === "number" && !loading) {
      const duration = 1500;
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = value / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedValue(Math.floor(increment * currentStep));
        } else {
          setAnimatedValue(value);
          clearInterval(timer);
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [value, loading]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayValue = format === "currency" 
    ? `₹${animatedValue.toLocaleString()}`
    : format === "percentage"
    ? `${animatedValue}%`
    : animatedValue.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <div className="text-2xl font-bold animate-number">
                {typeof value === "string" ? value : displayValue}
              </div>
              {change !== undefined && (
                <div className="flex items-center space-x-1">
                  {change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      change > 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {Math.abs(change)}%
                  </span>
                </div>
              )}
            </div>
            <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}