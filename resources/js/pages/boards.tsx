import PaginatorControls from '@/components/ui/paginator-controls';
import AppLayout from '@/layouts/app-layout';
import { Board, type BreadcrumbItem } from '@/types';
import { LengthAwarePaginator } from '@/types/laravel';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Boards',
        href: '/boards',
    },
];

type BoardsProps = {
    boards: LengthAwarePaginator<Board>;
};

export default function Boards({ boards }: BoardsProps) {
    const openBoard = (board: Board) => () => {
        router.visit(route('boards.show', { board: board.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Boards" />
            <div className="flex h-full flex-1 flex-col justify-stretch gap-1 p-4">
                {/* TODO make or import better table component and implement sorting */}
                <table className="flex-grow border-separate rounded border-1 border-white dark:border-black">
                    <thead className="bg-neutral-200 text-left dark:bg-neutral-700">
                        <tr>
                            <th className="rounded-tl p-1">Name</th>
                            <th className="p-1">Description</th>
                            <th className="p-1">Visibility</th>
                            <th className="rounded-tr p-1">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boards.data.map((board) => (
                            <tr
                                className="max-h-8 bg-neutral-50 last:rounded-b even:bg-neutral-100 hover:bg-white dark:bg-neutral-800 dark:even:bg-neutral-900 hover:dark:bg-neutral-600"
                                key={board.id}
                                onClick={openBoard(board)}
                            >
                                <td className="p-1">{board.name}</td>
                                <td className="p-1">{board.description}</td>
                                <td className="p-1 capitalize">{board.visibility}</td>
                                <td className="p-1">{board.updated_at && new Date(board.updated_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <PaginatorControls page={boards} />
            </div>
        </AppLayout>
    );
}
