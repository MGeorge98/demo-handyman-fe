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
    { id: 1, name: "Curățenie Centru Comercial", status: "Activ", team: "Curățenie Comercială", manager: "Ana Popescu", coordinator: "Mihai Ionescu", location: "București", progress: 75 },
    { id: 2, name: "Întreținere Bloc Rezidențial", status: "Activ", team: "Curățenie Rezidențială", manager: "Elena Dumitrescu", coordinator: "Alexandru Popa", location: "Cluj-Napoca", progress: 40 },
    { id: 3, name: "Curățenie Parc Central", status: "Finalizat", team: "Curățenie Spații Verzi", manager: "Cristian Stancu", coordinator: "Maria Gheorghe", location: "Timișoara", progress: 100 },
    { id: 4, name: "Curățenie Post-Construcție", status: "Activ", team: "Curățenie Industrială", manager: "Andrei Popovici", coordinator: "Ioana Munteanu", location: "Iași", progress: 60 },
    { id: 5, name: "Dezinfecție Spital", status: "Finalizat", team: "Curățenie Medicală", manager: "Gabriel Neagu", coordinator: "Daniela Ionescu", location: "Constanța", progress: 100 },
]

const initialRequests = [
    { id: 1, projectId: 1, type: "Resurse Suplimentare", description: "Necesită 5 angajați suplimentari pentru finalizarea la timp", status: "În așteptare" },
    { id: 2, projectId: 2, type: "Modificare Buget", description: "Creștere buget cu 10% datorită costurilor neprevăzute de materiale", status: "În așteptare" },
    { id: 3, projectId: 4, type: "Extindere Termen", description: "Solicitare prelungire termen cu 1 săptămână din cauza complexității lucrării", status: "În așteptare" },
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

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Listă Proiecte</CardTitle>
                                <CardDescription className="text-gray-300">Vizualizați și gestionați toate proiectele active și finalizate</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Search className="h-5 w-5 text-[#0A2747]" />
                                        <Input
                                            placeholder="Caută proiecte..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-64 border-[#0A2747]"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="border-[#0A2747] text-[#0A2747]">
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
                                                {["Curățenie Comercială", "Curățenie Rezidențială", "Curățenie Spații Verzi", "Curățenie Industrială", "Curățenie Medicală"].map((team) => (
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
                                                <TableHead onClick={() => handleSort('name')} className="cursor-pointer text-[#0A2747]">Nume Proiect</TableHead>
                                                <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-[#0A2747]">Status</TableHead>
                                                <TableHead onClick={() => handleSort('team')} className="cursor-pointer text-[#0A2747]">Echipă</TableHead>
                                                <TableHead onClick={() => handleSort('manager')} className="cursor-pointer text-[#0A2747]">Manager</TableHead>
                                                <TableHead onClick={() => handleSort('coordinator')} className="cursor-pointer text-[#0A2747]">Coordonator</TableHead>
                                                <TableHead onClick={() => handleSort('location')} className="cursor-pointer text-[#0A2747]">Locație</TableHead>
                                                <TableHead onClick={() => handleSort('progress')} className="cursor-pointer text-[#0A2747]">Progres</TableHead>
                                                <TableHead className="text-[#0A2747]">Acțiuni</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProjects.map((project) => (
                                                <TableRow key={project.id}>
                                                    <TableCell className="font-medium">{project.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={project.status === "Activ" ? "default" : "secondary"} className={project.status === "Activ" ? "bg-green-500" : "bg-gray-500"}>
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
                                                                className="border-[#0A2747] text-[#0A2747] hover:bg-[#0A2747] hover:text-white"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => { setCurrentProject(project); setIsProjectDialogOpen(true) }}
                                                                className="border-[#0A2747] text-[#0A2747] hover:bg-[#0A2747] hover:text-white"
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

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Cereri de Modificări</CardTitle>
                                <CardDescription className="text-gray-300">Aprobați sau respingeți cererile de la coordonatori</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ScrollArea className="h-[300px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-[#0A2747]">Proiect</TableHead>
                                                <TableHead className="text-[#0A2747]">Tip Cerere</TableHead>
                                                <TableHead className="text-[#0A2747]">Descriere</TableHead>
                                                <TableHead className="text-[#0A2747]">Status</TableHead>
                                                <TableHead className="text-[#0A2747]">Acțiuni</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.map((request) => (
                                                <TableRow key={request.id}>
                                                    
                                                    <TableCell>{projects.find(p => p.id === request.projectId)?.name}</TableCell>
                                                    <TableCell>{request.type}</TableCell>
                                                    <TableCell>{request.description}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={request.status === "În așteptare" ? "outline" : request.status === "Aprobat" ? "default" : "secondary"} className={request.status === "Aprobat" ? "bg-green-500" : request.status === "Respins" ? "bg-red-500" : "bg-yellow-500"}>
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
                                                                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRejectRequest(request.id)}
                                                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
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
                    <DialogContent className="max-w-3xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#0A2747]">{currentProject?.name}</DialogTitle>
                            <DialogDescription className="text-gray-500">Detalii și editare proiect</DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="details">
                            <TabsList className="bg-[#0A2747]">
                                <TabsTrigger value="details" className="text-white data-[state=active]:bg-[#FAA502]">Detalii Proiect</TabsTrigger>
                                <TabsTrigger value="resources" className="text-white data-[state=active]:bg-[#FAA502]">Resurse</TabsTrigger>
                                <TabsTrigger value="reports" className="text-white data-[state=active]:bg-[#FAA502]">Rapoarte de Progres</TabsTrigger>
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
                                            <Label htmlFor="name" className="text-right text-[#0A2747]">
                                                Nume Proiect
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={currentProject?.name}
                                                className="col-span-3 border-[#0A2747]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="status" className="text-right text-[#0A2747]">
                                                Status
                                            </Label>
                                            <Select name="status" defaultValue={currentProject?.status}>
                                                <SelectTrigger className="col-span-3 border-[#0A2747]">
                                                    <SelectValue placeholder="Selectează statusul" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Activ">Activ</SelectItem>
                                                    <SelectItem value="Finalizat">Finalizat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="team" className="text-right text-[#0A2747]">
                                                Echipă
                                            </Label>
                                            <Input
                                                id="team"
                                                name="team"
                                                defaultValue={currentProject?.team}
                                                className="col-span-3 border-[#0A2747]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="manager" className="text-right text-[#0A2747]">
                                                Manager
                                            </Label>
                                            <Input
                                                id="manager"
                                                name="manager"
                                                defaultValue={currentProject?.manager}
                                                className="col-span-3 border-[#0A2747]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="coordinator" className="text-right text-[#0A2747]">
                                                Coordonator
                                            </Label>
                                            <Input
                                                id="coordinator"
                                                name="coordinator"
                                                defaultValue={currentProject?.coordinator}
                                                className="col-span-3 border-[#0A2747]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="location" className="text-right text-[#0A2747]">
                                                Locație
                                            </Label>
                                            <Input
                                                id="location"
                                                name="location"
                                                defaultValue={currentProject?.location}
                                                className="col-span-3 border-[#0A2747]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="progress" className="text-right text-[#0A2747]">
                                                Progres (%)
                                            </Label>
                                            <Input
                                                id="progress"
                                                name="progress"
                                                type="number"
                                                defaultValue={currentProject?.progress}
                                                className="col-span-3 border-[#0A2747]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-right text-[#0A2747]">
                                                Descriere
                                            </Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                defaultValue={currentProject?.description}
                                                className="col-span-3 border-[#0A2747]"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">Salvează Modificările</Button>
                                    </DialogFooter>
                                </form>
                            </TabsContent>
                            <TabsContent value="resources">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#0A2747]">Materiale</h3>
                                    <ul className="list-disc pl-5 text-[#0A2747]">
                                        <li>Soluții de curățare - 100 L</li>
                                        <li>Mopuri - 50 buc</li>
                                        <li>Lavete microfibră - 200 buc</li>
                                    </ul>
                                    <h3 className="text-lg font-semibold text-[#0A2747]">Echipamente</h3>
                                    <ul className="list-disc pl-5 text-[#0A2747]">
                                        <li>Aspiratoare industriale - 5 buc</li>
                                        <li>Mașini de spălat pardoseli - 2 buc</li>
                                        <li>Echipamente de curățare cu abur - 3 buc</li>
                                    </ul>
                                    <h3 className="text-lg font-semibold text-[#0A2747]">Personal</h3>
                                    <ul className="list-disc pl-5 text-[#0A2747]">
                                        <li>Angajați calificați - 15</li>
                                        <li>Angajați necalificați - 5</li>
                                        <li>Supervizori - 2</li>
                                    </ul>
                                </div>
                            </TabsContent>
                            <TabsContent value="reports">
                                <div className="space-y-4">
                                    <div className="border p-4 rounded-md border-[#0A2747]">
                                        <h3 className="font-semibold text-[#0A2747]">Raport Săptămâna 1</h3>
                                        <p className="text-[#0A2747]">Progres: 25%</p>
                                        <p className="text-[#0A2747]">S-au finalizat lucrările de curățenie în zonele comune și 30% din spațiile de birouri.</p>
                                    </div>
                                    <div className="border p-4 rounded-md border-[#0A2747]">
                                        <h3 className="font-semibold text-[#0A2747]">Raport Săptămâna 2</h3>
                                        <p className="text-[#0A2747]">Progres: 50%</p>
                                        <p className="text-[#0A2747]">S-au finalizat lucrările de curățenie în toate spațiile de birouri și s-a început curățenia în zona de producție.</p>
                                    </div>
                                    <div className="border p-4 rounded-md border-[#0A2747]">
                                        <h3 className="font-semibold text-[#0A2747]">Raport Săptămâna 3</h3>
                                        <p className="text-[#0A2747]">Progres: 75%</p>
                                        <p className="text-[#0A2747]">S-a finalizat curățenia în zona de producție și s-au început lucrările de curățare a fațadei clădirii.</p>
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