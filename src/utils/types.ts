export interface ICallback<T> {
    (value: T): void;
}

export interface ISearchItem {
    readonly imdbID: string;
    readonly Title: string;
    readonly Type: string;
    readonly Year: string;
    readonly Poster: string;
}