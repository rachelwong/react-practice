import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { useRef, useState, type ChangeEvent } from "react";

const CountrySearch = () => {
  const [search, setSearch] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCountries = async (): Promise<string[]> => {
    const response = await fetch("/CountryData.json").then((res) => res.json());
    return response.countries;
  };

  // if using lodash, wrap this function in debounce, with a 500 delay
  // const [debouncedFetch] = useState(() => debounce(fetchSuggestions, 500));

  const fetchSuggestions = async (value: string) => {
    try {
      setLoading(true);
      // mocking slow api response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const countries = await getCountries();

      const results = countries.filter((x) =>
        !!value.trim().length
          ? x.toLowerCase().includes(value.toLowerCase())
          : x,
      );
      setSuggestions(results.sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      console.error(`Error fetching suggestions with term: ${value}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    // clean up previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // debounce/wait before calling the api to fetch
    debounceTimer.current = setTimeout(() => fetchSuggestions(value), 500);
  };

  return (
    <Layout
      heading={
        <>
          <h3>Country search with autocomplete</h3>
          <p>
            Original brief here{" "}
            <a
              href="https://www.reactgrind.com/problems/react-autocomplete"
              target="https://www.reactgrind.com/problems/react-autocomplete"
            >
              https://www.reactgrind.com/problems/react-autocomplete
            </a>
          </p>
          <p>Countries are from a raw json file stored locally</p>
        </>
      }
    >
      <div className="relative flex flex-col w-full h-full">
        <div className="input-container relative block">
          <Input
            className="relative input w-full "
            placeholder="Search for countries"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
            }}
          />
          {!loading && !!search && (
            <div className="absolute suggestions top-10 left-0 block border-1 w-full h-auto z-10 bg-neutral-100">
              {!!suggestions.length && (
                <div className="flex flex-col justify-start align-start">
                  {suggestions.slice(0, 5).map((suggest) => (
                    <button
                      key={suggest}
                      className="px-4 py-2 text-left hover:bg-sky-200"
                    >
                      <span>{suggest}</span>
                    </button>
                  ))}
                </div>
              )}
              {!suggestions.length && <p>No results</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CountrySearch;
