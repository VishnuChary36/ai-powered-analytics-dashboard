import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { TableRow } from './types';

export interface ExportData {
  campaign: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: string;
  cpc: string;
  revenue: string;
  status: string;
  date: string;
}

export const exportToCSV = (data: TableRow[], filename: string = 'campaign-data') => {
  const exportData: ExportData[] = data.map(row => ({
    campaign: row.campaign,
    impressions: row.impressions,
    clicks: row.clicks,
    conversions: row.conversions,
    ctr: `${row.ctr.toFixed(2)}%`,
    cpc: `$${row.cpc.toFixed(2)}`,
    revenue: `$${row.revenue.toLocaleString()}`,
    status: row.status.charAt(0).toUpperCase() + row.status.slice(1),
    date: row.date
  }));

  const csv = Papa.unparse(exportData);
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
};

export const exportToPDF = (data: TableRow[], filename: string = 'campaign-data') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Campaign Performance Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
  // Prepare table data
  const tableData = data.map(row => [
    row.campaign,
    row.impressions.toLocaleString(),
    row.clicks.toLocaleString(),
    row.conversions.toLocaleString(),
    `${row.ctr.toFixed(2)}%`,
    `$${row.cpc.toFixed(2)}`,
    `$${row.revenue.toLocaleString()}`,
    row.status.charAt(0).toUpperCase() + row.status.slice(1),
    new Date(row.date).toLocaleDateString()
  ]);

  // Add table
  autoTable(doc, {
    head: [['Campaign', 'Impressions', 'Clicks', 'Conversions', 'CTR', 'CPC', 'Revenue', 'Status', 'Date']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Campaign
      1: { cellWidth: 20 }, // Impressions
      2: { cellWidth: 15 }, // Clicks
      3: { cellWidth: 18 }, // Conversions
      4: { cellWidth: 12 }, // CTR
      5: { cellWidth: 15 }, // CPC
      6: { cellWidth: 20 }, // Revenue
      7: { cellWidth: 18 }, // Status
      8: { cellWidth: 20 }, // Date
    },
  });

  // Add summary statistics
  const totalImpressions = data.reduce((sum, row) => sum + row.impressions, 0);
  const totalClicks = data.reduce((sum, row) => sum + row.clicks, 0);
  const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0);
  const avgCTR = data.reduce((sum, row) => sum + row.ctr, 0) / data.length;
  const avgCPC = data.reduce((sum, row) => sum + row.cpc, 0) / data.length;

  const finalY = (doc as any).lastAutoTable.finalY || 40;
  
  doc.setFontSize(14);
  doc.text('Summary Statistics', 14, finalY + 20);
  
  doc.setFontSize(10);
  doc.text(`Total Campaigns: ${data.length}`, 14, finalY + 30);
  doc.text(`Total Impressions: ${totalImpressions.toLocaleString()}`, 14, finalY + 40);
  doc.text(`Total Clicks: ${totalClicks.toLocaleString()}`, 14, finalY + 50);
  doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 14, finalY + 60);
  doc.text(`Average CTR: ${avgCTR.toFixed(2)}%`, 14, finalY + 70);
  doc.text(`Average CPC: $${avgCPC.toFixed(2)}`, 14, finalY + 80);

  // Save the PDF
  doc.save(`${filename}.pdf`);
};

export const exportMetricsToPDF = (metrics: any[], chartData: any, filename: string = 'analytics-report') => {
  const doc = new jsPDF();
  
  // Add title with styling
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Analytics Report', 14, 25);
  
  // Add generation date and time
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100); // Gray color
  const now = new Date();
  doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 14, 35);
  
  // Add metrics summary with better formatting
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text('Key Performance Metrics', 14, 55);
  
  // Create metrics table
  const metricsTableData = metrics.map(metric => [
    metric.title,
    metric.value,
    `${metric.change > 0 ? '+' : ''}${metric.change}%`,
    metric.changeType === 'increase' ? '↗' : '↘'
  ]);

  autoTable(doc, {
    head: [['Metric', 'Value', 'Change', 'Trend']],
    body: metricsTableData,
    startY: 65,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20, halign: 'center' },
    },
  });

  // Add chart data summary if available
  if (chartData && chartData.revenue) {
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    
    doc.setFontSize(16);
    doc.text('Revenue Trend Summary', 14, finalY + 20);
    
    const revenueData = chartData.revenue.slice(0, 10).map((item: any) => [
      item.name || item.date || 'N/A',
      `$${(item.value || item.revenue || 0).toLocaleString()}`
    ]);

    autoTable(doc, {
      head: [['Period', 'Revenue']],
      body: revenueData,
      startY: finalY + 30,
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 60, halign: 'right' },
      },
    });
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    doc.text('ADmyBRAND Analytics Dashboard', 14, doc.internal.pageSize.height - 10);
  }

  // Save the PDF
  doc.save(`${filename}.pdf`);
};