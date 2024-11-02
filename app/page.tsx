import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Index() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Checkr
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Your AI-powered patent infringement assistant. Analyze patents, detect potential conflicts, 
          and protect your intellectual property with confidence.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Button asChild size="lg" variant="default">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
        Made By Jason Lin
      </div>  
    </div>
  );
}
