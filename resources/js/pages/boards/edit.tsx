import { type Board, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { TextArea } from '@/components/ui/textarea';
import { useOmit } from '@/hooks/use-omit';
import AppLayout from '@/layouts/app-layout';
import { Check, LoaderCircle, X } from 'lucide-react';

type EditBoardForm = Omit<Board, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'deleted_at'>;
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

    const omit = useOmit();

    const { data, setData, put, processing, errors } = useForm<EditBoardForm>(
        omit(board, ['id', 'owner_id', 'created_at', 'updated_at', 'deleted_at']),
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('boards.update', { board: board.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={board.name} />
            <div id="board-header">
                <form className="flex flex-row items-baseline gap-2 p-4" onSubmit={submit}>
                    <div className="flex flex-col gap-0.5">
                        {/* TODO replace input with color picker */}
                        <Label htmlFor="color" className="text-xs">
                            Color
                        </Label>
                        <Input
                            id="color"
                            type="text"
                            className="w-20"
                            style={{ backgroundColor: data.color || undefined }}
                            tabIndex={1}
                            value={data.color || undefined}
                            onChange={(e) => setData('color', e.target.value || null)}
                            disabled={processing}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        {/* TODO replace input with emoji picker */}
                        <Label htmlFor="emoji" className="text-xs">
                            Emoji
                        </Label>
                        <Input
                            id="emoji"
                            type="text"
                            tabIndex={2}
                            value={data.emoji || undefined}
                            className="w-12 text-center text-3xl"
                            onChange={(e) => setData('emoji', e.target.value || null)}
                            disabled={processing}
                        />
                        <InputError message={errors.emoji} className="mt-2" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label htmlFor="name" className="text-xs">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={3}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Board name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label htmlFor="description" className="text-xs">
                            Description
                        </Label>
                        <TextArea
                            id="description"
                            className="text-sm italic"
                            tabIndex={4}
                            value={data.description || undefined}
                            onChange={(e) => setData('description', e.target.value || null)}
                            disabled={processing}
                            placeholder="Board description"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <Label htmlFor="visibility" className="text-xs">
                            Visibility
                        </Label>
                        <div className="flex flex-row gap-2">
                            {/* TODO replace input with select */}
                            <Label htmlFor="visibility" className="text-sm">
                                Make Public
                            </Label>
                            <Input
                                id="visibility"
                                type="checkbox"
                                className="h-4 w-4"
                                checked={data.visibility === 'public'}
                                onChange={(e) => setData('visibility', e.target.checked ? 'public' : 'private')}
                                disabled={processing}
                            />
                        </div>
                        <InputError message={errors.visibility} className="mt-2" />
                    </div>

                    <div className="ml-auto flex flex-row items-center gap-2">
                        <Button type="submit" title="Submit" className="h-6 w-6" tabIndex={5} disabled={processing}>
                            {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>

                        <Link href={route('boards.show', { board: board.id })} disabled={processing}>
                            <Button type="button" variant={'outline'} title="Cancel" className="h-6 w-6">
                                <X className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
            <div className="flex h-full w-full flex-row justify-items-stretch gap-4 overflow-x-scroll rounded-lg p-4">
                <div className="max-w-lg min-w-80 flex-grow">
                    <PlaceholderPattern className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="max-w-lg min-w-80 flex-grow">
                    <PlaceholderPattern className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                {/* <div className="min-w-80">
                    <PlaceholderPattern className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="min-w-80">
                    <PlaceholderPattern className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="min-w-80">
                    <PlaceholderPattern className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="min-w-80">
                    <PlaceholderPattern className="inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div> */}
            </div>
        </AppLayout>
    );
}
