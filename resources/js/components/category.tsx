import { cn } from '@/lib/utils';
import { Board, Category } from '@/types';
import { Timestamps } from '@/types/laravel';
import { useForm } from '@inertiajs/react';
import { createRef } from 'react';
import DestroyButton from './button-destroy';
import InputError from './input-error';
import { Input } from './ui/input';

type CategoryCardProps = React.ComponentProps<'div'>;
export function CategoryCard({ className, children, ...props }: React.PropsWithChildren<CategoryCardProps>) {
    const mergedClass = cn('flex h-full max-w-xl min-w-64 flex-col gap-2 rounded border-1 p-2', className);
    return (
        <div className={mergedClass} {...props}>
            {children}
        </div>
    );
}

export type CategoryHeaderProps = {
    category: Category;
};
export function CategoryHeader({ category }: CategoryHeaderProps) {
    return <h2 className="font-semibold">{category.name}</h2>;
}

type CategoryEditForm = Omit<Category, 'id' | 'board_id' | keyof Timestamps>;
export type CategoryEditorProps<Method extends 'store' | 'update'> = {
    method: Method;
    board?: Method extends 'store' ? Board : never;
    category?: Method extends 'update' ? Category : never;
    showDestroy?: Method extends 'update' ? boolean : never;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    autoFocus?: boolean;
};
export function CategoryEditor<Method extends 'store' | 'update'>({
    method,
    board,
    category,
    showDestroy,
    onBlur,
    autoFocus,
}: React.PropsWithChildren<CategoryEditorProps<Method>>) {
    const {
        data,
        setData,
        put,
        post,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm<CategoryEditForm>({
        name: category?.name || '',
    });

    const inputRef = createRef<HTMLInputElement>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inputRef.current!.blur();

        if (data.name) {
            if (method === 'update') {
                const updateRoute = route('boards.categories.update', {
                    board: category!.board_id,
                    category: category!.id,
                });

                put(updateRoute, { preserveState: true });
            } else if (method === 'store') {
                const storeRoute = route('boards.categories.store', { board: board!.id });

                post(storeRoute, { preserveState: true });
            }
        }

        reset('name');
    };

    const handleDestroy: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        const destroyRoute = route('boards.categories.destroy', { board: category!.board_id, category: category!.id });
        destroy(destroyRoute, { preserveState: false });
    };

    return (
        <form className="flex flex-row justify-stretch gap-1" onSubmit={handleSubmit}>
            <div className="flex grow flex-col">
                <Input
                    type="text"
                    id="name"
                    value={data.name}
                    placeholder="Category Name"
                    autoFocus={autoFocus}
                    onChange={(e) => setData('name', e.target.value)}
                    onBlur={onBlur}
                    disabled={processing}
                    ref={inputRef}
                />
                <InputError message={errors.name} />
            </div>
            {showDestroy && <DestroyButton type="button" variant="outline" onClick={handleDestroy} />}
        </form>
    );
}
