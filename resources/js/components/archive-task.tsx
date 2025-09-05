import { router } from '@inertiajs/react';
import { ArchiveIcon } from 'lucide-react';
import { MouseEventHandler } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function DeleteTask({ task }: { task: number }) {
    const archiveTask: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        router.delete(route('tasks.destroy', { task: task }));
    };

    return (
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={archiveTask}
                >
                    <ArchiveIcon />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Archive Task</TooltipContent>
        </Tooltip>
    );
}
