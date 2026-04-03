import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = ({ 
  search, 
  onSearchChange 
}: { 
  search: string; 
  onSearchChange: (query: string) => void;
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleIconClick = () => {
    onSearchChange(localSearch);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-4">
      <SearchIcon 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600" 
        onClick={handleIconClick}
      />
      <input
        type="text"
        placeholder="Search..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};

export default Search;
