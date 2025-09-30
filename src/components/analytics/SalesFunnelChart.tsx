import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from 'lucide-react';
export interface FunnelData {
  stage: string;
  value: number;
}
interface SalesFunnelChartProps {
  data: FunnelData[];
}
const colors = [
  'hsl(var(--primary))',
  'hsl(var(--primary) / 0.8)',
  'hsl(var(--primary) / 0.6)',
  'hsl(var(--primary) / 0.4)',
  'hsl(var(--primary) / 0.2)',
];
export function SalesFunnelChart({ data }: SalesFunnelChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Sales Funnel
        </CardTitle>
        <Filter className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Funnel
                dataKey="value"
                data={chartData}
                isAnimationActive
              >
                <LabelList
                  position="right"
                  fill="hsl(var(--foreground))"
                  stroke="none"
                  dataKey="stage"
                  formatter={(value: string) => value}
                  className="text-sm font-medium"
                />
                <LabelList
                  position="center"
                  fill="hsl(var(--primary-foreground))"
                  stroke="none"
                  dataKey="value"
                  formatter={(value: number) => value.toLocaleString()}
                  className="text-base font-bold"
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}