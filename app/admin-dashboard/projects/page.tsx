"use client"

import { useState } from "react"
import { Check, Edit, Eye, Filter, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { adminLinks } from "../page"

const initialProjects = [
    { id: 1, name: "Renovare Centru Comercial", status: "Activ", team: "Construcții", manager: "Ana Popescu", coordinator: "Mihai Ionescu", location: "București", progress: 75 },
    { id: 2, name: "Construcție Bloc Rezidențial", status: "Activ", team: "Construcții", manager: "Elena Dumitrescu", coordinator: "Alexandru Popa", location: "Cluj-Napoca", progress: 40 },
    { id: 3, name: "Reabilitare Parc Central", status: "Finalizat", team: "Amenajări", manager: "Cristian Stancu", coordinator: "Maria Gheorghe", location: "Timișoara", progress: 100 },
    { id: 4, name: "Extindere Rețea Electrică", status: "Activ", team: "Electricitate", manager: "Andrei Popovici", coordinator: "Ioana Munteanu", location: "Iași", progress: 60 },
    { id: 5, name: "Modernizare Stație Epurare", status: "Finalizat", team: "Infrastructură", manager: "Gabriel Neagu", coordinator: "Daniela Ionescu", location: "Constanța", progress: 100 },
]

const initialRequests = [
    { id: 1, projectId: 1, type: "Resurse Suplimentare", description: "Necesită 10 muncitori suplimentari pentru finalizarea la timp", status: "În așteptare" },
    { id: 2, projectId: 2, type: "Modificare Buget", description: "Creștere buget cu 15% datorită costurilor neprevăzute de materiale", status: "În așteptare" },
    { id: 3, projectId: 4, type: "Extindere Termen", description: "Solicitare prelungire termen cu 2 săptămâni din cauza condițiilor meteo", status: "În așteptare" },
]

export default function ProjectManagement() {
    const [projects, setProjects] = useState(initialProjects)
    const [requests, setRequests] = useState(initialRequests)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState([])
    const [teamFilter, setTeamFilter] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
    const [currentProject, setCurrentProject] = useState(null)
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
    const [currentRequest, setCurrentRequest] = useState(null)

    const filteredProjects = projects.filter(project =>
        (searchTerm === "" ||
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.coordinator.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter.length === 0 || statusFilter.includes(project.status)) &&
        (teamFilter.length === 0 || teamFilter.includes(project.team))
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

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    const handleEditProject = (projectData) => {
        setProjects(projects.map(project => project.id === projectData.id ? { ...project, ...projectData } : project))
        setIsProjectDialogOpen(false)
        toast({
            title: "Proiect actualizat",
            description: `Informațiile proiectului ${projectData.name} au fost actualizate.`,
        })
    }

    const handleApproveRequest = (requestId) => {
        setRequests(requests.map(request =>
            request.id === requestId ? { ...request, status: "Aprobat" } : request
        ))
        toast({
            title: "Cerere aprobată",
            description: "Cererea a fost aprobată cu succes.",
        })
    }

    const handleRejectRequest = (requestId) => {
        setRequests(requests.map(request =>
            request.id === requestId ? { ...request, status: "Respins" } : request
        ))
        toast({
            title: "Cerere respinsă",
            description: "Cererea a fost respinsă.",
        })
    }

    return (
        <DashboardLayout links={adminLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Gestionare Proiecte</h1>

                        <Card>
                            <CardHeader>
                                <CardTitle>Listă Proiecte</CardTitle>
                                <CardDescription>Vizualizați și gestionați toate proiectele active și finalizate</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Search className="h-5 w-5 text-gray-500" />
                                        <Input
                                            placeholder="Caută proiecte..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-64"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">
                                                    <Filter className="mr-2 h-4 w-4" />
                                                    Filtrare
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {["Activ", "Finalizat"].map((status) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={status}
                                                        checked={statusFilter.includes(status)}
                                                        onCheckedChange={(checked) =>
                                                            setStatusFilter(
                                                                checked
                                                                    ? [...statusFilter, status]
                                                                    : statusFilter.filter((item) => item !== status)
                                                            )
                                                        }
                                                    >
                                                        {status}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>Echipă</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {["Construcții", "Amenajări", "Electricitate", "Infrastructură"].map((team) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={team}
                                                        checked={teamFilter.includes(team)}
                                                        onCheckedChange={(checked) =>
                                                            setTeamFilter(
                                                                checked
                                                                    ? [...teamFilter, team]
                                                                    : teamFilter.filter((item) => item !== team)
                                                            )
                                                        }
                                                    >
                                                        {team}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <ScrollArea className="h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">Nume Proiect</TableHead>
                                                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">Status</TableHead>
                                                <TableHead onClick={() => handleSort('team')} className="cursor-pointer">Echipă</TableHead>
                                                <TableHead onClick={() => handleSort('manager')} className="cursor-pointer">Manager</TableHead>
                                                <TableHead onClick={() => handleSort('coordinator')} className="cursor-pointer">Coordonator</TableHead>
                                                <TableHead onClick={() => handleSort('location')} className="cursor-pointer">Locație</TableHead>
                                                <TableHead onClick={() => handleSort('progress')} className="cursor-pointer">Progres</TableHead>
                                                <TableHead>Acțiuni</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProjects.map((project) => (
                                                <TableRow key={project.id}>
                                                    <TableCell>{project.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={project.status === "Activ" ? "default" : "secondary"}>
                                                            {project.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{project.team}</TableCell>
                                                    <TableCell>{project.manager}</TableCell>
                                                    <TableCell>{project.coordinator}</TableCell>
                                                    <TableCell>{project.location}</TableCell>
                                                    <TableCell>{project.progress}%</TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => { setCurrentProject(project); setIsProjectDialogOpen(true) }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => { setCurrentProject(project); setIsProjectDialogOpen(true) }}
                                                            >
                                                                <Edit className="h-4 w-4" />
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Cereri de Modificări</CardTitle>
                                <CardDescription>Aprobați sau respingeți cererile de la coordonatori</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Proiect</TableHead>
                                                <TableHead>Tip Cerere</TableHead>
                                                <TableHead>Descriere</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Acțiuni</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.map((request) => (
                                                <TableRow key={request.id}>
                                                    <TableCell>{projects.find(p => p.id === request.projectId)?.name}</TableCell>
                                                    <TableCell>{request.type}</TableCell>
                                                    <TableCell>{request.description}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={request.status === "În așteptare" ? "outline" : request.status === "Aprobat" ? "default" : "secondary"}>
                                                            {request.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.status === "În așteptare" && (
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleApproveRequest(request.id)}
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRejectRequest(request.id)}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
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

                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{currentProject?.name}</DialogTitle>
                            <DialogDescription>Detalii și editare proiect</DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="details">
                            <TabsList>
                                <TabsTrigger value="details">Detalii Proiect</TabsTrigger>
                                <TabsTrigger value="resources">Resurse</TabsTrigger>
                                <TabsTrigger value="reports">Rapoarte de Progres</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details">
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    const formData = new FormData(e.target)
                                    const projectData = {
                                        id: currentProject.id,
                                        name: formData.get("name"),
                                        status: formData.get("status"),
                                        team: formData.get("team"),
                                        manager: formData.get("manager"),
                                        coordinator: formData.get("coordinator"),
                                        location: formData.get("location"),
                                        progress: parseInt(formData.get("progress")),
                                        description: formData.get("description")
                                    }
                                    handleEditProject(projectData)
                                }}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Nume Proiect
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={currentProject?.name}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="status" className="text-right">
                                                Status
                                            </Label>
                                            <Select name="status" defaultValue={currentProject?.status}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Selectează statusul" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Activ">Activ</SelectItem>
                                                    <SelectItem value="Finalizat">Finalizat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="team" className="text-right">
                                                Echipă
                                            </Label>
                                            <Input
                                                id="team"
                                                name="team"
                                                defaultValue={currentProject?.team}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="manager" className="text-right">
                                                Manager
                                            </Label>
                                            <Input
                                                id="manager"
                                                name="manager"
                                                defaultValue={currentProject?.manager}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="coordinator" className="text-right">
                                                Coordonator
                                            </Label>
                                            <Input
                                                id="coordinator"
                                                name="coordinator"
                                                defaultValue={currentProject?.coordinator}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="location" className="text-right">
                                                Locație
                                            </Label>
                                            <Input
                                                id="location"
                                                name="location"
                                                defaultValue={currentProject?.location}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="progress" className="text-right">
                                                Progres (%)
                                            </Label>
                                            <Input
                                                id="progress"
                                                name="progress"
                                                type="number"
                                                defaultValue={currentProject?.progress}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-right">
                                                Descriere
                                            </Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                defaultValue={currentProject?.description}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Salvează Modificările</Button>
                                    </DialogFooter>
                                </form>
                            </TabsContent>
                            <TabsContent value="resources">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Materiale</h3>
                                    <ul className="list-disc pl-5">
                                        <li>Ciment - 1000 kg</li>
                                        <li>Cărămizi - 5000 buc</li>
                                        <li>Oțel beton - 500 kg</li>
                                    </ul>
                                    <h3 className="text-lg font-semibold">Unelte</h3>
                                    <ul className="list-disc pl-5">
                                        <li>Betonieră - 2 buc</li>
                                        <li>Schelă metalică - 100 m²</li>
                                        <li>Macara - 1 buc</li>
                                    </ul>
                                    <h3 className="text-lg font-semibold">Personal</h3>
                                    <ul className="list-disc pl-5">
                                        <li>Muncitori calificați - 20</li>
                                        <li>Muncitori necalificați - 10</li>
                                        <li>Ingineri - 3</li>
                                    </ul>
                                </div>
                            </TabsContent>
                            <TabsContent value="reports">
                                <div className="space-y-4">
                                    <div className="border p-4 rounded-md">
                                        <h3 className="font-semibold">Raport Săptămâna 1</h3>
                                        <p>Progres: 20%</p>
                                        <p>S-au finalizat lucrările de excavare și s-a turnat fundația.</p>
                                    </div>
                                    <div className="border p-4 rounded-md">
                                        <h3 className="font-semibold">Raport Săptămâna 2</h3>
                                        <p>Progres: 35%</p>
                                        <p>S-au ridicat pereții exteriori la primul etaj.</p>
                                    </div>
                                    <div className="border p-4 rounded-md">
                                        <h3 className="font-semibold">Raport Săptămâna 3</h3>
                                        <p>Progres: 50%</p>
                                        <p>S-a finalizat structura de rezistență pentru toate etajele.</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}