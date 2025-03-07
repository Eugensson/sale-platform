import { SearchIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { getAllCategories } from "@/lib/actions/product.actions";

export const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action="/search" method="GET" className="flex items-stretch h-10">
      <Select name="category">
        <SelectTrigger className="w-auto h-full bg-gray-50 text-gray-950 dark:border-gray-50   border-r rounded-r-none rounded-l-md">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="flex-1 rounded-none bg-gray-50 text-gray-950 dark:border-gray-50 text-base h-full"
        placeholder="Search..."
        name="q"
        type="search"
      />
      <Button
        variant="ghost"
        type="submit"
        className="rounded-s-none rounded-e-md h-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-50"
      >
        <SearchIcon />
      </Button>
    </form>
  );
};
