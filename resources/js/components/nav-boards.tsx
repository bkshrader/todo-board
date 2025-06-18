import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Board } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import BoardAvatar from './board-avatar';

export function NavBoards({ boards }: { boards?: Board[] | null }) {
    const page = usePage();
    console.log(`${page.url}: ${route('boards.show', { board: boards?.[0]?.id })}`);
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Boards</SidebarGroupLabel>
            <SidebarMenu>
                {boards?.map((board) => (
                    <SidebarMenuItem key={`nav-board-${board.id}`}>
                        <SidebarMenuButton
                            asChild
                            isActive={route('boards.show', { board: board.id }).endsWith(page.url)}
                            tooltip={{ children: board.name }}
                        >
                            <Link href={route('boards.show', { board: board.id })} prefetch>
                                <BoardAvatar board={board} />
                                <span>{board.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={route('boards.create')}>
                            <Plus />
                            <span>Create New Board</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
