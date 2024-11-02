"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data type for patent results
type PatentResult = {
  id: string;
  title: string;
  number: string;
  date: string;
  similarity: number;
  status: "pending" | "granted" | "expired";
};

// Mock data
const mockResults: PatentResult[] = [
  {
    id: "1",
    title: "Method and System for Neural Network Deep Learning",
    number: "US10839261B2",
    date: "2020-11-17",
    similarity: 0.89,
    status: "granted",
  },
  {
    id: "2",
    title: "Artificial Intelligence Training Systems",
    number: "US20210097389A1",
    date: "2021-04-01",
    similarity: 0.75,
    status: "pending",
  },
];

export function SearchResults() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <Badge variant="secondary">
            {mockResults.length} results found
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patent Number</TableHead>
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Filing Date</TableHead>
              <TableHead>Similarity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockResults.map((patent) => (
              <TableRow key={patent.id}>
                <TableCell className="font-mono">{patent.number}</TableCell>
                <TableCell>{patent.title}</TableCell>
                <TableCell>{patent.date}</TableCell>
                <TableCell>{(patent.similarity * 100).toFixed(1)}%</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patent.status === "granted"
                        ? "default"
                        : patent.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {patent.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
