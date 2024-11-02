export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string  // uuid
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string  // uuid
          company_id: string | null  // uuid
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          name?: string
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}
