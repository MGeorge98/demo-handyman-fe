"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { managerLinks } from "../page"

type Client = {
    id: string
    name: string
    status: "Activ" | "Istoric"
    phone: string
    email: string
    company: string
}

const initialClients: Client[] = [
    { id: "1", name: "Ion Popescu", status: "Activ", phone: "0721234567", email: "ion@example.com", company: "ABC SRL" },
    { id: "2", name: "Maria Ionescu", status: "Activ", phone: "0731234567", email: "maria@example.com", company: "XYZ SA" },
    { id: "3", name: "Andrei Popa", status: "Istoric", phone: "0741234567", email: "andrei@example.com", company: "123 SRL" },
]

export default function ClientCommunication() {
    const [clients, setClients] = useState<Client[]>(initialClients)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string[]>([])
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentClient, setCurrentClient] = useState<Client | null>(null)
    const [filteredClients, setFilteredClients] = useState<Client[]>(clients)

    useEffect(() => {
        const filtered = clients.filter(client =>
            (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter.length === 0 || statusFilter.includes(client.status))
        )

        const sorted = [...filtered].sort((a, b) => {
            if (sortConfig.key) {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
                }
            }
            return 0
        })

        setFilteredClients(sorted)
    }, [clients, searchTerm, statusFilter, sortConfig])

    const handleSort = (key: keyof Client) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    const handleCreateClient = (clientData: Omit<Client, "id">) => {
        const newClient = { id: (clients.length + 1).toString(), ...clientData }
        setClients([...clients, newClient])
        setIsDialogOpen(false)
        toast({
            title: "Client adăugat",
            description: `Clientul ${clientData.name} a fost adăugat cu succes.`,
        })
    }

    const handleEditClient = (clientData: Client) => {
        setClients(clients.map(client => client.id === clientData.id ? clientData : client))
        setIsDialogOpen(false)
        toast({
            title: "Client actualizat",
            description: `Informațiile clientului ${clientData.name} au fost actualizate.`,
        })
    }

    const handleDeleteClient = (clientId: string) => {
        setClients(clients.filter(client => client.id !== clientId))
        toast({
            title: "Client șters",
            description: "Clientul a fost șters cu succes.",
        })
    }

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(prev => 
            prev.includes(status) 
                ? prev.filter(s => s !== status)
                : [...prev, status]
        )
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Gestionare Clienți</h1>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Listă Clienți</CardTitle>
                                <CardDescription className="text-gray-300">Gestionați conturile de client pentru firma de curățenie</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Search className="h-5 w-5 text-[#0A2747]" />
                                        <Input
                                            placeholder="Caută clienți..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-64 border-[#0A2747]"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="border-[#0A2747] text-[#0A2747]">
                                                    Filtrare Status {statusFilter.length > 0 && `(${statusFilter.length})`}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Status Client</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {["Activ", "Istoric"].map((status) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={status}
                                                        checked={statusFilter.includes(status)}
                                                        onCheckedChange={() => handleStatusFilterChange(status)}
                                                    >
                                                        {status}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button onClick={() => { setCurrentClient(null); setIsDialogOpen(true) }} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                            <Plus className="mr-2 h-4 w-4" /> Adaugă Client
                                        </Button>
                                    </div>
                                </div>
                                <ScrollArea className="h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead onClick={() => handleSort('name')} className="cursor-pointer text-[#0A2747]">Nume</TableHead>
                                                <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-[#0A2747]">Status</TableHead>
                                                <TableHead onClick={() => handleSort('phone')} className="cursor-pointer text-[#0A2747]">Telefon</TableHead>
                                                <TableHead onClick={() => handleSort('email')} className="cursor-pointer text-[#0A2747]">Email</TableHead>
                                                <TableHead onClick={() => handleSort('company')} className="cursor-pointer text-[#0A2747]">Companie</TableHead>
                                                <TableHead className="text-[#0A2747]">Acțiuni</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredClients.map((client) => (
                                                <TableRow key={client.id}>
                                                    <TableCell className="font-medium">{client.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={client.status === "Activ" ? "success" : "secondary"} className={client.status === "Activ" ? "bg-green-500" : "bg-gray-500"}>
                                                            {client.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{client.phone}</TableCell>
                                                    <TableCell>{client.email}</TableCell>
                                                    <TableCell>{client.company}</TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => { setCurrentClient(client); setIsDialogOpen(true) }}
                                                                className="border-[#0A2747] text-[#0A2747] hover:bg-[#0A2747] hover:text-white"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteClient(client.id)}
                                                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#0A2747]">{currentClient ? "Editare Client" : "Adăugare Client Nou"}</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                {currentClient ? "Modificați informațiile clientului" : "Introduceți detaliile noului client"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target as HTMLFormElement)
                            const clientData = {
                                id: currentClient?.id || "",
                                name: formData.get("name") as string,
                                status: formData.get("status") as "Activ" | "Istoric",
                                phone: formData.get("phone") as string,
                                email: formData.get("email") as string,
                                company: formData.get("company") as string
                            }
                            currentClient ? handleEditClient(clientData) : handleCreateClient(clientData)
                        }}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right text-[#0A2747]">
                                        Nume
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={currentClient?.name}
                                        className="col-span-3 border-[#0A2747]"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right text-[#0A2747]">
                                        Status
                                    </Label>
                                    <RadioGroup
                                        defaultValue={currentClient?.status || "Activ"}
                                        name="status"
                                        className="col-span-3 flex items-center space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Activ" id="activ" />
                                            <Label htmlFor="activ">Activ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Istoric" id="istoric" />
                                            <Label htmlFor="istoric">Istoric</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right text-[#0A2747]">
                                        Telefon
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={currentClient?.phone}
                                        className="col-span-3 border-[#0A2747]"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right text-[#0A2747]">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={currentClient?.email}
                                        className="col-span-3  border-[#0A2747]"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="company" className="text-right text-[#0A2747]">
                                        Companie
                                    </Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        defaultValue={currentClient?.company}
                                        className="col-span-3 border-[#0A2747]"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                    {currentClient ? "Salvează Modificările" : "Adaugă Client"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}