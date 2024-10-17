"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, X, Bell, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "@/assets/images/HandyMan.png"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input"

interface SidebarLink {
    href: string
    label: string
    icon: React.ReactNode
}

interface LayoutProps {
    children: React.ReactNode
    links: SidebarLink[]
    title: string;
}

const Typography = {
    Title: ({ children }: { children: React.ReactNode }) => (
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-4">{children}</h1>
    ),
    Heading: ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-2xl font-semibold text-primary mb-3">{children}</h2>
    ),
    Body: ({ children }: { children: React.ReactNode }) => (
        <p className="text-base text-primary-foreground mb-4">{children}</p>
    ),
}

const NavigationBar = ({ title, leftItem, rightItem }: { title: string, leftItem?: React.ReactNode, rightItem?: React.ReactNode }) => (
    <nav className="flex justify-between items-center bg-primary text-primary-foreground p-4 rounded-lg shadow-md">
        {/* <div>{leftItem}</div> */}
        <h1 className="text-2xl font-bold">{title}</h1>
        <div>{rightItem}</div>
    </nav>
)

const SearchBar = (props: React.ComponentProps<typeof Input>) => (
    <div className="relative">
        <Input type="search" placeholder="Search" className="pl-10 rounded-full" {...props} />
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </div>
)

function Sidebar({ links }: { links: SidebarLink[] }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex justify-center py-6">
                <Image
                    src={Logo}
                    alt="HandyMan Logo"
                    width={150}
                    height={50}
                    className="mx-auto"
                />
            </div>
            <ScrollArea className="flex-1 px-4">
                <div className="flex flex-col space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                pathname === link.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-primary/90 hover:text-primary-foreground"
                            )}
                        >
                            {link.icon}
                            <span className="ml-3">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

const notifications = [
    { id: 1, message: "Utilizator nou creat: Andrei Popa", type: "info", timestamp: "2024-10-10 09:00" },
    { id: 2, message: "Proiect finalizat: Întreținere Spații Verzi D", type: "success", timestamp: "2024-10-09 14:30" },
    { id: 3, message: "Modificare utilizator: Ana Popescu", type: "warning", timestamp: "2024-10-08 11:15" },
    { id: 4, message: "Raport lunar generat", type: "info", timestamp: "2024-10-07 17:00" },
]

export function DashboardLayout({ children, links, title }: LayoutProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <div className="flex h-screen bg-background">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden fixed top-4 left-4 z-50"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] p-0 bg-background">
                    <Sidebar links={links} />
                </SheetContent>
            </Sheet>
            <Card className="hidden lg:block w-[240px] bg-card border-none shadow-md rounded-none">
                <Sidebar links={links} />
            </Card>
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
                <header className="sticky top-0 z-10 px-4 pt-4 bg-background">
                    <NavigationBar
                        title={title}
                        leftItem={<SearchBar />}
                        rightItem={
                            <div className="flex items-center space-x-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary/80">
                                            <Bell className="h-5 w-5" />
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full"></span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80 rounded-md">
                                        <DropdownMenuLabel>Notificări</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <ScrollArea className="h-[300px]">
                                            {notifications.map((notification) => (
                                                <DropdownMenuItem key={notification.id} className="p-4 focus:bg-accent">
                                                    <div className="flex items-start space-x-2">
                                                        {notification.type === 'info' && <Bell className="h-5 w-5 text-blue-500" />}
                                                        {notification.type === 'success' && <Bell className="h-5 w-5 text-green-500" />}
                                                        {notification.type === 'warning' && <Bell className="h-5 w-5 text-yellow-500" />}
                                                        <div>
                                                            <p className="text-sm font-medium">{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                        </div>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Link href="/login">
                                    <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary/80">
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </div>
                        }
                    />
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background px-4 py-8">
                    {children}
                </main>
            </div>
        </div>
    )
}