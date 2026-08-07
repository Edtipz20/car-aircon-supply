import { Input } from "@/components/ui/input";

const SearchBar = ({
  defaultQuery,
  category,
}: {
  defaultQuery?: string;
  category?: string;
}) => {
  return (
    <form
      action="/search"
      method="GET"
      className="flex w-full max-w-2xl mx-auto mb-8"
    >
      {category && <input type="hidden" name="category" value={category} />}
      <Input
        type="text"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Search our store"
        className="h-15 flex-1 rounded-none border-2 border-gray-300 border-r-0 focus-visible:border-accent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
      />
      <button
        type="submit"
        className="px-8 bg-accent hover:bg-accent-dark text-white font-semibold text-sm tracking-wide shrink-0 focus:outline-none focus-visible:ring-0 hover:cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
