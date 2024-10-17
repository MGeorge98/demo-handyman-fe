"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { ArrowLeft, Bell, Calendar, ChevronRight, FileText, MoreHorizontal, Search, Users, Trash2, Mop, Sparkles, Clock, CalendarIcon, MapPin, Building, Plus, ChevronDown, Edit, Trash, User, Phone, Mail, Star, Briefcase, Info, Send } from "lucide-react"
import { format, parseISO, isWithinInterval } from 'date-fns'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DashboardLayout } from "@/components/layout"
import { managerLinks } from "../page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
// import { DatePickerWithRange } from "@/components/ui/date-range-picker"

const employees = [
    { id: 1, name: "Ana Popescu", role: "Curățător General", skills: ["Curățenie Rezidențială", "Curățenie Birouri"], availability: "Disponibil", phone: "0722123456", email: "ana.popescu@example.com", rating: 4.8, completedJobs: 120 },
    { id: 2, name: "Mihai Ionescu", role: "Specialist Curățenie Industrială", skills: ["Curățenie Industrială", "Manipulare Echipamente"], availability: "Parțial disponibil", phone: "0733234567", email: "mihai.ionescu@example.com", rating: 4.6, completedJobs: 95 },
    { id: 3, name: "Elena Dumitrescu", role: "Supervizor Echipă", skills: ["Management Echipă", "Control Calitate"], availability: "Indisponibil", phone: "0744345678", email: "elena.dumitrescu@example.com", rating: 4.9, completedJobs: 200 },
    { id: 4, name: "Alexandru Popa", role: "Specialist Curățenie Geamuri", skills: ["Curățare Geamuri", "Lucru la Înălțime"], availability: "Disponibil", phone: "0755456789", email: "alexandru.popa@example.com", rating: 4.7, completedJobs: 110 },
    { id: 5, name: "Maria Stancu", role: "Curățător Covoare", skills: ["Curățare Covoare", "Tratamente Speciale"], availability: "Parțial disponibil", phone: "0766567890", email: "maria.stancu@example.com", rating: 4.5, completedJobs: 85 },
]

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
        equipment: ["Mașini de curățat profesionale", "Echipamente de dezinfecție", "Scări și platforme pentru curățare la înălțime"],
        team: [1, 2, 4]
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
        equipment: ["Mașini de spălat pardoseli", "Aspiratoare industriale", "Cărucioare de curățenie multifuncționale"],
        team: [1, 3, 5]
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
        equipment: ["Aspiratoare pentru moloz", "Echipamente de curățare cu abur", "Scule pentru îndepărtarea adezivilor și vopselelor"],
        team: [2, 4]
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
        objectives: ["Dezinfectarea a 30 de săli de clasă", "Igienizarea completă a cantinei ��colare", "Tratarea antimicrobiană a echipamentelor din sala de sport"],
        client: "Primăria Sectorului 3",
        location: "Strada Învățăturii nr. 10, București",
        services: ["Dezinfecție profesională", "Igienizare", "Tratamente antimicrobiene"],
        equipment: ["Nebulizatoare pentru dezinfecție", "Lămpi UV", "Echipamente de protecție personală specializate"],
        team: [1, 2, 3]
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
        equipment: ["Mașini de curățat industriale", "Echipamente de curățare cu presiune înaltă", "Platforme mobile de lucru la înălțime"],
        team: [2, 4, 5]
    },
]

