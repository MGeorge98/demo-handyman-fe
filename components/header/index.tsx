'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Menu, Sun, Moon, LogOut, Calendar, LayoutGrid, LayoutList, Bell } from 'lucide-react';



export default function DashboardHeader() {
    const [theme, setTheme] = useState();
    const router = useRouter();
    const pathname = usePathname();

    const userDetails = {
        avatar_url: "https://github.com/shadcn.png",
        full_name: "John Doe",
        email: "john.doe@example.com"
    };

    const handleSignOut = async (e: React.MouseEvent) => {
        e.preventDefault();
        router.push('/auth');
    };

    const isMainDashboard = (path: string): boolean => {
        return path.toLowerCase().includes('main');
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 lg:hidden"
                    onClick={() => {}}
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">

                <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-9 w-9 cursor-pointer">
                            <AvatarImage src={userDetails?.avatar_url} alt={userDetails?.full_name} />
                            <AvatarFallback>
                                {userDetails?.full_name
                                    ? userDetails.full_name[0]
                                    : userDetails?.email[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}