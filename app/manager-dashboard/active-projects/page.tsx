"use client"

import { useState } from "react"
import { ArrowLeft, Bell, Calendar, ChevronRight, FileText, MoreHorizontal, Search, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/layout"
import { managerLinks } from "../page"

const initialProjects = [
    { id: 1, name: "Proiect Alpha", status: "În desfășurare", notifications: 2, startDate: "2023-01-01", teamSize: 5, description: "Proiect de îmbunătățire a proceselor interne.", objectives: ["Creșterea eficienței cu 20%", "Implementarea unui nou sistem de management", "Instruirea personalului în noile proceduri"] },
    { id: 2, name: "Proiect Beta", status: "În întârziere", notifications: 5, startDate: "2023-02-15", teamSize: 8, description: "Dezvoltarea unei noi platforme de e-commerce.", objectives: ["Lansarea beta în 3 luni", "Integrarea cu 5 furnizori majori", "Implementarea unui sistem de recomandări AI"] },
    { id: 3, name: "Proiect Gamma", status: "La termen", notifications: 0, startDate: "2023-03-10", teamSize: 3, description: "Optimizarea lanțului de aprovizionare.", objectives: ["Reducerea timpilor de livrare cu 30%", "Implementarea unui sistem de tracking în timp real", "Negocierea de noi contracte cu furnizorii"] },
    { id: 4, name: "Proiect Delta", status: "În desfășurare", notifications: 1, startDate: "2023-04-05", teamSize: 6, description: "Lansarea unei noi linii de produse eco-friendly.", objectives: ["Dezvoltarea a 3 produse noi", "Obținerea certificărilor de sustenabilitate", "Campanie de marketing focusată pe sustenabilitate"] },
    { id: 5, name: "Proiect Epsilon", status: "În întârziere", notifications: 3, startDate: "2023-05-20", teamSize: 4, description: "Implementarea unui sistem de management al relațiilor cu clienții (CRM).", objectives: ["Migrarea datelor existente", "Integrarea cu sistemele actuale", "Instruirea echipei de vânzări în utilizarea noului CRM"] },
]

export default function ProjectMonitoring() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedProject, setSelectedProject] = useState(null)
    const [projects, setProjects] = useState(initialProjects)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const handleViewChange = (view, project = null) => {
        setCurrentView(view)
        setSelectedProject(project)
    }

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || project.status === statusFilter)
    )

    const ProjectList = () => (
        <Card>
            <CardHeader>
                <CardTitle>Proiecte Active</CardTitle>
                <CardDescription>Listă cu proiectele în desfășurare și statusul lor</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center space-x-2">
                    <Input
                        placeholder="Caută proiecte..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrează după status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate</SelectItem>
                            <SelectItem value="În desfășurare">În desfășurare</SelectItem>
                            <SelectItem value="În întârziere">În întârziere</SelectItem>
                            <SelectItem value="La termen">La termen</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ScrollArea className="h-[500px] pr-4">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="mb-4 flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h3 className="font-semibold text-[#0A2747]">{project.name}</h3>
                                    <Badge variant={project.status === "În întârziere" ? "destructive" : "secondary"}>
                                        {project.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {project.notifications > 0 && (
                                    <Badge variant="outline" className="bg-red-100">
                                        <Bell className="mr-1 h-3 w-3" />
                                        {project.notifications}
                                    </Badge>
                                )}
                                <Button variant="outline" size="sm" className="text-[#0A2747]">
                                    <FileText className="mr-1 h-4 w-4" />
                                    Rapoarte
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90"
                                    onClick={() => handleViewChange("details", project)}
                                >
                                    Detalii
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewChange("edit", project)}>
                                            Editează proiect
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleViewChange("archive", project)}>
                                            Arhivează proiect
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    )

    const ProjectDetails = ({ project, onBack }) => (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Înapoi
                    </Button>
                    <CardTitle>{project.name}</CardTitle>
                </div>
                <CardDescription>Detalii despre proiect</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-[#0A2747]" />
                        <span>Data începerii: {project.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-[#0A2747]" />
                        <span>Echipă: {project.teamSize} membri</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#0A2747]">Descriere:</h3>
                        <p>{project.description}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#0A2747]">Obiective:</h3>
                        <ul className="list-inside list-disc">
                            {project.objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const EditProject = ({ project, onBack }) => {
        const [editedProject, setEditedProject] = useState(project)

        const handleSave = () => {
            setProjects(projects.map(p => p.id === editedProject.id ? editedProject : p))
            onBack()
        }

        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Înapoi
                        </Button>
                        <CardTitle>Editare {project.name}</CardTitle>
                    </div>
                    <CardDescription>Modifică detaliile proiectului</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div>
                            <Label htmlFor="project-name">Nume Proiect</Label>
                            <Input
                                id="project-name"
                                value={editedProject.name}
                                onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-status">Status</Label>
                            <Select
                                value={editedProject.status}
                                onValueChange={(value) => setEditedProject({ ...editedProject, status: value })}
                            >
                                <SelectTrigger id="project-status">
                                    <SelectValue placeholder="Selectează status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="În desfășurare">În desfășurare</SelectItem>
                                    <SelectItem value="În întârziere">În întârziere</SelectItem>
                                    <SelectItem value="La termen">La termen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="project-description">Descriere</Label>
                            <Textarea
                                id="project-description"
                                rows={4}
                                value={editedProject.description}
                                onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-objectives">Obiective (separate prin virgulă)</Label>
                            <Textarea
                                id="project-objectives"
                                rows={4}
                                value={editedProject.objectives.join(", ")}
                                onChange={(e) => setEditedProject({ ...editedProject, objectives: e.target.value.split(", ") })}
                            />
                        </div>
                        <Button type="submit" className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                            Salvează Modificările
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )
    }

    const ArchiveProject = ({ project, onBack }) => {
        const handleArchive = () => {
            setProjects(projects.filter(p => p.id !== project.id))
            onBack()
        }

        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Înapoi
                        </Button>
                        <CardTitle>Arhivare {project.name}</CardTitle>
                    </div>
                    <CardDescription>Confirmă arhivarea proiectului</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p>Ești sigur că vrei să arhivezi acest proiect? Această acțiune va muta proiectul în secțiunea de arhivă și nu va mai fi vizibil în lista de proiecte active.</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Arhivează Proiectul</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Această acțiune nu poate fi anulată. Proiectul va fi mutat în arhivă și toate datele asociate vor fi păstrate, dar nu va mai fi vizibil în lista de proiecte active.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Anulează</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleArchive} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                        Confirmă Arhivarea
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Monitorizare Proiecte Active</h1>
                        {currentView === "list" && <ProjectList />}
                        {currentView === "details" && <ProjectDetails project={selectedProject} onBack={() => handleViewChange("list")} />}
                        {currentView === "edit" && <EditProject project={selectedProject} onBack={() => handleViewChange("list")} />}
                        {currentView === "archive" && <ArchiveProject project={selectedProject} onBack={() => handleViewChange("list")} />}
                    </div>
                </main>
            </div>
        </DashboardLayout>

    )
}