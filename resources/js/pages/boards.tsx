import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Boards',
        href: '/boards',
    },
];

export default function Boards() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Boards" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <table>
                    <thead className="rounded-lg bg-neutral-200 dark:bg-neutral-800">
                        <tr>
                            <td>Name</td>
                            <td>Description</td>
                            <td>Tasks</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Board One</td>
                            <td>This is the first board</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>Board Two</td>
                            <td>This is the second board</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
