"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";

type Company = {
  id: string;
  name: string;
};

export function SearchPatents() {
  const [patentId, setPatentId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const supabase = createClient();

  const searchCompanies = async (query: string) => {
    if (!query) return;
    
    console.log('Searching database for:', query);

    const { data, error } = await supabase
      .from('companies')
      .select('id, name')
      .ilike('search_name', `%${query}%`);

    console.log('Database response:', { data, error });

    if (error) {
      console.error('Error:', error);
      return;
    }

    setCompanies(data || []);
  };

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .limit(1);
      
      console.log('Test query result:', { data, error });
    };

    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !patentId) return;
    
    setIsSearching(true);
    try {
      // Your analysis logic here
      console.log("Analyzing:", selectedCompany.name, patentId);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Combobox
            companies={companies}
            selectedCompany={selectedCompany}
            onSelect={setSelectedCompany}
            onSearch={searchCompanies}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patent-id">Patent ID</Label>
          <Input
            id="patent-id"
            placeholder="Enter patent ID..."
            value={patentId}
            onChange={(e) => setPatentId(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isSearching || !selectedCompany || !patentId.trim()}
            className="w-full sm:w-auto"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Patent
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setSelectedCompany(null);
              setPatentId("");
            }}
            disabled={isSearching}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}

