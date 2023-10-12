type Options = {
    headers?: object;
    [key: string]: unknown;
};
export type FetchErrorEventType = CustomEvent<{
    errors: string[];
}>;
export declare function throwFetchErrorEvent(errors?: string[]): void;
export declare function listenForFetchErrorEvent(callback: (event: FetchErrorEventType) => void): () => void;
export type FetchProps = (url: string, options?: Options) => Promise<Response>;
export default function (url: string, { headers, ...opts }?: Options): Promise<Response>;
export {};
