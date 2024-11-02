export interface ProductAnalysis {
  product_name: string;
  infringement_likelihood: "High" | "Moderate" | "Low";
  relevant_claims: string[];
  explanation: string;
  specific_features: string[];
}

export interface PatentAnalysis {
  analysis_id: string;
  patent_id: string;
  company_name: string;
  analysis_date: string;
  top_infringing_products: ProductAnalysis[];
  overall_risk_assessment: string;
} 