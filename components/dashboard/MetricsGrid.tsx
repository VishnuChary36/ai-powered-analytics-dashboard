'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardData } from '@/lib/types';
import { TrendingUp, TrendingDown, Users, Target, BarChart3, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsGridProps {
  data: DashboardData | null;
  isLoading: boolean;
}

const iconMap = {
  TrendingUp: TrendingUp,
  Users: Users,
  Target: Target,
  BarChart3: BarChart3,
  DollarSign: DollarSign,
};

export function MetricsGrid({ data, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {data.metrics.map((metric, index) => {
        const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || BarChart3;
        const isPositive = metric.changeType === 'increase';
        
        return (
          <Card key={index} className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={cn(
                "p-2 rounded-lg transition-colors group-hover:scale-110 transition-transform duration-200",
                "bg-gradient-to-br",
                metric.color.includes('emerald') && "from-emerald-500/10 to-emerald-600/20",
                metric.color.includes('blue') && "from-blue-500/10 to-blue-600/20",
                metric.color.includes('purple') && "from-purple-500/10 to-purple-600/20",
                metric.color.includes('orange') && "from-orange-500/10 to-orange-600/20"
              )}>
                <IconComponent className={cn("h-4 w-4", metric.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="flex items-center text-xs">
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                )}
                <span className={cn(
                  "font-medium",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(metric.change)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}