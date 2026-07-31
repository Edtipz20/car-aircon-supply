import { SearchIcon } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";

const Search = () => {
  return (
    <div>
      <Link href="/">
        <SearchIcon size={20} />
      </Link>
    </div>
  );
};

export default Search;
