import { LengthAwarePaginator } from '@/types/laravel';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function PaginatorControls<T>({ page }: { page: LengthAwarePaginator<T> }) {
    const [error, setError] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(page.current_page.toString());
    const [debouncedPage] = useDebounce(currentPage, 300);
    useEffect(() => {
        // Clear existing errors
        setError(undefined);

        // Validate input is a number
        const targetPage = parseInt(debouncedPage);
        if (Number.isNaN(targetPage)) {
            setError('Page is not a number');
            return;
        }

        // Validate input is in range
        if (targetPage < 1 || targetPage > page.last_page) {
            setError('Page is out of range');
            return;
        }

        // Abort if target page is current page
        if (targetPage === page.current_page) {
            return;
        }

        // Route to selected page when it changes
        var cancel;
        router.visit(route('boards.index', { _query: { page: targetPage } }), {
            preserveState: true,
            onCancelToken: ({ cancel: cancelToken }) => (cancel = cancelToken),
        });

        return cancel;
    }, [debouncedPage]);

    return (
        <div className="ms-auto flex flex-row justify-items-end gap-2 px-1">
            <Link href={page.first_page_url}>
                <ChevronsLeft />
            </Link>
            <Link href={page.prev_page_url || ''} disabled={!page.prev_page_url}>
                <ChevronLeft />
            </Link>
            <div>
                <input
                    id="currentPage"
                    data-error={error}
                    className="w-4 text-center data-[error]:underline data-[error]:decoration-red-700 data-[error]:decoration-wavy"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(e.target.value)}
                    onBlur={() => setCurrentPage(page.current_page.toString())}
                />
                <span> of {page.last_page}</span>
            </div>
            <Link href={page.next_page_url || ''} disabled={!page.next_page_url}>
                <ChevronRight />
            </Link>
            <Link href={page.last_page_url}>
                <ChevronsRight />
            </Link>
        </div>
    );
}
