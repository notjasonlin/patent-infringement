import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SavedAnalysisView } from "@/components/analysis/saved-analysis-view";
import type { Analysis, SupabaseAnalysis } from "@/types";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>,
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch analysis
  const { data, error } = await supabase
    .from('analyses')
    .select(`
      id, patent_id, analysis_date, risk_level, 
      analysis_data, created_at, 
      companies ( id, name )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .returns<SupabaseAnalysis>()
    .single();

  if (error || !data) notFound();

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <SavedAnalysisView 
        analysis={data as Analysis} 
      />
    </div>
  );
}
