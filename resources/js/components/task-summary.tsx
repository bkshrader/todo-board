import { Task } from '@/types';
import { Link } from '@inertiajs/react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

type TaskSummaryProps = {
    task: Task;
};
export default function TaskSummary({ task }: React.PropsWithChildren<TaskSummaryProps>) {
    // TODO implement drag and drop
    return (
        <Link href={route('tasks.show', { task: task.id })}>
            <div className="grid grid-cols-[1fr_auto] items-center rounded-md border p-2 shadow-sm transition-all duration-200 hover:bg-primary/10 hover:shadow-md">
                <h3 className="flex-grow font-semibold">{task.name}</h3>
                <div>
                    {/* TODO add assignees */}
                    <Avatar>
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </Link>
    );
}
