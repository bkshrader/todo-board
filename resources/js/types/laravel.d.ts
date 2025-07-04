export type LengthAwarePaginator<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

export type Timestamps<C = string, U = string> = {
    created_at?: C;
    updated_at?: U;
};

export type SoftDeletes<D = string> = {
    deleted_at?: D | null;
};
