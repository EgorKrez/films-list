import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './App.css';
import {ISearchItem} from "./utils/types";
import {Header} from "./components/Header";
import {Loading} from "./components/Loading";
import {SearchResults} from "./components/SearchResults";
import {Paginator} from "./components/Paginator";
import {debounce} from "./utils";

interface ISearchResults {
  Search: ISearchItem[];
  totalResults: number;
}

async function searchTitles(
    search: string,
    page: number,
    abort: AbortController,
): Promise<ISearchResults> {
  const fetchedData = await fetch(
      `https://www.omdbapi.com/?i=tt3896198&apikey=8523cbb8&s=${search}&page=${page}`,
      {
        signal: abort.signal,
      },
  );

  return await fetchedData.json();
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const abortRef = useRef(new AbortController());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState<ISearchResults>();

  const search = useCallback(async (search: string, page: number) => {
    abortRef.current.abort('reason');
    abortRef.current = new AbortController();

    setLoading(true);
    setPage(page);

    try {
      setSearchResults(await searchTitles(
          search,
          page,
          abortRef.current,
      ));
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
      debounce(
          async (searchTerm: string) => await search(searchTerm, 1),
          1000,
      ),
      [],
  );

  const paginate = async (page: number) => {
    await search(searchTerm, page)
  }

  useEffect(
      () => {
        if (!searchTerm) {
          return;
        }

        debouncedSearch(searchTerm);
      },
      [debouncedSearch, searchTerm],
  );

  return (
      <div className="wrapper">
        <Header search={searchTerm}
                onSearch={setSearchTerm}/>

        {loading && <Loading/>}

        {!loading && !!searchResults && <>
          {searchResults.totalResults !== 0 && <>
            <SearchResults searchTerm={searchTerm}
                           items={searchResults.Search}
                           total={searchResults.totalResults}/>

            <Paginator page={page}
                       perPage={searchResults.Search?.length}
                       totalItems={searchResults.totalResults}
                       onPage={paginate} />
          </>}
        </>}
      </div>
  );
}

export default App;
