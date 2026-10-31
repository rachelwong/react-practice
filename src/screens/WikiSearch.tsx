import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import getWikiSearch from "@/services/getWikiSearch";
import { Search } from "lucide-react";
import { useState } from "react";

type WikiHistoryItem = {
  value: string;
  date: string;
};

type WikiResult = {
  title: string;
  url: string;
};

const MAX_RESULTS = 5;

const WikiSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [history, setHistory] = useState<WikiHistoryItem[]>([]);
  const [results, setResults] = useState<WikiResult[]>([]);

  const handleSearch = async () => {
    const now = new Date();
    const newTimeStamp = now.toLocaleString("en-AU");

    try {
      const wikiSearchResults = await getWikiSearch(search);

      const parsedResults = wikiSearchResults.titles.map((title, idx) => {
        return { title, url: wikiSearchResults.urls[idx] };
      });

      setResults(parsedResults);

      const isDuplicatedSearch =
        history.findIndex(
          (x) => x.value.toLowerCase() === search.toLowerCase(),
        ) !== -1;

      if (isDuplicatedSearch) {
        setHistory((prev) => {
          return [
            { value: search, date: newTimeStamp },
            ...prev.filter(
              (x) => x.value.toLowerCase() !== search.toLowerCase(),
            ),
          ].slice(0, MAX_RESULTS);
        });
        return;
      }
      setHistory((prev) =>
        [{ value: search, date: newTimeStamp }, ...prev].slice(0, MAX_RESULTS),
      );
    } catch (err) {
      console.error("Error getting wiki search results", err);
    } finally {
      setSearch("");
    }
  };

  return (
    <ScreenLayout
      title="Wiki Search"
      brief="https://www.reactchallenges.com/challenges/wikipedia-search"
    >
      <div className="flex flex-col gap-y-6 items-center justify-start w-full ">
        <h1 className="text-2xl font-bold">Wiki fetching</h1>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Search:</CardTitle>
            <div className="flex flex-row items-center justify-between gap-x-6">
              <Input
                placeholder="Keyword search wikipedia"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                size="lg"
                disabled={!search.trim().length}
                onClick={() => {
                  handleSearch();
                }}
              >
                <Search />
                Search
              </Button>
            </div>
            <CardContent className="flex flex-row items-stretch justify-between mt-4 p-0 gap-x-6">
              <div className="flex flex-col gap-y-3 basis-1/2 p-0">
                <h2 className="text-lg font-bold">Results:</h2>
                {!!results.length && (
                  <ul>
                    {results.map((result) => {
                      return (
                        <li key={result.url}>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline"
                          >
                            {result.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-y-3 basis-1/2 p-0">
                <h2 className="text-lg font-bold">
                  Last {MAX_RESULTS} searches:
                </h2>
                {!history.length && <p>No searches available</p>}
                {!!history.length && (
                  <ul>
                    {history.map((item) => {
                      return (
                        <li key={item.value}>
                          <span className="font-bold">{item.value}</span>{" "}
                          <span>{item.date}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </ScreenLayout>
  );
};

export default WikiSearch;
