import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import type { SoftDeletes, Timestamps } from './laravel';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    topBoards: Board[] | null;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Board extends Timestamps, SoftDeletes {
    id: number;
    owner_id: number;
    name: string;
    description?: string | null;
    emoji?: string | null;
    color?: string | null;
    categories?: Category[];
}

export interface Category extends Timestamps {
    id: number;
    board_id: (typeof Board)['id'];
    name: string;
}