export default function ProjectMonitoring() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedProject, setSelectedProject] = useState(null)
    const [projects, setProjects] = useState(initialProjects)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [employeeFilter, setEmployeeFilter] = useState("all")
    const [dateRange, setDateRange] = useState({ from: null, to: null })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const router = useRouter();
    const handleViewChange = useCallback((view, project = null) => {
        setCurrentView(view)
        setSelectedProject(project)
    }, [])

    const filteredProjects = useMemo(() => projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || project.status === statusFilter) &&
        (employeeFilter === "all" || project.team.includes(parseInt(employeeFilter))) &&
        (!dateRange.from || !dateRange.to || isWithinInterval(parseISO(project.startDate), { start: dateRange.from, end: dateRange.to }))
    ), [projects, searchTerm, statusFilter, employeeFilter, dateRange])

    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredProjects.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredProjects, currentPage])

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

    const handleArchive = (projectId) => {
        setProjects(projects.filter(p => p.id !== projectId))
        toast({
            title: "Proiect arhivat",
            description: "Proiectul a fost mutat în arhivă cu succes.",
        })
    }

    const ProjectList = useCallback(() => (
        <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex justify-between items-center">
                    <div>


                        <CardTitle className="text-2xl font-bold">Proiecte Active</CardTitle>
                        <CardDescription className="text-gray-200">Listă cu proiectele în desfășurare și statusul lor</CardDescription>
                    </div>

                    <Button
                        onClick={() => { router.push("/manager-dashboard/create-project") }}
                        className="bg-white text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Adaugă Proiect
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            placeholder="Caută proiecte..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] rounded-full">
                            <SelectValue placeholder="Filtrează după status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate</SelectItem>
                            <SelectItem value="În desfășurare">În desfășurare</SelectItem>
                            <SelectItem value="În întârziere">În întârziere</SelectItem>
                            <SelectItem value="La termen">La termen</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                        <SelectTrigger className="w-[180px] rounded-full">
                            <SelectValue placeholder="Filtrează după angajat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toți angajații</SelectItem>
                            {employees.map(employee => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>{employee.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* <DatePickerWithRange
                        className="rounded-full"
                        selected={dateRange}
                        onSelect={setDateRange}
                    /> */}
                </div>
                <ScrollArea className="h-[500px] pr-4">
                    {paginatedProjects.map((project) => (
                        <Card key={project.id} className="mb-4 overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{project.name}</h3>
                                        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                                            <Badge variant={project.status === "În întârziere" ? "destructive" : project.status === "La termen" ? "success" : "secondary"} className="rounded-full">
                                                {project.status}
                                            </Badge>
                                            <span>|</span>
                                            <span>{project.client}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {project.notifications > 0 && (
                                            <Badge variant="outline" className="bg-red-100 rounded-full">
                                                <Bell className="mr-1 h-3 w-3" />
                                                {project.notifications}
                                            </Badge>
                                        )}
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                                            onClick={() => handleViewChange("details", project)}
                                        >
                                            Detalii
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="rounded-full">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={() => handleViewChange("edit", project)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editează proiect
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Arhivează Proiectul
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="rounded-2xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Ești sigur că vrei să arhivezi {project.name}?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Această acțiune nu poate fi anulată. Proiectul va fi mutat în arhivă și toate datele asociate vor fi păstrate, dar nu va mai fi vizibil în lista de proiecte active.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="rounded-full">Anulează</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleArchive(project.id)} className="bg-red-500 text-white hover:bg-red-600 rounded-full">
                                                                    Confirmă Arhivarea
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </ScrollArea>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Afișare {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProjects.length)} din {filteredProjects.length} proiecte
                    </span>
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full"
                            variant="outline"
                        >
                            Anterior
                        </Button>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full"
                            variant="outline"
                        >
                            Următor
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    ), [paginatedProjects, handleViewChange, searchTerm, statusFilter, employeeFilter, dateRange, currentPage, totalPages, filteredProjects.length])

    const ProjectDetails = useCallback(({ project, onBack }) => {
        const [activeTab, setActiveTab] = useState("details")
        const [changeProposal, setChangeProposal] = useState("")
        const [attendanceHistory, setAttendanceHistory] = useState([])
        const [reportPeriod, setReportPeriod] = useState({ start: "", end: "" })
        const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
        const [currentTask, setCurrentTask] = useState({ id: null, name: "", status: "Planificat" })
        const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
        const [teamSearchTerm, setTeamSearchTerm] = useState("")
        const [teamAvailability, setTeamAvailability] = useState("all")
        const [teamSelectedSkills, setTeamSelectedSkills] = useState([])
        const [selectedEmployee, setSelectedEmployee] = useState(null)
        const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false)

        useEffect(() => {
            if (project) {
                setTeamSelectedSkills(project.services || [])
            }
        }, [project])

        const handleProposeChange = () => {
            if (changeProposal.trim() === "") {
                toast({
                    title: "Eroare",
                    description: "Vă rugăm să introduceți o propunere de modificare.",
                    variant: "destructive",
                })
                return
            }
            toast({
                title: "Propunere trimisă",
                description: "Propunerea dvs. de modificare a fost trimisă managerului.",
            })
            setChangeProposal("")
        }

        const handleGenerateReport = () => {
            if (!reportPeriod.start || !reportPeriod.end) {
                toast({
                    title: "Eroare",
                    description: "Vă rugăm să selectați o perioadă validă pentru raport.",
                    variant: "destructive",
                })
                return
            }

            console.log("Generating report for:", reportPeriod)

            toast({
                title: "Raport generat",
                description: `Raportul pentru perioada ${reportPeriod.start} - ${reportPeriod.end} a fost trimis managerului.`,
            })
        }

        const handleAddOrEditTask = () => {
            if (currentTask.name.trim() === "") {
                toast({
                    title: "Eroare",
                    description: "Numele sarcinii nu poate fi gol.",
                    variant: "destructive",
                })
                return
            }

            setProjects(prevProjects => {
                return prevProjects.map(p => {
                    if (p.id === project.id) {
                        const updatedTasks = currentTask.id
                            ? p.tasks.map(task => task.id === currentTask.id ? currentTask : task)
                            : [...p.tasks, { ...currentTask, id: p.tasks.length + 1 }]
                        return { ...p, tasks: updatedTasks }
                    }
                    return p
                })
            })

            setIsTaskModalOpen(false)
            setCurrentTask({ id: null, name: "", status: "Planificat" })
            toast({
                title: "Succes",
                description: `Sarcina a fost ${currentTask.id ? "actualizată" : "adăugată"} cu succes.`,
            })
        }

        const handleDeleteTask = (taskId) => {
            setProjects(prevProjects => {
                return prevProjects.map(p => {
                    if (p.id === project.id) {
                        return {
                            ...p,
                            tasks: p.tasks.filter(task => task.id !== taskId)
                        }
                    }
                    return p
                })
            })
            toast({
                title: "Succes",
                description: "Sarcina a fost ștearsă cu succes.",
            })
        }

        const handleAddToTeam = (employeeId) => {
            if (project.team.includes(employeeId)) {
                toast({
                    title: "Atenție",
                    description: "Acest angajat este deja în echipă.",
                    variant: "warning",
                })
                return
            }

            setProjects(prevProjects => {
                return prevProjects.map(p => {
                    if (p.id === project.id) {
                        return {
                            ...p,
                            team: [...p.team, employeeId]
                        }
                    }
                    return p
                })
            })
            toast({
                title: "Succes",
                description: "Angajatul a fost adăugat în echipă.",
            })
        }

        const handleRemoveFromTeam = (employeeId) => {
            setProjects(prevProjects => {
                return prevProjects.map(p => {
                    if (p.id === project.id) {
                        return {
                            ...p,
                            team: p.team.filter(id => id !== employeeId)
                        }
                    }
                    return p
                })
            })
            toast({
                title: "Succes",
                description: "Angajatul a fost eliminat din echipă.",
            })
        }

        const filteredEmployees = employees.filter(employee =>
            (teamSearchTerm === "" || employee.name.toLowerCase().includes(teamSearchTerm.toLowerCase())) &&
            (teamAvailability === "all" || employee.availability === teamAvailability) &&
            (teamSelectedSkills.length === 0 || teamSelectedSkills.every(skill => employee.skills.includes(skill)))
        )

        const openEmployeeModal = (employee) => {
            setSelectedEmployee(employee)
            setIsEmployeeModalOpen(true)
        }

        return (
            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <Button variant="ghost" onClick={onBack} className="text-white hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Înapoi
                    </Button>
                    <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
                    <CardDescription className="text-gray-200">Detalii și gestionare proiect</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger value="details" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">Detalii Proiect</TabsTrigger>
                            <TabsTrigger value="team" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">Gestionare Echipă</TabsTrigger>
                            <TabsTrigger value="timeTracking" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">Pontaj</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="p-6">
                            <ProjectDetailsComponent
                                project={project}
                                onProposeChange={handleProposeChange}
                                changeProposal={changeProposal}
                                setChangeProposal={setChangeProposal}
                                setIsTaskModalOpen={setIsTaskModalOpen}
                                setCurrentTask={setCurrentTask}
                                handleDeleteTask={handleDeleteTask}
                            />
                        </TabsContent>
                        <TabsContent value="team" className="p-6">
                            <TeamManagement
                                project={project}
                                teamMembers={employees.filter(emp => project.team.includes(emp.id))}
                                handleRemoveFromTeam={handleRemoveFromTeam}
                                setIsTeamModalOpen={setIsTeamModalOpen}
                                openEmployeeModal={openEmployeeModal}
                            />
                        </TabsContent>
                        <TabsContent value="timeTracking" className="p-6">
                            <TimeTracking
                                attendanceHistory={attendanceHistory}
                                setAttendanceHistory={setAttendanceHistory}
                                reportPeriod={reportPeriod}
                                setReportPeriod={setReportPeriod}
                                handleGenerateReport={handleGenerateReport}
                                projectTeam={employees.filter(emp => project.team.includes(emp.id))}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <EmployeeDetailsModal
                    isOpen={isEmployeeModalOpen}
                    onClose={() => setIsEmployeeModalOpen(false)}
                    employee={selectedEmployee}
                    project={project}
                />

                <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>{currentTask.id ? "Editare Sarcină" : "Adăugare Sarcină Nouă"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="task-name" className="text-right">
                                    Nume
                                </Label>
                                <Input
                                    id="task-name"
                                    value={currentTask.name}
                                    onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                                    className="col-span-3 rounded-full"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="task-status" className="text-right">
                                    Status
                                </Label>
                                <Select
                                    value={currentTask.status}
                                    onValueChange={(value) => setCurrentTask({ ...currentTask, status: value })}
                                >
                                    <SelectTrigger className="col-span-3 rounded-full">
                                        <SelectValue placeholder="Selectați statusul" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Planificat">Planificat</SelectItem>
                                        <SelectItem value="În așteptare">În așteptare</SelectItem>
                                        <SelectItem value="În desfășurare">În desfășurare</SelectItem>
                                        <SelectItem value="Finalizat">Finalizat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddOrEditTask} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                {currentTask.id ? "Actualizează Sarcina" : "Adaugă Sarcina"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
                    <DialogContent className="max-w-4xl rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Adăugare Angajați în Echipă</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="employee-search">Căutare</Label>
                                    <Input
                                        id="employee-search"
                                        placeholder="Caută angajați..."
                                        value={teamSearchTerm}
                                        onChange={(e) => setTeamSearchTerm(e.target.value)}
                                        className="rounded-full"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="availability-filter">Disponibilitate</Label>
                                    <Select value={teamAvailability} onValueChange={setTeamAvailability}>
                                        <SelectTrigger id="availability-filter" className="rounded-full">
                                            <SelectValue placeholder="Filtrează după disponibilitate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Toți</SelectItem>
                                            <SelectItem value="Disponibil">Disponibil</SelectItem>
                                            <SelectItem value="Parțial disponibil">Parțial disponibil</SelectItem>
                                            <SelectItem value="Indisponibil">Indisponibil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Competențe</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between rounded-full">
                                                {teamSelectedSkills.length > 0 ? `${teamSelectedSkills.length} selectate` : "Selectează competențe"}
                                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Caută competențe..." />
                                                <CommandEmpty>Nu s-au găsit competențe.</CommandEmpty>
                                                <CommandGroup>
                                                    {project.services.map((skill) => (
                                                        <CommandItem
                                                            key={skill}
                                                            onSelect={() => {
                                                                setTeamSelectedSkills(prev =>
                                                                    prev.includes(skill)
                                                                        ? prev.filter(s => s !== skill)
                                                                        : [...prev, skill]
                                                                )
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={teamSelectedSkills.includes(skill)}
                                                                className="mr-2"
                                                            />
                                                            {skill}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nume</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Disponibilitate</TableHead>
                                            <TableHead>Acțiuni</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEmployees.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell>{employee.name}</TableCell>
                                                <TableCell>{employee.role}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            employee.availability === "Disponibil"
                                                                ? "success"
                                                                : employee.availability === "Parțial disponibil"
                                                                    ? "warning"
                                                                    : "destructive"
                                                        }
                                                        className="rounded-full"
                                                    >
                                                        {employee.availability}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            onClick={() => handleAddToTeam(employee.id)}
                                                            disabled={project.team.includes(employee.id)}
                                                            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                                                        >
                                                            {project.team.includes(employee.id) ? "În echipă" : "Adaugă în echipă"}
                                                        </Button>
                                                        <Button
                                                            onClick={() => openEmployeeModal(employee)}
                                                            variant="outline"
                                                            className="rounded-full"
                                                        >
                                                            <Info className="h-4 w-4 mr-2" />
                                                            Detalii
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </DialogContent>
                </Dialog>
            </Card>
        )
    }, [projects, setProjects])

    function TeamManagement({ project, teamMembers, handleRemoveFromTeam, setIsTeamModalOpen, openEmployeeModal }) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Echipa Proiectului</h2>
                    <Button onClick={() => setIsTeamModalOpen(true)} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                        <Plus className="mr-2 h-4 w-4" /> Adaugă Membru
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nume</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Competențe</TableHead>
                            <TableHead>Disponibilitate</TableHead>
                            <TableHead>Acțiuni</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>
                                    {member.skills.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="mr-1 rounded-full">
                                            {skill}
                                        </Badge>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            member.availability === "Disponibil"
                                                ? "success"
                                                : member.availability === "Parțial disponibil"
                                                    ? "warning"
                                                    : "destructive"
                                        }
                                        className="rounded-full"
                                    >
                                        {member.availability}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="destructive" onClick={() => handleRemoveFromTeam(member.id)} className="rounded-full">
                                            Elimină din Echipă
                                        </Button>
                                        <Button
                                            onClick={() => openEmployeeModal(member)}
                                            variant="outline"
                                            className="rounded-full"
                                        >
                                            <Info className="h-4 w-4 mr-2" />
                                            Detalii
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    function EmployeeDetailsModal({ isOpen, onClose, employee, project }) {
        if (!employee) return null

        const auditData = [
            { date: "2023-07-01", action: "Asignat la proiect", details: `Asignat la proiectul "${project?.name}"` },
            { date: "2023-07-02", action: "Check-in", details: "Check-in la 08:00" },
            { date: "2023-07-02", action: "Check-out", details: "Check-out la 17:00" },
            { date: "2023-07-03", action: "Check-in", details: "Check-in la 08:15" },
            { date: "2023-07-03", action: "Check-out", details: "Check-out la 16:45" },
        ]

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{employee.name}</DialogTitle>
                        <DialogDescription>{employee.role}</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="rounded-xl shadow-sm">
                            <CardHeader>
                                <CardTitle>Informații Personale</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-blue-500" />
                                        <span>{employee.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        <span>{employee.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className="h-4 w-4 text-blue-500" />
                                        <span>Rating: {employee.rating}/5</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                        <span>Lucrări finalizate: {employee.completedJobs}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl shadow-sm">
                            <CardHeader>
                                <CardTitle>Competențe și Disponibilitate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <h4 className="font-semibold mb-1">Competențe:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {employee.skills.map((skill, index) => (
                                                <Badge key={index} variant="secondary" className="rounded-full">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Disponibilitate:</h4>
                                        <Badge
                                            variant={
                                                employee.availability === "Disponibil"
                                                    ? "success"
                                                    : employee.availability === "Parțial disponibil"
                                                        ? "warning"
                                                        : "destructive"
                                            }
                                            className="rounded-full"
                                        >
                                            {employee.availability}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="mt-4 rounded-xl shadow-sm">
                        <CardHeader>
                            <CardTitle>Audit</CardTitle>
                            <CardDescription>Istoricul acțiunilor și evenimentelor</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Acțiune</TableHead>
                                            <TableHead>Detalii</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {auditData.map((entry, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{entry.date}</TableCell>
                                                <TableCell>{entry.action}</TableCell>
                                                <TableCell>{entry.details}</TableCell>
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

    function TimeTracking({ attendanceHistory, setAttendanceHistory, reportPeriod, setReportPeriod, handleGenerateReport, projectTeam }) {
        const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
        const [selectedEmployee, setSelectedEmployee] = useState("all")

        const handleCheckIn = (employeeId) => {
            const newEntry = {
                id: attendanceHistory.length + 1,
                employeeId,
                date: selectedDate,
                checkIn: new Date().toLocaleTimeString(),
                checkOut: null,
                totalHours: null,
                project: "Renovare Clădire de Birouri"
            }
            setAttendanceHistory([...attendanceHistory, newEntry])
            toast({
                title: "Succes",
                description: "Check-in înregistrat cu succes.",
            })
        }

        const handleCheckOut = (employeeId) => {
            setAttendanceHistory(attendanceHistory.map(entry => {
                if (entry.employeeId === employeeId && entry.date === selectedDate && !entry.checkOut) {
                    const checkOut = new Date().toLocaleTimeString()
                    const checkInTime = new Date(`${selectedDate} ${entry.checkIn}`)
                    const checkOutTime = new Date(`${selectedDate} ${checkOut}`)
                    const totalHours = ((checkOutTime - checkInTime) / 3600000).toFixed(2)
                    return { ...entry, checkOut, totalHours }
                }
                return entry
            }))
            toast({
                title: "Succes",
                description: "Check-out înregistrat cu succes.",
            })
        }

        const filteredHistory = attendanceHistory.filter(entry =>
            (selectedEmployee === "all" || entry.employeeId === parseInt(selectedEmployee)) &&
            entry.date === selectedDate
        )

        return (
            <div className="space-y-6">
                <div className="flex-1">
                                    <Label htmlFor="date-select">Data</Label>
                                    <Input
                                        id="date-select"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="rounded-full"
                                    />
                                </div>
                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Înregistrare Pontaj</CardTitle>
                        <CardDescription>Înregistrați prezența angajaților pentru ziua curentă</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nume</TableHead>
                                        <TableHead>Check-in</TableHead>
                                        <TableHead>Check-out</TableHead>
                                        <TableHead>Acțiuni</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projectTeam.map((employee) => {
                                        const entry = attendanceHistory.find(e => e.employeeId === employee.id && e.date === selectedDate)
                                        return (
                                            <TableRow key={employee.id}>
                                                <TableCell>{employee.name}</TableCell>
                                                <TableCell>{entry?.checkIn || '-'}</TableCell>
                                                <TableCell>{entry?.checkOut || '-'}</TableCell>
                                                <TableCell>
                                                    {!entry?.checkIn ? (
                                                        <Button onClick={() => handleCheckIn(employee.id)} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                                            Check-in
                                                        </Button>
                                                    ) : !entry?.checkOut ? (
                                                        <Button onClick={() => handleCheckOut(employee.id)} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                                            Check-out
                                                        </Button>
                                                    ) : (
                                                        <Badge variant="success" className="rounded-full">Completat</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Istoric Pontaj</CardTitle>
                        <CardDescription>Vizualizați istoricul de pontaj pentru echipă</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <Label htmlFor="employee-select">Angajat</Label>
                                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                        <SelectTrigger id="employee-select" className="rounded-full">
                                            <SelectValue placeholder="Selectați angajatul" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Toți angajații</SelectItem>
                                            {projectTeam.map((emp) => (
                                                <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <ScrollArea className="h-[300px] rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nume</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Check-in</TableHead>
                                            <TableHead>Check-out</TableHead>
                                            <TableHead>Total Ore</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHistory.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="font-medium">{projectTeam.find(emp => emp.id === entry.employeeId)?.name}</TableCell>
                                                <TableCell>{entry.date}</TableCell>
                                                <TableCell>{entry.checkIn}</TableCell>
                                                <TableCell>{entry.checkOut || "În lucru"}</TableCell>
                                                <TableCell>{entry.totalHours || "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Raportare Ore Lucrate</CardTitle>
                        <CardDescription>Generați și trimiteți rapoarte către manager</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <Label htmlFor="start-date">Data Început</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={reportPeriod.start}
                                    onChange={(e) => setReportPeriod({ ...reportPeriod, start: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="end-date">Data Sfârșit</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={reportPeriod.end}
                                    onChange={(e) => setReportPeriod({ ...reportPeriod, end: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleGenerateReport} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full w-full">
                            <Send className="mr-2 h-4 w-4" /> Generează și Trimite Raport
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    function ProjectDetailsComponent({ project, onProposeChange, changeProposal, setChangeProposal, setIsTaskModalOpen, setCurrentTask, handleDeleteTask }) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                        <span>Data început: {project.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                        <span>Data finalizare: {project.endDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <span>Locație: {project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        <span>Status: {project.status}</span>
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="mb-2 font-semibold">Descriere:</h3>
                    <p>{project.description}</p>
                </div>
                <Separator />
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Sarcini:</h3>
                        <Button onClick={() => {
                            setCurrentTask({ id: null, name: "", status: "Planificat" })
                            setIsTaskModalOpen(true)
                        }} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                            <Plus className="mr-2 h-4 w-4" /> Adaugă Sarcină
                        </Button>
                    </div>
                    <ul className="space-y-2">
                        {project.objectives.map((objective, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <span>{objective}</span>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="rounded-full">
                                        Obiectiv
                                    </Badge>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <Separator />
                <div>
                    <h3 className="mb-2 font-semibold">Servicii:</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="rounded-full">
                                {service}
                            </Badge>
                        ))}
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="mb-2 font-semibold">Echipamente:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {project.equipment.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <Separator />
                <div>
                    <h3 className="mb-2 font-semibold">Propune Modificări:</h3>
                    <Textarea
                        placeholder="Descrieți modificarea propusă..."
                        value={changeProposal}
                        onChange={(e) => setChangeProposal(e.target.value)}
                        className="min-h-[100px] rounded-xl"
                    />
                    <Button onClick={onProposeChange} className="mt-2 bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                        Trimite Propunerea
                    </Button>
                </div>
            </div>
        )
    }

    const EditProject = useCallback(({ project, onBack }) => {
        const [editedProject, setEditedProject] = useState(project)

        const handleSave = () => {
            setProjects(projects.map(p => p.id === editedProject.id ? editedProject : p))
            onBack()
            toast({
                title: "Proiect actualizat",
                description: "Modificările au fost salvate cu succes.",
            })
        }

        return (
            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack} className="text-white hover:text-gray-200">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Înapoi
                        </Button>
                        <CardTitle className="text-2xl font-bold">Editare {project.name}</CardTitle>
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
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-status">Status</Label>
                            <Select
                                value={editedProject.status}
                                onValueChange={(value) => setEditedProject({ ...editedProject, status: value })}
                            >
                                <SelectTrigger id="project-status" className="rounded-full">
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
                                className="rounded-xl"
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-client">Client</Label>
                            <Input
                                id="project-client"
                                value={editedProject.client}
                                onChange={(e) => setEditedProject({ ...editedProject, client: e.target.value })}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-location">Locație</Label>
                            <Input
                                id="project-location"
                                value={editedProject.location}
                                onChange={(e) => setEditedProject({ ...editedProject, location: e.target.value })}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-services">Servicii (separate prin virgulă)</Label>
                            <Textarea
                                id="project-services"
                                rows={3}
                                value={editedProject.services.join(", ")}
                                onChange={(e) => setEditedProject({ ...editedProject, services: e.target.value.split(", ") })}
                                className="rounded-xl"
                            />
                        </div>
                        <div>
                            <Label htmlFor="project-equipment">Echipamente (separate prin virgulă)</Label>
                            <Textarea
                                id="project-equipment"
                                rows={3}
                                value={editedProject.equipment.join(", ")}
                                onChange={(e) => setEditedProject({ ...editedProject, equipment: e.target.value.split(", ") })}
                                className="rounded-xl"
                            />
                        </div>
                        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full w-full">
                            Salvează Modificările
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )
    }, [projects, setProjects])

    return (
        <DashboardLayout links={managerLinks} title="Proiecte">
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {/* <h1 className="text-3xl font-bold text-gray-900">Monitorizare Proiecte Active</h1> */}
                        {currentView === "list" && <ProjectList />}
                        {currentView === "details" && <ProjectDetails project={selectedProject} onBack={() => handleViewChange("list")} />}
                        {currentView === "edit" && <EditProject project={selectedProject} onBack={() => handleViewChange("list")} />}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}