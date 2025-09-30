import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, Users, Activity } from 'lucide-react';
const iconMap = {
  revenue: DollarSign,
  users: Users,
  conversion: Activity,
  churn: TrendingDown,
  default: TrendingUp,
};
export interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: keyof typeof iconMap;
}
export function KpiCard({ title, value, change, changeType, icon }: KpiCardProps) {
  const Icon = iconMap[icon] || iconMap.default;
  const isPositive = changeType === 'positive';
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <div className="flex items-center text-xs text-slate-500 mt-1">
          <span className={cn(
            "flex items-center font-semibold",
            isPositive ? "text-emerald-600" : "text-red-600"
          )}>
            {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            {change}
          </span>
          <span className="ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
export function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium text-slate-500">
          <CardTitle as="div">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="text-xs text-slate-500 mt-1">
          <Skeleton className="h-3 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}