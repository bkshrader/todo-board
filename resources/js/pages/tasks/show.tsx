import { Head, Link, router } from '@inertiajs/react';

import DestroyButton from '@/components/button-destroy';
import Markdown from '@/components/text-markdown';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    type SelectValueChangedEventHandler,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import { Category, Task } from '@/types';
import { Archive, EditIcon, Trash } from 'lucide-react';

type ShowTaskProps = {
    task: Task;
    categories: Category[];
};

function DetailItem({ label, children }: React.PropsWithChildren<{ label: string }>) {
    return (
        <>
            <h4 className="font-semibold">{label}</h4>
            {children || <div />}
        </>
    );
}

export default function Show({ task }: ShowTaskProps) {
    const breadcrumbs = [
        {
            title: 'Boards',
            href: route('boards.index'),
        },
        {
            title: task.board!.name,
            href: route('boards.show', { board: task.board!.id }),
        },
        {
            title: task.name,
            href: route('tasks.show', { task: task.id }),
        },
    ];

    const onCategoryChanged: SelectValueChangedEventHandler = (value) => {
        console.log('Category changed to', value);
        router.put(route('tasks.update', { task: task.id }), {
            category_id: parseInt(value),
        });
    };

    const deleteTask = () => {
        alert('TODO: Delete Task');
    };

    const archiveTask = () => {
        alert('TODO: Archive Task');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Task Details - ${task.name}`} />

            <div className="grid h-full grid-cols-3 gap-2 p-4">
                <div className="col-span-2 flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">{task.name}</h1>

                    <div>
                        <h3 className="text-xs font-semibold">Description</h3>
                        <p className="min-h-32 p-1">
                            <Markdown>{task.description || '*No Description*'}</Markdown>
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold">Activity</h3>
                        <p className="p-1">Activity feed coming soon...</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2">
                        <Select
                            defaultValue={task.category_id.toString()}
                            onValueChange={onCategoryChanged}
                        >
                            <SelectTrigger
                                className="SelectTrigger"
                                aria-label="Category"
                            >
                                <SelectValue placeholder="Select a category…" />
                            </SelectTrigger>
                            <SelectContent>
                                {task.board!.categories!.map((c) => {
                                    return (
                                        <SelectItem
                                            key={`category-${c.id}`}
                                            value={c.id.toString()}
                                        >
                                            {c.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        <Tooltip>
                            <TooltipTrigger>
                                <Button onClick={archiveTask}>
                                    <Archive />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Archive Task</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <DestroyButton onClick={deleteTask}>
                                    <Trash />
                                    <span className="hidden overflow-hidden transition-discrete in-data-[confirm=true]:inline-block">
                                        Delete Task
                                    </span>
                                </DestroyButton>
                            </TooltipTrigger>
                            <TooltipContent>Delete Task</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Link href={route('tasks.edit', { task: task.id })}>
                                    <Button>
                                        <EditIcon />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Edit Task</TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex-grow rounded border p-2 shadow-md">
                        <h3 className="pb-2 text-sm font-semibold">Details</h3>
                        <div className="grid grid-cols-[minmax(auto,2fr)_3fr] items-center gap-x-0.5 gap-y-2 text-sm">
                            <DetailItem label="Reported By">
                                <div className="flex flex-row items-center gap-1">
                                    {task.reporter && <UserInfo user={task.reporter} />}
                                </div>
                            </DetailItem>

                            <DetailItem label="Created At">
                                {<span>{new Date(task.created_at!).toLocaleString()}</span>}
                            </DetailItem>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
