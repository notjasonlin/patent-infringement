"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisListProps } from "@/types";

export function AnalysisList({ analyses }: AnalysisListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Patent ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Risk Level</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {analyses.map((analysis) => (
          <TableRow key={analysis.id}>
            <TableCell>{analysis.companies.name}</TableCell>
            <TableCell>{analysis.patent_id}</TableCell>
            <TableCell>{formatDate(analysis.analysis_date)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  analysis.risk_level === 'High' 
                    ? 'destructive' 
                    : analysis.risk_level === 'Moderate' 
                    ? 'secondary' 
                    : 'outline'
                }
              >
                {analysis.risk_level}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href={`/dashboard/history/${analysis.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 