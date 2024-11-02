import { createClient } from "@/utils/supabase/server";
import { AnalysisList } from "@/components/analysis/analysis-list";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';
import type { Analysis, SupabaseAnalysis } from "@/types";

export default async function HistoryPage() {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      redirect('/login');
    }

    const { data, error: analysesError } = await supabase
      .from('analyses')
      .select(`
        id,
        patent_id,
        analysis_date,
        risk_level,
        created_at,
        companies (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .returns<SupabaseAnalysis[]>();

    if (analysesError) {
      console.error('Error fetching analyses:', analysesError);
      return null;
    }

    // Transform the data to ensure companies is never null
    const analyses: Analysis[] = (data || []).filter(
      (analysis): analysis is Analysis => analysis.companies !== null
    );

    return (
      <div className="container max-w-7xl mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analysis History</h1>
        </div>
        <Card className="p-0">
          <AnalysisList analyses={analyses} />
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
} 