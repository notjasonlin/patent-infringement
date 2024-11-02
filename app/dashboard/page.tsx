import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Clock, FileText, AlertTriangle, Activity, Search, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  // Fetch all analyses for stats
  const { data: analyses, count: analysisCount } = await supabase
    .from('analyses')
    .select('id, risk_level, created_at, companies(name)', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Calculate stats
  const recentAnalyses = analyses?.slice(0, 5) || [];
  const highRiskCount = analyses?.filter(a => a.risk_level === 'High').length || 0;
  const moderateRiskCount = analyses?.filter(a => a.risk_level === 'Moderate').length || 0;
  const lowRiskCount = analyses?.filter(a => a.risk_level === 'Low').length || 0;

  // Get timestamp of last analysis
  const lastAnalysisDate = analyses?.[0]?.created_at 
    ? new Date(analyses[0].created_at).toLocaleDateString()
    : 'None';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.email}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Analyses</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Patent analyses performed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">High Risk Patents</h3>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskCount}</div>
            <p className="text-xs text-muted-foreground">
              Total high risk patents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Recent Activity</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAnalyses.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent analyses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Last Analysis</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastAnalysisDate}
            </div>
            <p className="text-xs text-muted-foreground">
              Latest patent check
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Risk Level Distribution</h3>
          </CardHeader>
          <CardContent>
            {analyses && analyses.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">High Risk</Badge>
                    <span className="text-sm">{highRiskCount} analyses</span>
                  </div>
                  <div className="w-24 h-2 bg-red-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(highRiskCount / (analyses.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Moderate Risk</Badge>
                    <span className="text-sm">{moderateRiskCount} analyses</span>
                  </div>
                  <div className="w-24 h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${(moderateRiskCount / (analyses.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Low Risk</Badge>
                    <span className="text-sm">{lowRiskCount} analyses</span>
                  </div>
                  <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(lowRiskCount / (analyses.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/search">
              <Button className="w-full" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button className="w-full" variant="outline">
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
