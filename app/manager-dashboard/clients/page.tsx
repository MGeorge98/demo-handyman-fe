"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Search, User, Building, Clock, Edit, Trash2, MessageSquare, ChevronRight, ChevronLeft, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
    address: string
    contactPerson: string
    lastInteraction: string
    notes: string
}

type Interaction = {
    id: string
    clientId: string
    date: string
    type: "Email" | "Telefon" | "Întâlnire" | "Altele"
    description: string
}

const initialClients: Client[] = [
    { id: "1", name: "Ion Popescu", status: "Activ", phone: "0721234567", email: "ion@example.com", company: "ABC SRL", address: "Str. Principală 1, București", contactPerson: "Maria Ionescu", lastInteraction: "2023-10-15", notes: "Client fidel, preferă comunicarea prin email." },
    { id: "2", name: "Maria Ionescu", status: "Activ", phone: "0731234567", email: "maria@example.com", company: "XYZ SA", address: "Bulevardul Central 10, Cluj-Napoca", contactPerson: "Andrei Popa", lastInteraction: "2023-10-20", notes: "Interesată de servicii de curățenie pentru birouri." },
    { id: "3", name: "Andrei Popa", status: "Istoric", phone: "0741234567", email: "andrei@example.com", company: "123 SRL", address: "Aleea Teilor 5, Brașov", contactPerson: "Elena Dumitrescu", lastInteraction: "2023-09-01", notes: "Fost client, posibilă reactivare în viitor." },
    // Add more mock data to demonstrate pagination
    { id: "4", name: "Elena Dumitrescu", status: "Activ", phone: "0751234567", email: "elena@example.com", company: "DEF SRL", address: "Str. Florilor 15, Timișoara", contactPerson: "Mihai Popescu", lastInteraction: "2023-10-25", notes: "Nou client, interesat de servicii complete." },
    { id: "5", name: "Mihai Popescu", status: "Activ", phone: "0761234567", email: "mihai@example.com", company: "GHI SA", address: "Bulevardul Unirii 20, Iași", contactPerson: "Ana Ionescu", lastInteraction: "2023-10-22", notes: "Client de lungă durată, extindere contract în discuție." },
    { id: "6", name: "Ana Ionescu", status: "Istoric", phone: "0771234567", email: "ana@example.com", company: "JKL SRL", address: "Piața Centrală 5, Constanța", contactPerson: "Cristian Popa", lastInteraction: "2023-09-10", notes: "Fost client, în proces de recontactare." },
    { id: "7", name: "Cristian Popa", status: "Activ", phone: "0781234567", email: "cristian@example.com", company: "MNO SA", address: "Str. Victoriei 30, Brașov", contactPerson: "Ioana Dumitrescu", lastInteraction: "2023-10-18", notes: "Client mulțumit, recomandă serviciile noastre." },
    { id: "8", name: "Ioana Dumitrescu", status: "Activ", phone: "0791234567", email: "ioana@example.com", company: "PQR SRL", address: "Bulevardul Republicii 25, Ploiești", contactPerson: "Radu Ionescu", lastInteraction: "2023-10-23", notes: "Nou client, contract semnat recent." },
    { id: "9", name: "Radu Ionescu", status: "Istoric", phone: "0801234567", email: "radu@example.com", company: "STU SA", address: "Aleea Parcului 10, Oradea", contactPerson: "Daniela Popa", lastInteraction: "2023-09-05", notes: "Fost client, posibilitate de revenire în viitor." },
    { id: "10", name: "Daniela Popa", status: "Activ", phone: "0811234567", email: "daniela@example.com", company: "VWX SRL", address: "Str. Mihai Viteazu 15, Cluj-Napoca", contactPerson: "Alexandru Dumitrescu", lastInteraction: "2023-10-21", notes: "Client fidel, în curs de extindere a serviciilor." },
]

const initialInteractions: Interaction[] = [
    { id: "1", clientId: "1", date: "2023-10-15", type: "Email", description: "Trimis ofertă actualizată pentru servicii de curățenie." },
    { id: "2", clientId: "1", date: "2023-10-10", type: "Telefon", description: "Discutat despre programarea următoarei sesiuni de curățenie." },
    { id: "3", clientId: "2", date: "2023-10-20", type: "Întâlnire", description: "Întâlnire la sediul clientului pentru evaluarea nevoilor de curățenie." },
    { id: "4", clientId: "3", date: "2023-09-01", type: "Email", description: "Trimis chestionar de feedback post-serviciu." },
]

