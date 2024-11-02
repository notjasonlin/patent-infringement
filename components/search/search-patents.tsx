"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { ProductList } from "@/components/search/product-list";
import { PatentList } from "@/components/search/patent-list";
import { Company, Product, Patent } from "@/types";
import { PatentCombobox } from "@/components/ui/patent-combobox";
import { PatentAnalysisSection } from "@/components/analysis/patent-analysis";
import { PatentAnalysis } from "@/types/analysis";

export function SearchPatents() {
  const [patentId, setPatentId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [analysis, setAnalysis] = useState<PatentAnalysis | null>(null);
  const supabase = createClient();

  const searchCompanies = async (query: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name')
      .ilike('search_name', query ? `%${query}%` : '%')
      .limit(10)
      .order('name');

    if (error) {
      console.error('Error:', error);
      return;
    }

    setCompanies(data || []);
  };

  useEffect(() => {
    searchCompanies("");
  }, []);

  const fetchProducts = async (companyId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, created_at, company_id')
      .eq('company_id', companyId)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data || []);
  };

  const searchPatents = async (query: string) => {
    if (!query) {
      const { data, error } = await supabase
        .from('patents')
        .select('*')
        .order('publication_number')
        .limit(100);

      console.log('All patents:', data);
      
      if (error) {
        console.error('Error loading patents:', error);
        return;
      }

      setPatents(data || []);
      return;
    }

    const cleanQuery = query.toUpperCase();
    
    const { data, error } = await supabase
      .rpc('search_patents_fuzzy', { search_term: cleanQuery });

    console.log('Search results:', { data, error });

    if (error) {
      console.error('Error searching patents:', error);
      return;
    }

    setPatents(data || []);
  };

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('patents')
        .select('publication_number')
        .limit(5);
      
      console.log('Initial test query:', { data, error });
    };

    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !selectedPatent) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patentId: selectedPatent.publication_number,
          companyName: selectedCompany.name,
          products: products,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Combobox
              companies={companies}
              selectedCompany={selectedCompany}
              onSelect={(company) => {
                setSelectedCompany(company);
                fetchProducts(company.id);
              }}
              onSearch={searchCompanies}
            />
          </div>

          {selectedCompany && products.length > 0 && (
            <ProductList products={products} />
          )}

          <div className="space-y-2">
            <Label htmlFor="patent-id">Patent ID</Label>
            <PatentCombobox
              patents={patents}
              selectedPatent={selectedPatent}
              onSelect={(patent) => {
                console.log('Selected patent:', patent);
                setSelectedPatent(patent);
                setPatentId(patent.publication_number);
              }}
              onSearch={searchPatents}
            />
          </div>

          {selectedPatent && (
            <div className="border rounded-md bg-muted/10">
              <PatentList patents={[selectedPatent]} />
            </div>
          )}

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

      {analysis && (
        <PatentAnalysisSection 
          analysis={analysis}
          companyId={selectedCompany?.id || ''}
          onClose={() => setAnalysis(null)}
        />
      )}
    </div>
  );
}

