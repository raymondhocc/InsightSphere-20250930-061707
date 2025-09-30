import { KpiCard, KpiCardSkeleton, KpiCardProps } from "./KpiCard";
import { UserAcquisitionChart } from "./UserAcquisitionChart";
import { SalesFunnelChart } from "./SalesFunnelChart";
import { CustomerSegmentationChart } from "./CustomerSegmentationChart";
import { ExportButton } from "./ExportButton";
import { useChatStore } from "@/hooks/useChatStore";
import { BotMessageSquare, BarChart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Define types for analytics data to ensure type safety
type Chart = {
  type: 'user_acquisition';
  data: any;
};

type FunnelStep = {
  name: string;
  value: number;
};

type Segmentation = {
  segments: any[];
  data: any[];
};

export function AnalyticsDashboard() {
  const analyticsData = useChatStore((state) => state.analyticsData);
  const isLoading = useChatStore((state) => state.isLoading);
  const hasKpis = analyticsData?.kpis && analyticsData.kpis.length > 0;
  const hasCharts = analyticsData?.charts && analyticsData.charts.length > 0;
  const hasFunnel = analyticsData?.funnel && analyticsData.funnel.length > 0;
  const hasSegmentation = analyticsData?.segmentation && analyticsData.segmentation.length > 0;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-500">
          <BotMessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">AI Analysis</h2>
        </div>
        <ExportButton />
      </div>
      <AnimatePresence mode="wait">
        {isLoading && !analyticsData ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <KpiCardSkeleton key={i} />)}
            </div>
          </motion.div>
        ) : hasKpis || hasCharts || hasFunnel || hasSegmentation ? (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {hasKpis && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {analyticsData.kpis?.map((kpi: KpiCardProps) => (
                  <KpiCard key={kpi.title} {...kpi} />
                ))}
              </div>
            )}
            <div className="grid gap-6 lg:grid-cols-2">
              {hasCharts && (
                <div>
                  {analyticsData.charts?.map((chart: Chart, index) => {
                    if (chart.type === 'user_acquisition') {
                      return <UserAcquisitionChart key={index} data={chart.data} />;
                    }
                    return null;
                  })}
                </div>
              )}
              {hasFunnel && (
                <div>
                  <SalesFunnelChart data={analyticsData.funnel! as FunnelStep[]} />
                </div>
              )}
              {hasSegmentation && (
                <div className="lg:col-span-2">
                  <CustomerSegmentationChart data={analyticsData.segmentation! as Segmentation} />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-12 text-center h-80"
          >
            <BarChart className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800">Analytics Dashboard</h3>
            <p className="mt-2 text-sm text-slate-500">
              Your data visualizations will appear here.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try asking: <span className="font-medium text-indigo-600">"Show me last month's KPIs"</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}