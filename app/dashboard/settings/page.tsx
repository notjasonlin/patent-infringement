import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";
import { ExportCard } from "./export-card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch all analyses for export with complete data
  const { data: analyses } = await supabase
    .from('analyses')
    .select(`
      id,
      patent_id,
      analysis_date,
      risk_level,
      analysis_data,
      created_at,
      companies (
        id,
        name
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Profile Settings</h2>
          </CardHeader>
          <CardContent>
            <SettingsForm initialData={profile} />
          </CardContent>
        </Card>

        <ExportCard analyses={analyses || []} />
      </div>
    </div>
  );
} 