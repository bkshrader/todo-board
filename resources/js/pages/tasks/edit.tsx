import { Head, Link, router, useForm } from '@inertiajs/react';

import DestroyButton from '@/components/button-destroy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    type SelectValueChangedEventHandler,
} from '@/components/ui/select';
import { TextArea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import { Category, Task } from '@/types';
import { Archive, Check, Trash, X } from 'lucide-react';
import { createRef, Ref } from 'react';

type EditTaskForm = Omit<
    Task,
    | 'id'
    | 'reporter_id'
    | 'category_id'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'board'
    | 'category'
    | 'reporter'
    | 'comments'
>;
type EditTaskProps = {
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

export default function Edit({ task }: EditTaskProps) {
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

    const formRef: Ref<HTMLFormElement> = createRef();

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

    const { data, setData, put } = useForm<EditTaskForm>({
        name: task.name,
        description: task.description,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('tasks.update', { task: task.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Task Details - ${task.name}`} />

            <div className="grid h-full grid-cols-3 gap-2 p-4">
                <div className="col-span-2">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={submit}
                        ref={formRef}
                    >
                        <Input
                            className="font-bold"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="off"
                        />

                        <div>
                            <h3 className="text-xs font-semibold">Description</h3>
                            {/* TODO add markdown support */}
                            <TextArea
                                className="min-h-32"
                                value={data.description || ''}
                                placeholder="No Description"
                                onChange={(e) => setData('description', e.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold">Activity</h3>
                            <p className="p-1">Activity feed coming soon...</p>
                        </div>
                    </form>
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
                                <Button onClick={() => formRef.current?.requestSubmit()}>
                                    <Check />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Save Changes</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Link href={route('tasks.show', { task: task.id })}>
                                    <Button variant="outline">
                                        <X />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Cancel</TooltipContent>
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
