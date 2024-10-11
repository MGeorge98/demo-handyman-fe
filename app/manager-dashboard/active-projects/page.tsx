"use client"

import { useState, useCallback, useMemo } from "react"
import { ArrowLeft, Bell, Calendar, ChevronRight, FileText, MoreHorizontal, Search, Users, Trash2, Mop, Sparkles, Clock } from "lucide-react"

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
    { 
        id: 1, 
        name: "Curățenie Sediu Central BankCorp", 
        status: "În desfășurare", 
        notifications: 2, 
        startDate: "2024-03-01", 
        endDate: "2024-03-15",
        teamSize: 5, 
        description: "Curățenie generală și dezinfecție pentru sediul central al BankCorp, inclusiv zone de birouri, săli de conferințe și spații comune.", 
        objectives: ["Curățare profundă a 3000 mp de spațiu de birouri", "Dezinfectare completă a 20 de săli de conferințe", "Curățare și lustruire a 500 mp de podele de marmură"],
        client: "BankCorp SRL",
        location: "Str. Financiară nr. 1, București",
        services: ["Curățenie generală", "Dezinfecție", "Curățare geamuri"],
        equipment: ["Mașini de curățat profesionale", "Echipamente de dezinfecție", "Scări și platforme pentru curățare la înălțime"]
    },
    { 
        id: 2, 
        name: "Mentenanță Mall Shopville", 
        status: "În întârziere", 
        notifications: 5, 
        startDate: "2024-03-05", 
        endDate: "2024-06-05",
        teamSize: 8, 
        description: "Contract de mentenanță pentru curățenie zilnică în Mall Shopville, inclusiv zone de food court, toalete publice și spații comerciale.", 
        objectives: ["Asigurarea curățeniei zilnice pentru 50.000 mp", "Gestionarea eficientă a deșeurilor în zona de food court", "Menținerea unui nivel ridicat de igienă în toaletele publice"],
        client: "Shopville Investments",
        location: "Bulevardul Cumpărăturilor nr. 100, Cluj-Napoca",
        services: ["Curățenie zilnică", "Gestionare deșeuri", "Aprovizionare consumabile"],
        equipment: ["Mașini de spălat pardoseli", "Aspiratoare industriale", "Cărucioare de curățenie multifuncționale"]
    },
    { 
        id: 3, 
        name: "Curățenie Post-Construcție Rezidențial Green Park", 
        status: "La termen", 
        notifications: 0, 
        startDate: "2024-03-10", 
        endDate: "2024-03-25",
        teamSize: 3, 
        description: "Curățenie post-construcție pentru noul complex rezidențial Green Park, incluzând 50 de apartamente și spații comune.", 
        objectives: ["Îndepărtarea completă a resturilor de construcție", "Curățare profundă a 50 de apartamente", "Pregătirea spațiilor pentru predare către proprietari"],
        client: "Green Developments SRL",
        location: "Aleea Verde nr. 5, Brașov",
        services: ["Curățenie post-construcție", "Îndepărtare resturi materiale", "Curățare geamuri și uși"],
        equipment: ["Aspiratoare pentru moloz", "Echipamente de curățare cu abur", "Scule pentru îndepărtarea adezivilor și vopselelor"]
    },
    { 
        id: 4, 
        name: "Dezinfecție Școala Gimnazială nr. 5", 
        status: "În desfășurare", 
        notifications: 1, 
        startDate: "2024-03-12", 
        endDate: "2024-03-14",
        teamSize: 6, 
        description: "Dezinfecție completă a Școlii Gimnaziale nr. 5 în perioada vacanței de primăvară, inclusiv săli de clasă, laboratoare, sala de sport și cantină.", 
        objectives: ["Dezinfectarea a 30 de săli de clasă", "Igienizarea completă a cantinei școlare", "Tratarea antimicrobiană a echipamentelor din sala de sport"],
        client: "Primăria Sectorului 3",
        location: "Strada Învățăturii nr. 10, București",
        services: ["Dezinfecție profesională", "Igienizare", "Tratamente antimicrobiene"],
        equipment: ["Nebulizatoare pentru dezinfecție", "Lămpi UV", "Echipamente de protecție personală specializate"]
    },
    { 
        id: 5, 
        name: "Curățenie Industrială Fabrica AutoParts", 
        status: "În întârziere", 
        notifications: 3, 
        startDate: "2024-03-15", 
        endDate: "2024-03-30",
        teamSize: 4, 
        description: "Curățenie industrială pentru fabrica de componente auto AutoParts, focusată pe zonele de producție și depozitare.", 
        objectives: ["Curățarea și degresarea a 5000 mp de pardoseli industriale", "Igienizarea liniilor de producție", "Curățarea sistemelor de ventilație industrială"],
        client: "AutoParts Manufacturing SA",
        location: "Zona Industrială Est, Pitești",
        services: ["Curățenie industrială", "Degresare", "Curățare sisteme de ventilație"],
        equipment: ["Mașini de curățat industriale", "Echipamente de curățare cu presiune înaltă", "Platforme mobile de lucru la înălțime"]
    },
]

