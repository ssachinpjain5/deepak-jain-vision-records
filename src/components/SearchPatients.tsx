
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";

interface SearchPatientsProps {
  onSearch: (query: string, searchType: "name" | "mobile") => void;
}

const SearchPatients = ({ onSearch }: SearchPatientsProps) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "mobile">("name");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, searchType);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="searchQuery">Search Query</Label>
            <Input
              id="searchQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === "name" ? "Enter patient name" : "Enter mobile number"}
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label>Search By</Label>
          <RadioGroup 
            value={searchType} 
            onValueChange={(value) => setSearchType(value as "name" | "mobile")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="name" id="name" />
              <Label htmlFor="name" className="cursor-pointer">Patient Name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mobile" id="mobile" />
              <Label htmlFor="mobile" className="cursor-pointer">Mobile Number</Label>
            </div>
          </RadioGroup>
        </div>
      </form>
    </div>
  );
};

export default SearchPatients;