export default function ClientManagement() {
    const [clients, setClients] = useState<Client[]>(initialClients)
    const [interactions, setInteractions] = useState<Interaction[]>(initialInteractions)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' })
    const [filterStatus, setFilterStatus] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [currentClient, setCurrentClient] = useState<Client | null>(null)
    const [newInteraction, setNewInteraction] = useState<Omit<Interaction, 'id' | 'clientId'>>({
        date: new Date().toISOString().split('T')[0],
        type: "Email",
        description: ""
    })
    const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === "all" || client.status === filterStatus)
    ).sort((a, b) => {
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

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage)

    const handleSort = (key: keyof Client) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    const handleCreateClient = (clientData: Omit<Client, "id" | "lastInteraction">) => {
        const newClient = { 
            id: (clients.length + 1).toString(), 
            ...clientData, 
            lastInteraction: new Date().toISOString().split('T')[0]
        }
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
        setInteractions(interactions.filter(interaction => interaction.clientId !== clientId))
        toast({
            title: "Client șters",
            description: "Clientul și toate interacțiunile asociate au fost șterse cu succes.",
        })
    }

    const handleAddInteraction = (newInteraction: Omit<Interaction, 'id'>) => {
        const newInteractionWithId: Interaction = {
            id: (interactions.length + 1).toString(),
            ...newInteraction
        }
        setInteractions([...interactions, newInteractionWithId])
        setClients(clients.map(client => 
            client.id === newInteraction.clientId 
                ? { ...client, lastInteraction: newInteraction.date }
                : client
        ))
        toast({
            title: "Interacțiune adăugată",
            description: "Noua interacțiune a fost înregistrată cu succes.",
        })
    }

    const handleUpdateInteraction = (updatedInteraction: Interaction) => {
        setInteractions(interactions.map(interaction => 
            interaction.id === updatedInteraction.id ? updatedInteraction : interaction
        ))
        setEditingInteraction(null)
        toast({
            title: "Interacțiune actualizată",
            description: "Interacțiunea a fost actualizată cu succes.",
        })
    }

    const handleDeleteInteraction = (interactionId: string) => {
        setInteractions(interactions.filter(i => i.id !== interactionId))
        toast({
            title: "Interacțiune ștearsă",
            description: "Interacțiunea a fost ștearsă cu succes.",
        })
    }

    const ClientList = () => (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold">Lista Clienților</CardTitle>
                        <CardDescription className="text-gray-200">Gestionează și vizualizează detaliile clienților</CardDescription>
                    </div>
                    <Button
                        onClick={() => { setCurrentClient(null); setIsDialogOpen(true) }}
                        className="bg-white text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Adaugă Client
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                        <Input
                            placeholder="Caută clienți..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px] rounded-full">
                            <SelectValue placeholder="Filtrează după status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate</SelectItem>
                            <SelectItem value="Activ">Activ</SelectItem>
                            <SelectItem value="Istoric">Istoric</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Removed "Adaugă Client" button */}
                </div>
                <ScrollArea className="h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                                    Nume {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                                </TableHead>
                                <TableHead>Companie</TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('lastInteraction')}>
                                    Ultima Interacțiune {sortConfig.key === 'lastInteraction' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                                </TableHead>
                                <TableHead>Acțiuni</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>{client.company}</TableCell>
                                    <TableCell>
                                        <Badge variant={client.status === "Activ" ? "success" : "secondary"}>
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{client.lastInteraction}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                                            onClick={() => { setCurrentClient(client); setIsDetailsModalOpen(true) }}
                                        >
                                            Detalii
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Afișare {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredClients.length)} din {filteredClients.length} clienți
                    </span>
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full"
                            variant="outline"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Anterior
                        </Button>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full"
                            variant="outline"
                        >
                            Următor
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const ClientDetailsModal = ({ client, isOpen, onClose }) => {
        if (!client) return null

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-gray-800">{client.name}</DialogTitle>
                        <DialogDescription className="text-gray-600">{client.company}</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-700">Informații Client</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-blue-500" />
                                        <span>{client.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        <span>{client.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-4 w-4 text-blue-500" />
                                        <span>{client.address}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        <span>Persoană de contact: {client.contactPerson}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-700">Detalii Suplimentare</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span>Ultima interacțiune: {client.lastInteraction}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1 text-gray-700">Note:</h4>
                                        <p className="text-gray-600">{client.notes}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="mt-4 border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-700">Interacțiuni</CardTitle>
                            <CardDescription className="text-gray-600">Istoricul interacțiunilor cu clientul</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.target as HTMLFormElement)
                                const newInteraction: Omit<Interaction, 'id'> = {
                                    clientId: client.id,
                                    date: formData.get("date") as string,
                                    type: formData.get("type") as Interaction['type'],
                                    description: formData.get("description") as string,
                                }
                                handleAddInteraction(newInteraction)
                            }} className="mb-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="new-date" className="text-gray-700">Data</Label>
                                        <Input
                                            id="new-date"
                                            name="date"
                                            type="date"
                                            required
                                            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-type" className="text-gray-700">Tip</Label>
                                        <Select name="type">
                                            <SelectTrigger id="new-type" className="rounded-md">
                                                <SelectValue placeholder="Selectează tipul" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Email">Email</SelectItem>
                                                <SelectItem value="Telefon">Telefon</SelectItem>
                                                <SelectItem value="Întâlnire">Întâlnire</SelectItem>
                                                <SelectItem value="Altele">Altele</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="new-description" className="text-gray-700">Descriere</Label>
                                    <Textarea
                                        id="new-description"
                                        name="description"
                                        rows={3}
                                        required
                                        className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">Adaugă Interacțiune</Button>
                            </form>
                            <ScrollArea className="h-[300px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Tip</TableHead>
                                            <TableHead>Descriere</TableHead>
                                            <TableHead>Acțiuni</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {interactions
                                            .filter(interaction => interaction.clientId === client.id)
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .map((interaction) => (
                                                <TableRow key={interaction.id}>
                                                    {editingInteraction?.id === interaction.id ? (
                                                        <>
                                                            <TableCell>
                                                                <Input
                                                                    type="date"
                                                                    defaultValue={interaction.date}
                                                                    onChange={(e) => setEditingInteraction({...editingInteraction, date: e.target.value})}
                                                                    className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Select 
                                                                    defaultValue={interaction.type}
                                                                    onValueChange={(value) => setEditingInteraction({...editingInteraction, type: value as Interaction['type']})}
                                                                >
                                                                    <SelectTrigger className="rounded-md">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Email">Email</SelectItem>
                                                                        <SelectItem value="Telefon">Telefon</SelectItem>
                                                                        <SelectItem value="Întâlnire">Întâlnire</SelectItem>
                                                                        <SelectItem value="Altele">Altele</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    defaultValue={interaction.description}
                                                                    onChange={(e) => setEditingInteraction({...editingInteraction, description: e.target.value})}
                                                                    className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button onClick={() => handleUpdateInteraction(editingInteraction)} className="mr-2 bg-green-500 text-white hover:bg-green-600 rounded-full">Salvează</Button>
                                                                <Button variant="outline" onClick={() => setEditingInteraction(null)} className="rounded-full">Anulează</Button>
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell>{interaction.date}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="rounded-full">
                                                                    {interaction.type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>{interaction.description}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setEditingInteraction(interaction)}
                                                                    className="mr-2 rounded-full"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteInteraction(interaction.id)}
                                                                    className="rounded-full"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-gray-800">Gestionare Clienți</h1>
                        <ClientList />
                        <ClientDetailsModal 
                            client={currentClient} 
                            isOpen={isDetailsModalOpen} 
                            onClose={() => setIsDetailsModalOpen(false)} 
                        />

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="bg-white rounded-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-semibold text-gray-800">{currentClient ? "Editare Client" : "Adăugare Client Nou"}</DialogTitle>
                                    <DialogDescription className="text-gray-600">
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
                                        company: formData.get("company") as string,
                                        address: formData.get("address") as string,
                                        contactPerson: formData.get("contactPerson") as string,
                                        lastInteraction: currentClient?.lastInteraction || new Date().toISOString().split('T')[0],
                                        notes: formData.get("notes") as string
                                    }
                                    currentClient ? handleEditClient(clientData) : handleCreateClient(clientData)
                                }}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right text-gray-700">
                                                Nume
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={currentClient?.name}
                                                className="col-span-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="status" className="text-right text-gray-700">
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
                                            <Label htmlFor="phone" className="text-right text-gray-700">
                                                Telefon
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                defaultValue={currentClient?.phone}
                                                className="col-span-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right text-gray-700">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={currentClient?.email}
                                                className="col-span-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="company" className="text-right text-gray-700">
                                                Companie
                                            </Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                defaultValue={currentClient?.company}
                                                className="col-span-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="address" className="text-right text-gray-700">
                                                Adresă
                                            </Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                defaultValue={currentClient?.address}
                                                className="col-span-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="contactPerson" className="text-right text-gray-700">
                                                Persoană de Contact
                                            </Label>
                                            <Input
                                                id="contactPerson"
                                                name="contactPerson"
                                                defaultValue={currentClient?.contactPerson}
                                                                                                className="col-span-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="notes" className="text-right text-gray-700">
                                                Note
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                defaultValue={currentClient?.notes}
                                                className="col-span-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                            {currentClient ? "Salvează Modificările" : "Adaugă Client"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}