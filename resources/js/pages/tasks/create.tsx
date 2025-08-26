import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle, X } from 'lucide-react';
import { FormEventHandler, MouseEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    type SelectValueChangedEventHandler,
} from '@/components/ui/select';
import { TextArea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { Board, Task } from '@/types';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

type CreateTaskForm = Omit<
    Task,
    'id' | 'reporter_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'reporter' | 'board' | 'category'
>;
type CreateTaskProps = {
    board: Board;
    boards: Board[];
};

export default function Create({ boards }: CreateTaskProps) {
    const activeBoardId: number = route().params.board ? parseInt(route().params.board) : boards[0]?.id;
    const activeBoard = boards.find((b) => b.id === activeBoardId);

    const { data, setData, post, processing, errors } = useForm<CreateTaskForm>({
        category_id: activeBoard?.categories?.[0]?.id || 0,
        name: '',
        description: '',
    });

    const onBoardChanged: SelectValueChangedEventHandler = (value) => {
        router.visit(route('tasks.create', { board: value }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('tasks.store', { board: activeBoardId }));
    };

    const cancel: MouseEventHandler = () => {
        // TODO go to initial board instead of currently selected board
        router.visit(route('boards.show', { board: activeBoardId }));
    };

    const breadcrumbs = [
        // TODO add missing breadcrumbs
        {
            title: 'Create Task',
            href: route('tasks.create', { board: activeBoardId }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a Task" />
            <form
                className="flex flex-col gap-6 p-4"
                onSubmit={submit}
            >
                {/* Cancel Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-8 w-8 rounded-full"
                                disabled={processing}
                                onClick={cancel}
                            >
                                <X />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancel</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* TODO add board select with current board as default - add to query on change */}
                <div className="grid gap-2">
                    <Label>Board</Label>
                    <Select
                        defaultValue={activeBoardId.toString()}
                        onValueChange={onBoardChanged}
                        disabled={processing}
                    >
                        <SelectTrigger
                            className="SelectTrigger"
                            aria-label="Food"
                        >
                            <SelectValue placeholder="Select a board…" />
                        </SelectTrigger>
                        <SelectContent>
                            {boards.map((b) => {
                                return (
                                    <SelectItem
                                        key={`board-${b.id}`}
                                        value={b.id.toString()}
                                    >
                                        {b.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                {/* Category Select */}
                <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select
                        defaultValue={data.category_id.toString()}
                        onValueChange={(value) => setData('category_id', parseInt(value))}
                        disabled={processing}
                    >
                        <SelectTrigger
                            className="SelectTrigger"
                            aria-label="Food"
                        >
                            <SelectValue placeholder="Select a category…" />
                        </SelectTrigger>
                        <SelectContent>
                            {boards
                                .find((b) => b.id === activeBoardId)
                                ?.categories?.map((c) => {
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
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Task name"
                        />
                        <InputError
                            message={errors.name}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <TextArea
                            id="description"
                            tabIndex={2}
                            autoComplete="description"
                            value={data.description || undefined}
                            onChange={(e) => setData('description', e.target.value || null)}
                            disabled={processing}
                            placeholder="Task description (optional)"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        tabIndex={5}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create task
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
