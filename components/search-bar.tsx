"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 gap-2 top-1/2 transform -translate-y-1/2 text-[#8D8D8D] w-4 h-4 " />
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="pl-10 bg-[#EBEBEB] rounded-full border border-[#DCDCDC] h-8.5 flex-1 focus-visible:ring-0 focus-visible:border-[#DCDCDC] shadow-none"
      />
    </div>
  );
}
