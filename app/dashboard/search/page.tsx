import { SearchPatents } from "@/components/search/search-patents";

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analyze Patents</h1>
      </div>
      
      <div className="space-y-6">
        <SearchPatents />
      </div>
    </div>
  );
}
