import { SearchPatents } from "@/components/search/search-patents";
import { SearchResults } from "@/components/search/search-results";

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Search Patents</h1>
      </div>
      
      <div className="space-y-6">
        <SearchPatents />
        <SearchResults />
      </div>
    </div>
  );
}
