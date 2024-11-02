"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatentAnalysis } from "@/types/analysis";
import { X, Save, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface PatentAnalysisSectionProps {
  analysis: PatentAnalysis;
  companyId: string;
  onClose: () => void;
}

export function PatentAnalysisSection({ analysis, companyId, onClose }: PatentAnalysisSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const riskLevel = analysis.top_infringing_products.some(p => p.infringement_likelihood === 'High')
        ? 'High'
        : analysis.top_infringing_products.some(p => p.infringement_likelihood === 'Moderate')
        ? 'Moderate'
        : 'Low';

      const { error } = await supabase
        .from('analyses')
        .insert({
          patent_id: analysis.patent_id,
          company_id: companyId,
          analysis_data: analysis,
          risk_level: riskLevel,
          user_id: user.id,
        });

      if (error) throw error;
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Patent Infringement Analysis</h3>
          <p className="text-sm text-muted-foreground">Generated on {analysis.analysis_date}</p>
        </div>
        <div className="flex gap-2">
          {!isSaved ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Analysis
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600"
              disabled
            >
              <Check className="h-4 w-4 mr-2" />
              Saved
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {analysis.top_infringing_products.map((product, index) => (
          <div key={index} className="space-y-4 border-b pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold">{product.product_name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.infringement_likelihood === 'High' 
                  ? 'bg-red-100 text-red-700' 
                  : product.infringement_likelihood === 'Moderate'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {product.infringement_likelihood} Risk
              </span>
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
                  {product.specific_features.map((feature, i) => (
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
            {analysis.overall_risk_assessment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 