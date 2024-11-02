"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Patent, Inventor } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PatentListProps {
  patents: Patent[];
}

export function PatentList({ patents }: PatentListProps) {
  const formatInventors = (inventorsString: string) => {
    try {
      const inventors = JSON.parse(inventorsString) as Inventor[];
      return inventors
        .map(inv => `${inv.first_name} ${inv.last_name}`.trim())
        .join(", ");
    } catch {
      return "No inventors listed";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Publication Number</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Priority Date</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patents.map((patent) => (
            <TableRow key={patent.id}>
              <TableCell className="max-w-md truncate">
                {patent.title}
              </TableCell>
              <TableCell className="font-medium">
                {patent.publication_number}
              </TableCell>
              <TableCell>{patent.assignee || "N/A"}</TableCell>
              <TableCell>{formatDate(patent.priority_date)}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{patent.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Publication Details</h3>
                          <p><span className="font-medium">Publication Number:</span> {patent.publication_number}</p>
                          <p><span className="font-medium">Assignee:</span> {patent.assignee || "N/A"}</p>
                          <p><span className="font-medium">Inventors:</span> {formatInventors(patent.inventors)}</p>
                          <p><span className="font-medium">Priority Date:</span> {formatDate(patent.priority_date)}</p>
                          <p><span className="font-medium">Grant Date:</span> {formatDate(patent.grant_date)}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Additional Information</h3>
                          <p><span className="font-medium">Jurisdictions:</span> {patent.jurisdictions || "N/A"}</p>
                          <p><span className="font-medium">Application Date:</span> {formatDate(patent.application_date)}</p>
                          <p><span className="font-medium">Provenance:</span> {patent.provenance || "N/A"}</p>
                        </div>
                      </div>

                      {patent.abstract && (
                        <div>
                          <h3 className="font-semibold mb-2">Abstract</h3>
                          <p className="whitespace-pre-wrap">{patent.abstract}</p>
                        </div>
                      )}

                      {patent.description && (
                        <div>
                          <h3 className="font-semibold mb-2">Description</h3>
                          <p className="whitespace-pre-wrap line-clamp-4">
                            {patent.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 