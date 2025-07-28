'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardData, TableRow as TableRowType } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV, exportToPDF } from '@/lib/exportUtils';

interface DataTableProps {
  data: DashboardData | null;
  isLoading: boolean;
  dateRange: DateRange;
  searchTerm: string;
  statusFilter: string;
  onSearchTermChange?: (term: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onDateRangeChange?: (range: DateRange) => void;
}

type SortField = keyof TableRowType;
type SortDirection = 'asc' | 'desc';

export function DataTable({ data, isLoading, dateRange, searchTerm, statusFilter, onSearchTermChange, onStatusFilterChange, onDateRangeChange }: DataTableProps) {
  const { toast } = useToast();
  // Remove local state for searchTerm and statusFilter
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!data) return;
    
    // Use filteredAndSortedData for export to include current filters
    if (format === 'csv') {
      exportToCSV(filteredAndSortedData, 'campaign-data');
    } else {
      exportToPDF(filteredAndSortedData, 'campaign-report');
    }
    
    toast({
      title: `Exported as ${format.toUpperCase()}`,
      description: `Your filtered data has been exported as ${format.toUpperCase()}.`,
    });
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let filtered = data.tableData.filter((row: TableRowType) => {
      const matchesSearch = row.campaign.toLowerCase().includes((searchTerm || '').toLowerCase());
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      const rowDate = parseISO(row.date);
      const inRange =
        (!dateRange.from || !isAfter(rowDate, dateRange.to!)) &&
        (!dateRange.to || !isBefore(rowDate, dateRange.from!));
      return matchesSearch && matchesStatus && inRange;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [data, searchTerm, statusFilter, sortField, sortDirection, dateRange]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Detailed analytics for all your marketing campaigns
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Unified filter bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange && onSearchTermChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {onDateRangeChange && (
              <div className="w-full sm:w-auto">
                <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
              </div>
            )}
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('campaign')}
                  >
                    <div className="flex items-center">
                      Campaign
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('impressions')}
                  >
                    <div className="flex items-center">
                      Impressions
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('clicks')}
                  >
                    <div className="flex items-center">
                      Clicks
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('ctr')}
                  >
                    <div className="flex items-center">
                      CTR
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('cpc')}
                  >
                    <div className="flex items-center">
                      CPC
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center">
                      Revenue
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{row.campaign}</TableCell>
                    <TableCell>{row.impressions.toLocaleString()}</TableCell>
                    <TableCell>{row.clicks.toLocaleString()}</TableCell>
                    <TableCell>{row.ctr.toFixed(2)}%</TableCell>
                    <TableCell>${row.cpc.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">${row.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(row.status)}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedData.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}