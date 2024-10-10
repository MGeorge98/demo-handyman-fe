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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import DashboardHeader from '../header'
import { Card } from '../ui/card'

interface SidebarLink {
    href: string
    label: string
    icon: React.ReactNode
}

interface LayoutProps {
    children: React.ReactNode
    links: SidebarLink[]
}

function Sidebar({ links }: { links: SidebarLink[] }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-full">
            <div className="d-flex justify-content-center">
                <Image
                    src={Logo}
                    alt="HandyMan Logo"
                    width={150}
                    height={50}
                    className="ml-auto mr-auto"
                />
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col space-y-1 p-4">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#0A2647] hover:text-white",
                                pathname === link.href ? "bg-[#0A2647] text-white" : "text-gray-900"
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
export function DashboardLayout({ children, links }: LayoutProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gray-100">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden absolute top-4 left-4 z-50">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] p-0">
                    <Sidebar links={links} />
                </SheetContent>
            </Sheet>
            <Card className="hidden lg:block w-[240px] bg-white border-r">
                <Sidebar links={links} />
            </Card>
            <div className="flex-1 flex flex-col overflow-hidden bg-transparent mb-4">
                <header className='w-100'>
                    <Card className="bg-[#0A2747] text-white p-4 ml-4 mt-4 mr-4">
                        <div className="container mx-auto flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <div className="flex items-center space-x-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative">
                                            <Bell className="h-5 w-5" />
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80">
                                        <DropdownMenuLabel>Notificări</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <ScrollArea className="h-[300px]">
                                            {notifications.map((notification) => (
                                                <DropdownMenuItem key={notification.id} className="p-4">
                                                    <div className="flex items-start space-x-2">
                                                        {notification.type === 'info' && <Bell className="h-5 w-5 text-blue-500" />}
                                                        {notification.type === 'success' && <Bell className="h-5 w-5 text-green-500" />}
                                                        {notification.type === 'warning' && <Bell className="h-5 w-5 text-yellow-500" />}
                                                        <div>
                                                            <p>{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                        </div>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Link href="/login">
                                    <Button variant="ghost" size="icon" className="relative">
                                        <LogOut className="h-5 w-5" /> {/* Replace with your sign-out icon */}
                                    </Button>
                                </Link>
                                <Avatar className='bg-[F4F7FA]'>
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </Card>

                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    )
}