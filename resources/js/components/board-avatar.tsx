import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { Board } from '@/types';
import { Avatar } from './ui/avatar';

type BoardAvatarProps = {
    board: Pick<Board, 'name' | 'emoji' | 'color'>;
} & React.ComponentPropsWithoutRef<typeof Avatar>;

export default function BoardAvatar({ board, className, ...props }: BoardAvatarProps) {
    const getInitials = useInitials();

    return (
        <div className={cn('@container h-8 w-8', className)} {...props}>
            <div
                style={{ backgroundColor: board.color || undefined }}
                className="@container flex h-[100cqmin] w-[100cqmin] items-center justify-center rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
            >
                <span className="leading-[calc(1rem / 60cqi)] text-[60cqi]">{board.emoji || getInitials(board.name)}</span>
            </div>
        </div>
    );
}
