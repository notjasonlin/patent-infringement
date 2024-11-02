"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { SavedAnalysisViewProps } from "@/types";

export function SavedAnalysisView({ analysis }: SavedAnalysisViewProps) {
  const { analysis_data } = analysis;

  const getRiskVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'moderate':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/history">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{analysis.companies.name}</h1>
          <p className="text-muted-foreground">
            Analysis for {analysis.patent_id} • {formatDate(analysis.analysis_date)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Patent Infringement Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Generated on {formatDate(analysis.analysis_date)}
            </p>
          </div>
          <Badge variant={getRiskVariant(analysis.risk_level)}>
            {analysis.risk_level} Risk
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {analysis_data.top_infringing_products.map((product: any, index: number) => (
            <div key={index} className="space-y-4 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold">{product.product_name}</h4>
                <Badge variant={getRiskVariant(product.infringement_likelihood)}>
                  {product.infringement_likelihood} Risk
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Relevant Claims:</span>
                  <span className="text-sm ml-2">{product.relevant_claims.join(", ")}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Explanation:</span>
                  <p className="text-sm mt-1 text-muted-foreground whitespace-pre-wrap">
                    {product.explanation}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium">Specific Features:</span>
                  <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground">
                    {product.specific_features.map((feature: string, i: number) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Overall Risk Assessment</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {analysis_data.overall_risk_assessment}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 