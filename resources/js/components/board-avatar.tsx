import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { Board } from '@/types';
import { Avatar } from './ui/avatar';

type BoardAvatarProps = {
    board: Pick<Board, 'name' | 'emoji' | 'color'>;
} & React.ComponentPropsWithoutRef<typeof Avatar>;

export default function BoardAvatar({ board, className, ...props }: BoardAvatarProps) {
    const getInitials = useInitials();

    const mergedClass = cn(
        'flex aspect-square h-6 w-auto items-center justify-center rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white',
        className,
    );

    return (
        <div style={{ backgroundColor: board.color }} className={mergedClass} {...props}>
            {/* TODO stretch text to fill available space */}
            <span>{board.emoji || getInitials(board.name)}</span>
        </div>
    );
}
