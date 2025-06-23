import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import BoardAvatar from '@/components/board-avatar';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextArea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Board } from '@/types';

type CreateBoardForm = Omit<Board, 'id' | 'owner_id' | 'categories' | 'created_at' | 'updated_at' | 'deleted_at'>;

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<CreateBoardForm>({
        name: '',
        description: '',
        emoji: null,
        color: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('boards.store'));
    };

    const breadcrumbs = [
        {
            title: 'Boards',
            href: route('boards.index'),
        },
        {
            title: 'Create Board',
            href: route('boards.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a Board" />
            <form className="flex flex-col gap-6 p-4" onSubmit={submit}>
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
                            placeholder="Board name"
                        />
                        <InputError message={errors.name} className="mt-2" />
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
                            placeholder="Board description (optional)"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center justify-center">
                            <BoardAvatar className="h-full max-h-40 w-full max-w-40" board={data} />
                        </div>
                        <div className="col-span-2 flex flex-col gap-6">
                            <div className="grid gap-2">
                                {/* TODO replace with emoji picker */}
                                <Label htmlFor="image">Emoji</Label>
                                <Input
                                    id="image"
                                    type="text"
                                    tabIndex={4}
                                    autoComplete="image"
                                    value={data.emoji || undefined}
                                    onChange={(e) => setData('emoji', e.target.value || null)}
                                    disabled={processing}
                                    placeholder="Emoji (optional)"
                                />
                                <InputError message={errors.emoji} />
                            </div>
                            <div className="grid gap-2">
                                {/* TODO add color picker */}
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    id="color"
                                    type="text"
                                    tabIndex={5}
                                    autoComplete="color"
                                    value={data.color || undefined}
                                    onChange={(e) => setData('color', e.target.value || null)}
                                    disabled={processing}
                                    placeholder="#ffffff (optional)"
                                />
                                <InputError message={errors.color} />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create board
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
