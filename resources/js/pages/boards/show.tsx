import { type Board, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { CategoryCard, CategoryHeader } from '@/components/category';
import AppLayout from '@/layouts/app-layout';
import { Edit } from 'lucide-react';

export default function Show({ board }: { board: Board }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Boards',
            href: route('boards.index'),
        },
        {
            title: board.name,
            href: route('boards.show', { board: board }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={board.name} />
            <div id="board-header" className="flex flex-row items-baseline gap-2 p-4">
                <span>{board.emoji}</span>
                <h1 className="text-lg font-semibold">{board.name}</h1>
                <span className="text-sm italic">{board.description}</span>
                <div className="ml-auto self-center">
                    <Link href={route('boards.edit', { board: board.id })} className="flex align-middle">
                        <Edit className="h-4 w-4" />
                    </Link>
                </div>
            </div>
            <div className="flex h-full w-full flex-row justify-items-stretch gap-4 overflow-x-scroll rounded-lg p-4">
                {board.categories?.map((category) => (
                    <CategoryCard key={category.id}>
                        <CategoryHeader category={category} />
                    </CategoryCard>
                ))}
            </div>
        </AppLayout>
    );
}
