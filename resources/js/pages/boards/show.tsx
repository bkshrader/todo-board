import { type Board, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { CategoryCard, CategoryHeader } from '@/components/category';
import TaskSummary from '@/components/task-summary';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Edit, Plus } from 'lucide-react';

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
            <div
                id="board-header"
                className="flex flex-row items-baseline gap-2 p-4"
            >
                <span>{board.emoji}</span>
                <h1 className="text-lg font-semibold">{board.name}</h1>
                <span className="text-sm italic">{board.description}</span>
                <div className="ml-auto self-center">
                    <Link
                        href={route('boards.edit', { board: board.id })}
                        className="flex align-middle"
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                </div>
            </div>
            <div className="flex h-full w-full flex-row justify-items-stretch gap-4 overflow-x-auto rounded-lg p-4">
                {(board.categories?.length &&
                    board.categories.map((category) => (
                        <CategoryCard key={category.id}>
                            <CategoryHeader category={category} />
                            <ul className="flex flex-col gap-2 overflow-y-auto">
                                {board.tasks
                                    ?.filter((task) => task.category_id === category.id)
                                    .map((task) => (
                                        <TaskSummary
                                            key={`task-${task.id}`}
                                            task={task}
                                        />
                                    ))}
                            </ul>
                        </CategoryCard>
                    ))) || (
                    <>
                        <CategoryCard className="p-0">
                            <PlaceholderPattern className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </CategoryCard>
                    </>
                )}
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="absolute right-6 bottom-6">
                        <Link href={route('tasks.create', { board: board.id })}>
                            <Button className="h-12 w-12">
                                <Plus />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>Create New Task</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </AppLayout>
    );
}
