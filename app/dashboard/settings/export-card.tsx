"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";

interface ExportCardProps {
  analyses: any[]; 
}

export function ExportCard({ analyses }: ExportCardProps) {
  const handleCsvExport = () => {
    if (!analyses) return;
    
    const csvData = analyses.map(analysis => ({
      date: new Date(analysis.created_at).toLocaleDateString(),
      company: analysis.companies?.name,
      patent_id: analysis.patent_id,
      risk_level: analysis.risk_level,
      summary: analysis.analysis_data?.summary?.replace(/,/g, ';').replace(/\n/g, ' ') || '',
      risk_assessment: analysis.analysis_data?.risk_assessment?.replace(/,/g, ';').replace(/\n/g, ' ') || '',
      recommendations: analysis.analysis_data?.recommendations?.replace(/,/g, ';').replace(/\n/g, ' ') || '',
    }));

    const csv = [
      ['Date', 'Company', 'Patent ID', 'Risk Level', 'Summary', 'Risk Assessment', 'Recommendations'],
      ...csvData.map(row => [
        row.date, 
        row.company, 
        row.patent_id, 
        row.risk_level,
        row.summary,
        row.risk_assessment,
        row.recommendations
      ])
    ].map(row => row.join(',')).join('\n');

    const timestamp = new Date().toISOString().split('T')[0];
    createDownload(csv, `patent-analyses-summary-${timestamp}.csv`, 'text/csv');
  };

  const handleJsonExport = () => {
    if (!analyses) return;

    const fullExport = analyses.map(analysis => ({
      date: new Date(analysis.created_at).toLocaleDateString(),
      company: analysis.companies?.name,
      patent_id: analysis.patent_id,
      risk_level: analysis.risk_level,
      analysis_data: analysis.analysis_data,
      created_at: analysis.created_at,
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    createDownload(
      JSON.stringify(fullExport, null, 2), 
      `patent-analyses-full-${timestamp}.json`, 
      'application/json'
    );
  };

  const createDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Export Data</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Summary Export (CSV)</p>
              <p className="text-sm text-muted-foreground">
                Download a spreadsheet-friendly summary of your analyses
              </p>
            </div>
            <Button onClick={handleCsvExport} variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Complete Export (JSON)</p>
              <p className="text-sm text-muted-foreground">
                Download full analysis reports with complete details
              </p>
            </div>
            <Button onClick={handleJsonExport} variant="outline" size="sm">
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            Total analyses available: {analyses.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 