'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import { exportToCSV, exportToPDF, exportMetricsToPDF } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { TableRow, DashboardData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FloatingExportButtonProps {
  data?: TableRow[] | DashboardData | null;
  type: 'table' | 'analytics' | 'campaigns';
  filename?: string;
  className?: string;
}

export function FloatingExportButton({ 
  data, 
  type, 
  filename = 'export-data',
  className
}: FloatingExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!data) {
      toast({
        title: "No Data Available",
        description: "There's no data to export at the moment.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (type === 'table' || type === 'campaigns') {
        const tableData = Array.isArray(data) ? data : (data as DashboardData).tableData;
        
        if (format === 'csv') {
          exportToCSV(tableData, filename);
        } else {
          exportToPDF(tableData, filename);
        }
      } else if (type === 'analytics') {
        const dashboardData = data as DashboardData;
        if (format === 'pdf') {
          exportMetricsToPDF(dashboardData.metrics, dashboardData.chartData, filename);
        } else {
          const metricsData = dashboardData.metrics.map(metric => ({
            title: metric.title,
            value: metric.value,
            change: `${metric.change > 0 ? '+' : ''}${metric.change}%`,
            changeType: metric.changeType
          }));
          
          const Papa = await import('papaparse');
          const csv = Papa.unparse(metricsData);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      }

      toast({
        title: `Export Successful`,
        description: `Your data has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50",
      className
    )}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 h-14 w-14 p-0"
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Quick Export</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="cursor-pointer"
          >
            <Table className="w-4 h-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}