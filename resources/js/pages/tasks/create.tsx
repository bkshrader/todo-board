import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Eye, LoaderCircle, X } from 'lucide-react';
import { ComponentProps, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import MarkdownInput from '@/components/input-markdown';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { Board, Task } from '@/types';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

type MarkdownInputMode = ComponentProps<typeof MarkdownInput>['mode'];

type CreateTaskForm = Omit<
    Task,
    'id' | 'reporter_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'reporter' | 'board' | 'category'
>;
type CreateTaskProps = {
    boards: Board[];
};

export default function Create({ boards }: CreateTaskProps) {
    const [activeBoardId, setActiveBoardId] = useState<number>(() => {
        const boardParam = parseInt(route().params.board || 'NaN');

        return isNaN(boardParam) ? boards[0]!.id : boardParam;
    });

    const { data, setData, post, processing, errors } = useForm<CreateTaskForm>({
        category_id: boards.find((b) => b.id === activeBoardId)?.categories![0].id ?? 0,
        name: '',
        description: '',
    });

    // Set category to default of active board if active board changes and current category is not part of new board
    useEffect(() => {
        const activeBoard = boards.find((b) => b.id === activeBoardId)!;
        if (!activeBoard.categories!.find((c) => c.id === data.category_id)) {
            const defaultCategory = activeBoard.categories![0];

            console.log('Active board changed to', activeBoard, 'default category is', defaultCategory);
            setData('category_id', defaultCategory.id);
        }
    }, [activeBoardId]);

    const onBoardChanged: SelectValueChangedEventHandler = (value) => {
        const parsedValue = parseInt(value);
        if (isNaN(parsedValue) || parsedValue === activeBoardId) {
            return;
        }

        setActiveBoardId(parsedValue);
        router.push({
            url: route('tasks.create', { board: parsedValue }),
            preserveState: true,
        });
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

    const [markdownPreviewMode, setMarkdownPreviewMode] = useState<MarkdownInputMode>('edit');

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
                        value={data.category_id.toString()}
                        onValueChange={(value) => setData('category_id', parseInt(value))}
                        disabled={processing}
                    >
                        <SelectTrigger aria-label="category">
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
                        <div className="flex flex-row justify-between">
                            <Label htmlFor="description">Description</Label>
                            <ToggleGroup
                                id="markdown-mode"
                                variant="default"
                                size="sm"
                                type="single"
                                onValueChange={(value) => setMarkdownPreviewMode(value as MarkdownInputMode)}
                                value={markdownPreviewMode}
                            >
                                <ToggleGroupItem value="edit">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Edit />
                                        </TooltipTrigger>
                                        <TooltipContent>Edit</TooltipContent>
                                    </Tooltip>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="preview">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Eye />
                                        </TooltipTrigger>
                                        <TooltipContent>Preview</TooltipContent>
                                    </Tooltip>
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <MarkdownInput
                            mode={markdownPreviewMode}
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
                        variant="outline"
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create task
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
