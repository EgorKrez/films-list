import {ICallback} from "../../utils/types";
import React from "react";
import './index.css';

export function Paginator({
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