import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './App.css';

interface ICallback<T> {
  (value: T): void;
}

interface ISearchItem {
  readonly imdbID: string;
  readonly Title: string;
  readonly Type: string;
  readonly Year: string;
  readonly Poster: string;
}

interface ISearchResults {
  Search: ISearchItem[];
  totalResults: number;
}


function UserIcon() {
  return <svg height="20px"
              width="20px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 60.671 60.671"
              xmlSpace="preserve">
    <g>
      <g>
        <ellipse style={{ fill: '#010002' }}
                 cx="30.336"
                 cy="12.097"
                 rx="11.997"
                 ry="12.097"/>
        <path style={{ fill: '#010002' }}
              d="M35.64,30.079H25.031c-7.021,0-12.714,5.739-12.714,12.821v17.771h36.037V42.9
			C48.354,35.818,42.661,30.079,35.64,30.079z"/>
      </g>
    </g>
  </svg>;
}

function Header({
                  search,
                  onSearch,
                }: {
  onSearch: ICallback<string>;
  search: string;
}) {
  return <div className="header">
    <div className="header__logo">Movie Catalog</div>

    <input placeholder="Search title"
           className="header__search"
           value={search}
           onChange={e => onSearch(e.target.value)}/>


    <div className="header__user">
      <UserIcon/>
      <div>Egor Krezzzz</div>
      <div>▼</div>
    </div>
  </div>;
}


function SearchResults({
                         searchTerm,
                         total,
                         items,
                       }: {
  searchTerm?: string;
  items: ISearchItem[],
  total: number
}) {
  return <div className="search-results">
    <div className="search-results__stat">
      You searched for: {searchTerm}, {total ?? 0} results found
    </div>

    <div className="search-results__items">
      {items?.map(item =>
          <div key={item.imdbID}
               className="search-results__item">
            {item.Title}
          </div>,
      )}
    </div>
  </div>;
}

function debounce<T extends Function>(
    callback: T,
    delay: number = 1000,
): T {
  let lastCall = -1;
  let timeoutId: any;
  let lastArgs: any;

  const debouncedCallback = (...args: any[]) => {
    lastArgs = args;

    clearTimeout(timeoutId);

    if (lastCall !== -1) {
      if (performance.now() - lastCall >= delay) {
        callback(...lastArgs);
        lastCall = -1;
      } else {
        timeoutId = setTimeout(
            () => {
              callback(...lastArgs);
              lastCall = -1;
            },
            delay,
        );
      }
    }

    lastCall = performance.now();
  };

  return debouncedCallback as unknown as T;
}

async function searchTitles(
    search: string,
    page: number,
    abort: AbortController,
): Promise<ISearchResults> {
  const r = await fetch(
      `https://www.omdbapi.com/?i=tt3896198&apikey=8523cbb8&s=${search}&page=${page}`,
      {
        signal: abort.signal,
      },
  );

  return await r.json();
}


function Loading() {
  return <div className="loading">LOADING</div>;
}

function Paginator({
                     page,
                     totalItems,
                     perPage,
                     onPage
                   }: {
  page: number,
  totalItems: number,
  perPage: number;
  onPage: ICallback<number>
}) {
  return <div className="paginator">
    {Array.from({ length: parseInt(`${totalItems / perPage}`) }).map(
        (
            _,
            i,
        ) => <div onClick={() => onPage(i + 1)} className={`paginator__item ${page === i + 1 && `paginator__item_active`}`}>{i + 1}</div>,
    )}
  </div>;
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
      <div>
        <Header search={searchTerm}
                onSearch={setSearchTerm}/>

        {loading && <Loading/>}

        {!loading && !!searchResults && <>
          {!!searchTerm && searchResults.totalResults === 0 &&
              <div className="search-results__empty">No results found</div>
          }

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
