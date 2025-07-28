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

interface ExportButtonProps {
  data?: TableRow[] | DashboardData;
  type: 'table' | 'analytics' | 'campaigns';
  filename?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportButton({ 
  data, 
  type, 
  filename = 'export-data', 
  className,
  variant = 'outline',
  size = 'sm'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
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

    try {
      // Add a small delay to show loading state
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
          // For analytics CSV, export metrics data
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          disabled={isExporting}
        >
          <Table className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}