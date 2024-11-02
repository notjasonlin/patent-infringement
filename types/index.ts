export type Company = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  company_id: string;
};

export type Patent = {
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
};

export type Inventor = {
    first_name: string;
    last_name: string;
  };
