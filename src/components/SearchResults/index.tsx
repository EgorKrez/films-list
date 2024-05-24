import React from "react";
import {ISearchItem} from "../../utils/types";
import "./index.css";

export function SearchResults({
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
                    <img src={item.Poster} className="search-results__item-icon" />
                    <div className="search-results__item-labels">
                        <h1>{`Name: ${item.Title}`}</h1>
                        <h1>{`Year: ${item.Year}`}</h1>
                        <h1>{`imdbID: ${item.imdbID}`}</h1>
                        <h1>{`Type: ${item.Type}`}</h1>
                    </div>
                </div>,
            )}
        </div>
    </div>;
}