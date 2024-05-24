import React from "react";
import {ICallback} from "../../utils/types";
import {UserIcon} from "../UserIcon";
import './index.css';

export function Header({
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