export default function ProjectMonitoring() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedProject, setSelectedProject] = useState(null)
    const [projects, setProjects] = useState(initialProjects)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const handleViewChange = useCallback((view, project = null) => {
        setCurrentView(view)
        setSelectedProject(project)
    }, [])

    const filteredProjects = useMemo(() => projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || project.status === statusFilter)
    ), [projects, searchTerm, statusFilter])

    const ProjectList = useCallback(() => (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                <CardTitle>Proiecte Active</CardTitle>
                <CardDescription className="text-gray-300">Listă cu proiectele în desfășurare și statusul lor</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                        <Input
                            placeholder="Caută proiecte..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
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
                        <Card key={project.id} className="mb-4 overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-[#0A2747]">{project.name}</h3>
                                        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                                            <Badge variant={project.status === "În întârziere" ? "destructive" : project.status === "La termen" ? "success" : "secondary"}>
                                                {project.status}
                                            </Badge>
                                            <span>|</span>
                                            <span>{project.client}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {project.notifications > 0 && (
                                            <Badge variant="outline" className="bg-red-100">
                                                <Bell className="mr-1 h-3 w-3" />
                                                {project.notifications}
                                            </Badge>
                                        )}
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
                            </CardContent>
                        </Card>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    ), [filteredProjects, handleViewChange, searchTerm, setSearchTerm, statusFilter, setStatusFilter])

    const ProjectDetails = useCallback(({ project, onBack }) => (
        <Card className="border-none shadow-md">
            <CardHeader className="bg-[#0A2747] text-white">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={onBack} className="text-white hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Înapoi
                    </Button>
                    <CardTitle>{project.name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-[#0A2747]">Detalii Proiect</h3>
                            <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0A2747]">Client</h3>
                            <p className="text-sm text-gray-600">{project.client}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0A2747]">Locație</h3>
                            <p className="text-sm text-gray-600">{project.location}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0A2747]">Servicii</h3>
                            <ul className="list-inside list-disc text-sm text-gray-600">
                                {project.services.map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-[#0A2747]" />
                            <span className="text-sm text-gray-600">
                                {project.startDate} - {project.endDate}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-[#0A2747]" />
                            <span className="text-sm text-gray-600">Echipă: {project.teamSize} membri</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0A2747]">Obiective:</h3>
                            <ul  className="list-inside list-disc text-sm text-gray-600">
                                {project.objectives.map((objective, index) => (
                                    <li key={index}>{objective}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0A2747]">Echipamente:</h3>
                            <ul className="list-inside list-disc text-sm text-gray-600">
                                {project.equipment.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    ), [])

    const EditProject = useCallback(({ project, onBack }) => {
        const [editedProject, setEditedProject] = useState(project)

        const handleSave = () => {
            setProjects(projects.map(p => p.id === editedProject.id ? editedProject : p))
            onBack()
        }

        return (
            <Card className="border-none shadow-md">
                <CardHeader className="bg-[#0A2747] text-white">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack} className="text-white hover:text-gray-200">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Înapoi
                        </Button>
                        <CardTitle>Editare {project.name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
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
                            <Label htmlFor="project-client">Client</Label>
                            <Input
                                id="project-client"
                                value={editedProject.client}
                                onChange={(e) => setEditedProject({ ...editedProject, client: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-location">Locație</Label>
                            <Input
                                id="project-location"
                                value={editedProject.location}
                                onChange={(e) => setEditedProject({ ...editedProject, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-services">Servicii (separate prin virgulă)</Label>
                            <Textarea
                                id="project-services"
                                rows={3}
                                value={editedProject.services.join(", ")}
                                onChange={(e) => setEditedProject({ ...editedProject, services: e.target.value.split(", ") })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-equipment">Echipamente (separate prin virgulă)</Label>
                            <Textarea
                                id="project-equipment"
                                rows={3}
                                value={editedProject.equipment.join(", ")}
                                onChange={(e) => setEditedProject({ ...editedProject, equipment: e.target.value.split(", ") })}
                            />
                        </div>
                        <Button type="submit" className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                            Salvează Modificările
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )
    }, [projects, setProjects])

    const ArchiveProject = useCallback(({ project, onBack }) => {
        const handleArchive = () => {
            setProjects(projects.filter(p => p.id !== project.id))
            onBack()
        }

        return (
            <Card className="border-none shadow-md">
                <CardHeader className="bg-[#0A2747] text-white">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack} className="text-white hover:text-gray-200">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Înapoi
                        </Button>
                        <CardTitle>Arhivare {project.name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <p className="text-gray-600">Ești sigur că vrei să arhivezi acest proiect? Această acțiune va muta proiectul în secțiunea de arhivă și nu va mai fi vizibil în lista de proiecte active.</p>
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
    }, [projects, setProjects])

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