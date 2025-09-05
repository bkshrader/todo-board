import { router } from '@inertiajs/react';
import { TrashIcon } from 'lucide-react';
import { MouseEventHandler } from 'react';
import DestroyButton from './button-destroy';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function DeleteTask({ task }: { task: number }) {
    const deleteTask: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        router.delete(route('tasks.destroy', { task: task, force: 'true' }));
    };

    return (
        <Tooltip>
            <TooltipTrigger>
                <DestroyButton onClick={deleteTask}>
                    <TrashIcon />
                    <span className="hidden overflow-hidden transition-discrete in-data-[confirm=true]:inline-block">
                        Permanently Delete
                    </span>
                </DestroyButton>
            </TooltipTrigger>
            <TooltipContent>Delete Task</TooltipContent>
        </Tooltip>
    );
}
