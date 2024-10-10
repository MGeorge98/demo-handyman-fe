"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast, useToast } from "@/hooks/use-toast"
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
    const [filterStatus, setFilterStatus] = useState<"Toți" | "Activ" | "Istoric">("Toți")
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const { toast } = useToast()

    const filteredClients = clients.filter(client =>
        (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === "Toți" || client.status === filterStatus)
    )

    const addClient = (newClient: Omit<Client, "id">) => {
        const updatedClients = [...clients, { ...newClient, id: (clients.length + 1).toString() }]
        setClients(updatedClients)
        toast({
            title: "Client adăugat",
            description: `${newClient.name} a fost adăugat cu succes.`,
        })
    }

    const updateClient = (updatedClient: Client) => {
        const updatedClients = clients.map(client =>
            client.id === updatedClient.id ? updatedClient : client
        )
        setClients(updatedClients)
        setSelectedClient(null)
        toast({
            title: "Client actualizat",
            description: `Informațiile pentru ${updatedClient.name} au fost actualizate.`,
        })
    }

    const deleteClient = (clientId: string) => {
        const updatedClients = clients.filter(client => client.id !== clientId)
        setClients(updatedClients)
        setSelectedClient(null)
        toast({
            title: "Client șters",
            description: "Clientul a fost șters cu succes.",
            variant: "destructive",
        })
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="min-h-screen bg-[#F4F7FA] p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Ecran de comunicare cu clienții</h1>

                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle>Filtrare și Căutare</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:gap-2 flex-grow">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Caută clienți..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <Select onValueChange={(value) => setFilterStatus(value as "Toți" | "Activ" | "Istoric")}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filtrează după status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Toți">Toți clienții</SelectItem>
                                        <SelectItem value="Activ">Clienți activi</SelectItem>
                                        <SelectItem value="Istoric">Clienți istorici</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button style={{ backgroundColor: "#FAA502", color: "white" }}>
                                        <Plus className="mr-2 h-4 w-4" /> Adaugă Client
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Adaugă Client Nou</DialogTitle>
                                    </DialogHeader>
                                    <AddClientForm onAddClient={addClient} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Listă Clienți</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nume</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Telefon</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Companie</TableHead>
                                    <TableHead>Acțiuni</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell>{client.status}</TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.company}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editează
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {selectedClient && (
                    <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Detalii Client</DialogTitle>
                            </DialogHeader>
                            <ClientDetailsForm
                                client={selectedClient}
                                onUpdate={updateClient}
                                onDelete={deleteClient}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </DashboardLayout>
    )
}

function AddClientForm({ onAddClient }: { onAddClient: (client: Omit<Client, "id">) => void }) {
    const [newClient, setNewClient] = useState<Omit<Client, "id">>({
        name: "",
        status: "Activ",
        phone: "",
        email: "",
        company: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAddClient(newClient)
        // Reset form
        setNewClient({
            name: "",
            status: "Activ",
            phone: "",
            email: "",
            company: "",
        })
    }

    return (

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nume</Label>
                <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <RadioGroup
                    defaultValue="Activ"
                    onValueChange={(value) => setNewClient({ ...newClient, status: value as "Activ" | "Istoric" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Activ" id="activ-new" />
                        <Label htmlFor="activ-new">Activ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Istoric" id="istoric-new" />
                        <Label htmlFor="istoric-new">Istoric</Label>
                    </div>
                </RadioGroup>
            </div>
            <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="company">Companie</Label>
                <Input
                    id="company"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    required
                />
            </div>
            <Button type="submit" style={{ backgroundColor: "#FAA502", color: "white" }}>Adaugă Client</Button>
        </form>
    )
}

function ClientDetailsForm({ client, onUpdate, onDelete }: {
    client: Client,
    onUpdate: (client: Client) => void,
    onDelete: (clientId: string) => void
}) {
    const [editedClient, setEditedClient] = useState<Client>(client)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdate(editedClient)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nume</Label>
                <Input
                    id="name"
                    value={editedClient.name}
                    onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <RadioGroup
                    value={editedClient.status}
                    onValueChange={(value) => setEditedClient({ ...editedClient, status: value as "Activ" | "Istoric" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Activ" id="activ-edit" />
                        <Label htmlFor="activ-edit">Activ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Istoric" id="istoric-edit" />
                        <Label htmlFor="istoric-edit">Istoric</Label>
                    </div>
                </RadioGroup>
            </div>
            <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                    id="phone"
                    value={editedClient.phone}
                    onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={editedClient.email}
                    onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="company">Companie</Label>
                <Input
                    id="company"
                    value={editedClient.company}
                    onChange={(e) => setEditedClient({ ...editedClient, company: e.target.value })}
                    required
                />
            </div>
            <DialogFooter>
                <Button type="submit" style={{ backgroundColor: "#FAA502", color: "white" }}>Actualizează Client</Button>
                <Button type="button" variant="destructive" onClick={() => onDelete(client.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Șterge Client
                </Button>
            </DialogFooter>
        </form>
    )
}