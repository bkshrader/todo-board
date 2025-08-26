import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function UserAvatar({ user }: { user: User }) {
    const getInitials = useInitials();

    return (
        <Avatar className="aspect-square h-8 w-8 overflow-hidden rounded-full">
            <AvatarImage
                src={user.avatar}
                alt={user.name}
            />
            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(user.name)}
            </AvatarFallback>
        </Avatar>
    );
}
