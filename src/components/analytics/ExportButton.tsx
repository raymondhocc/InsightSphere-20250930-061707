import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/hooks/useChatStore';
import { toast } from 'sonner';
export function ExportButton() {
  const analyticsData = useChatStore((state) => state.analyticsData);
  const hasData = analyticsData && (
    (analyticsData.kpis && analyticsData.kpis.length > 0) ||
    (analyticsData.charts && analyticsData.charts.length > 0) ||
    (analyticsData.funnel && analyticsData.funnel.length > 0) ||
    (analyticsData.segmentation && analyticsData.segmentation.length > 0)
  );
  const convertToCSV = () => {
    if (!hasData) return '';
    let csv = '';
    if (analyticsData.kpis?.length) {
      csv += 'KPIs\n';
      csv += 'Title,Value,Change,Change Type,Icon\n';
      analyticsData.kpis.forEach(kpi => {
        csv += `${kpi.title},${kpi.value},${kpi.change},${kpi.changeType},${kpi.icon}\n`;
      });
      csv += '\n';
    }
    if (analyticsData.charts?.length) {
      analyticsData.charts.forEach(chart => {
        if (chart.type === 'user_acquisition' && chart.data?.length) {
          csv += 'User Acquisition\n';
          const headers = Object.keys(chart.data[0]);
          csv += headers.join(',') + '\n';
          chart.data.forEach((row: any) => {
            csv += headers.map(header => row[header]).join(',') + '\n';
          });
          csv += '\n';
        }
      });
    }
    if (analyticsData.funnel?.length) {
      csv += 'Sales Funnel\n';
      csv += 'Stage,Value\n';
      analyticsData.funnel.forEach(item => {
        csv += `${item.stage},${item.value}\n`;
      });
      csv += '\n';
    }
    if (analyticsData.segmentation?.length) {
      csv += 'Customer Segmentation\n';
      csv += 'Name,Value\n';
      analyticsData.segmentation.forEach(item => {
        csv += `${item.name},${item.value}\n`;
      });
      csv += '\n';
    }
    return csv;
  };
  const handleExport = () => {
    const csvData = convertToCSV();
    if (!csvData) {
      toast.error("No data available to export.");
      return;
    }
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `insightsphere_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data exported successfully!");
  };
  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={!hasData}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}