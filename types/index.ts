// Base Types
export type RiskLevel = 'High' | 'Moderate' | 'Low';

// Database Models
export interface Company {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  created_at: string;
  company_id: string;
}

export interface Patent {
  id: number;
  publication_number: string;
  title: string;
  ai_summary: string | null;
  raw_source_url: string | null;
  assignee: string | null;
  inventors: string;  
  priority_date: string;
  application_date: string;
  grant_date: string;
  abstract: string | null;
  description: string | null;
  claims: string;  
  jurisdictions: string | null;
  classifications: string;  
  application_events: string | null;
  citations: string;  
  image_urls: string;  
  landscapes: string | null;
  created_at: string;
  updated_at: string;
  publish_date: string;
  citations_non_patent: string | null;
  provenance: string | null;
  attachment_urls: string | null; 
  search_publication_number?: string;  
}

export interface Inventor {
  first_name: string;
  last_name: string;
}

// Analysis Related Types
export interface InfringingProduct {
  product_name: string;
  infringement_likelihood: RiskLevel;
  relevant_claims: string[];
  explanation: string;
  specific_features: string[];
}

export interface AnalysisData {
  analysis_id: string;
  patent_id: string;
  company_name: string;
  analysis_date: string;
  top_infringing_products: InfringingProduct[];
  overall_risk_assessment: string;
}

export interface Analysis {
  id: string;
  patent_id: string;
  analysis_date: string;
  risk_level: RiskLevel;
  analysis_data: AnalysisData;
  companies: Company;
  user_id: string;
  created_at: string;
}

export interface SupabaseAnalysis extends Omit<Analysis, 'companies'> {
  companies: Company | null;
}

// Component Props
export interface AnalysisListProps {
  analyses: Analysis[];
}

export interface SavedAnalysisViewProps {
  analysis: Analysis;
}

export interface PatentAnalysisSectionProps {
  analysis: Analysis;
  companyId: string;
  onClose: () => void;
}

export interface ComboboxProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelect: (company: Company) => void;
  onSearch: (query: string) => void;
}

export interface PatentComboboxProps {
  patents: Patent[];
  selectedPatent: Patent | null;
  onSelect: (patent: Patent) => void;
  onSearch: (query: string) => void;
}

export interface ProductListProps {
  products: Product[];
}

export interface PatentListProps {
  patents: Patent[];
}

  