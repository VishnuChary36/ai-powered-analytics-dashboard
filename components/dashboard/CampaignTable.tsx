"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Campaign } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  Search,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker";
import { isAfter, isBefore, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignTableProps {
  data: Campaign[];
  loading?: boolean;
}

type SortField = "name" | "budget" | "reach" | "clicks" | "conversions";
type SortOrder = "asc" | "desc";

export function CampaignTable({ data, loading }: CampaignTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((item) => {
        const campaignDate = parseISO(item.date);
        return (
          (isAfter(campaignDate, dateRange.from!) || campaignDate.getTime() === dateRange.from!.getTime()) &&
          (isBefore(campaignDate, dateRange.to!) || campaignDate.getTime() === dateRange.to!.getTime())
        );
      });
    }

    // Sort data
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [data, sortField, sortOrder, statusFilter, searchTerm, dateRange]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Campaign Performance Report", 14, 15);

    autoTable(doc, {
      head: [["Campaign Name", "Status", "Budget", "Reach", "Clicks", "Conversions"]],
      body: filteredAndSortedData.map((campaign) => [
        campaign.name,
        campaign.status,
        formatCurrency(campaign.budget),
        formatNumber(campaign.reach),
        formatNumber(campaign.clicks),
        formatNumber(campaign.conversions),
      ]),
    });

    doc.save("campaigns-report.pdf");
  };

  const exportToCSV = () => {
    const headers = ["Campaign Name", "Status", "Budget", "Reach", "Clicks", "Conversions"];
    const csvData = filteredAndSortedData.map((campaign) => [
      campaign.name,
      campaign.status,
      campaign.budget,
      campaign.reach,
      campaign.clicks,
      campaign.conversions,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns-report.csv";
    a.click();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "completed":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-8 w-1/6" />
                <Skeleton className="h-8 w-1/6" />
                <Skeleton className="h-8 w-1/6" />
                <Skeleton className="h-8 w-1/6" />
                <Skeleton className="h-8 w-1/6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Marketing Campaigns</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-background">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex items-center gap-1"
                    onClick={() => handleSort("name")}
                  >
                    Campaign Name
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex items-center gap-1"
                    onClick={() => handleSort("budget")}
                  >
                    Budget
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex items-center gap-1"
                    onClick={() => handleSort("reach")}
                  >
                    Reach
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex items-center gap-1"
                    onClick={() => handleSort("clicks")}
                  >
                    Clicks
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex items-center gap-1"
                    onClick={() => handleSort("conversions")}
                  >
                    Conversions
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(campaign.status) as any}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                  <TableCell>{formatNumber(campaign.reach)}</TableCell>
                  <TableCell>{formatNumber(campaign.clicks)}</TableCell>
                  <TableCell>{formatNumber(campaign.conversions)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{" "}
            {filteredAndSortedData.length} campaigns
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}