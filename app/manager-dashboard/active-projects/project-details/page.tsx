"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Check, ChevronDown, Filter, Mail, Phone, Search, User, Briefcase, Clock, Star, Building, MapPin, Wrench, Send, Plus, Edit, Trash, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/layout"
import { coordinatorLinks } from "../../page"
import ResourceManagement from "@/app/coordinator-dashboard/resources/page"

// Mock data for employees (expanded to include at least 5)
const employees = [
    { id: 1, name: "Ana Popescu", role: "Curățător General", skills: ["Curățenie Rezidențială", "Curățenie Birouri"], availability: "Disponibil", phone: "0722123456", email: "ana.popescu@example.com", rating: 4.8, completedJobs: 120 },
    { id: 2, name: "Mihai Ionescu", role: "Specialist Curățenie Industrială", skills: ["Curățenie Industrială", "Manipulare Echipamente"], availability: "Parțial disponibil", phone: "0733234567", email: "mihai.ionescu@example.com", rating: 4.6, completedJobs: 95 },
    { id: 3, name: "Elena Dumitrescu", role: "Supervizor Echipă", skills: ["Management Echipă", "Control Calitate"], availability: "Indisponibil", phone: "0744345678", email: "elena.dumitrescu@example.com", rating: 4.9, completedJobs: 200 },
    { id: 4, name: "Alexandru Popa", role: "Specialist Curățenie Geamuri", skills: ["Curățare Geamuri", "Lucru la Înălțime"], availability: "Disponibil", phone: "0755456789", email: "alexandru.popa@example.com", rating: 4.7, completedJobs: 110 },
    { id: 5, name: "Maria Stancu", role: "Curățător Covoare", skills: ["Curățare Covoare", "Tratamente Speciale"], availability: "Parțial disponibil", phone: "0766567890", email: "maria.stancu@example.com", rating: 4.5, completedJobs: 85 },
    { id: 6, name: "Ion Gheorghe", role: "Specialist Dezinfecție", skills: ["Dezinfecție", "Curățenie Medicală"], availability: "Disponibil", phone: "0777678901", email: "ion.gheorghe@example.com", rating: 4.7, completedJobs: 130 },
    { id: 7, name: "Andreea Munteanu", role: "Curățător Fațade", skills: ["Curățare Fațade", "Lucru la Înălțime"], availability: "Disponibil", phone: "0788789012", email: "andreea.munteanu@example.com", rating: 4.6, completedJobs: 75 },
]

const skills = ["Curățenie Rezidențială", "Curățenie Birouri", "Curățenie Industrială", "Manipulare Echipamente", "Management Echipă", "Control Calitate", "Curățare Geamuri", "Lucru la Înălțime", "Curățare Covoare", "Tratamente Speciale", "Dezinfecție", "Curățenie Medicală", "Curățare Fațade"]

// Mock projects data
const projects = [
    {
        id: 1,
        name: "Renovare Clădire de Birouri",
        description: "Renovarea completă a unei clădiri de birouri cu 5 etaje, inclusiv modernizarea sistemelor HVAC, refacerea instalației electrice și reamenajarea spațiilor interioare.",
        status: "În desfășurare",
        startDate: "2023-07-01",
        endDate: "2023-12-31",
        location: "Str. Victoriei nr. 100, București",
        clientContacts: [
            { name: "Ion Popescu", role: "Manager de Proiect", phone: "0722123456", email: "ion.popescu@client.com" },
            { name: "Maria Ionescu", role: "Arhitect Șef", phone: "0733234567", email: "maria.ionescu@client.com" }
        ],
        tasks: [
            { id: 1, name: "Demontare mobilier vechi", status: "Finalizat" },
            { id: 2, name: "Înlocuire sistem HVAC", status: "În desfășurare" },
            { id: 3, name: "Refacere instalație electrică", status: "În așteptare" },
            { id: 4, name: "Zugrăvire și finisaje", status: "Planificat" }
        ],
        materials: [
            { name: "Vopsea lavabilă", quantity: "500 litri" },
            { name: "Cabluri electrice", quantity: "2000 metri" },
            { name: "Plăci gips-carton", quantity: "300 bucăți" }
        ],
        tools: [
            "Scară telescopică",
            "Set unelte electrice",
            "Echipament de protecție"
        ],
        requiredSkills: ["Curățenie Birouri", "Control Calitate"],
        team: [1, 2, 4] // Employee IDs assigned to this project
    },
    // Add more projects as needed
]

export default function ProjectManagement() {
    const [selectedProject, setSelectedProject] = useState(null)
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
        if (selectedProject) {
            setTeamSelectedSkills(selectedProject.requiredSkills || [])
        }
    }, [selectedProject])

    const handleProjectSelection = (projectId) => {
        const project = projects.find(p => p.id === parseInt(projectId))
        setSelectedProject(project)
        setActiveTab("details")
    }

    const handleProposeChange = () => {
        if (changeProposal.trim() === "") {
            toast({
                title: "Eroare",
                description: "Vă rugăm să introduceți o propunere de modificare.",
                variant: "destructive",
            })
            return
        }
        // În practică, aici ar fi un apel API pentru a trimite propunerea
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

        // În practică, aici ar fi logica pentru generarea și trimiterea raportului
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

        setSelectedProject(prevProject => {
            const updatedTasks = currentTask.id
                ? prevProject.tasks.map(task => task.id === currentTask.id ? currentTask : task)
                : [...prevProject.tasks, { ...currentTask, id: prevProject.tasks.length + 1 }]

            return { ...prevProject, tasks: updatedTasks }
        })

        setIsTaskModalOpen(false)
        setCurrentTask({ id: null, name: "", status: "Planificat" })
        toast({
            title: "Succes",
            description: `Sarcina a fost ${currentTask.id ? "actualizată" : "adăugată"} cu succes.`,
        })
    }

    const handleDeleteTask = (taskId) => {
        setSelectedProject(prevProject => ({
            ...prevProject,
            tasks: prevProject.tasks.filter(task => task.id !== taskId)
        }))
        toast({
            title: "Succes",
            description: "Sarcina a fost ștearsă cu succes.",
        })
    }

    const handleAddToTeam = (employeeId) => {
        if (selectedProject.team.includes(employeeId)) {
            toast({
                title: "Atenție",
                description: "Acest angajat este deja în echipă.",
                variant: "warning",
            })
            return
        }

        setSelectedProject(prevProject => ({
            ...prevProject,
            team: [...prevProject.team, employeeId]
        }))
        toast({
            title: "Succes",
            description: "Angajatul a fost adăugat în echipă.",
        })
    }

    const handleRemoveFromTeam = (employeeId) => {
        setSelectedProject(prevProject => ({
            ...prevProject,
            team: prevProject.team.filter(id => id !== employeeId)
        }))
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
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Gestionare Proiect</h1>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Selectare Proiect</CardTitle>
                                <CardDescription className="text-gray-300">Alegeți proiectul pe care doriți să-l gestionați</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Select onValueChange={handleProjectSelection}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selectați un proiect" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={project.id}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                            {selectedProject && (
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                        <CardTitle>{selectedProject.name}</CardTitle>
                                        <CardDescription className="text-gray-300">Detalii și gestionare proiect</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                                            <TabsList className="w-full rounded-none border-b">
                                                <TabsTrigger value="details" className="flex-1">Detalii  Proiect</TabsTrigger>
                                                <TabsTrigger value="team" className="flex-1">Gestionare Echipă</TabsTrigger>
                                                <TabsTrigger value="timeTracking" className="flex-1">Pontaj</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="details" className="p-6">
                                                <ProjectDetails
                                                    project={selectedProject}
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
                                                    project={selectedProject}
                                                    teamMembers={employees.filter(emp => selectedProject.team.includes(emp.id))}
                                                    handleRemoveFromTeam={handleRemoveFromTeam}
                                                    setIsTeamModalOpen={setIsTeamModalOpen}
                                                    openEmployeeModal={openEmployeeModal}
                                                />
                                            </TabsContent>
                                            <TabsContent value="resources" className="p-6">
                                                <ResourceManagement
                                                    // attendanceHistory={attendanceHistory}
                                                    // setAttendanceHistory={setAttendanceHistory}
                                                    // reportPeriod={reportPeriod}
                                                    // setReportPeriod={setReportPeriod}
                                                    // handleGenerateReport={handleGenerateReport}
                                                    // projectTeam={employees.filter(emp => selectedProject.team.includes(emp.id))}
                                                />
                                            </TabsContent>
                                            <TabsContent value="timeTracking" className="p-6">
                                                <TimeTracking
                                                    attendanceHistory={attendanceHistory}
                                                    setAttendanceHistory={setAttendanceHistory}
                                                    reportPeriod={reportPeriod}
                                                    setReportPeriod={setReportPeriod}
                                                    handleGenerateReport={handleGenerateReport}
                                                    projectTeam={employees.filter(emp => selectedProject.team.includes(emp.id))}
                                                />
                                            </TabsContent>
                                            <TabsContent value="dailyReport" className="p-6">
                                                <TimeTracking
                                                    attendanceHistory={attendanceHistory}
                                                    setAttendanceHistory={setAttendanceHistory}
                                                    reportPeriod={reportPeriod}
                                                    setReportPeriod={setReportPeriod}
                                                    handleGenerateReport={handleGenerateReport}
                                                    projectTeam={employees.filter(emp => selectedProject.team.includes(emp.id))}
                                                />
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            )}

                        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                            <DialogContent>
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
                                            className="col-span-3"
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
                                            <SelectTrigger className="col-span-3">
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
                                    <Button onClick={handleAddOrEditTask} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                        {currentTask.id ? "Actualizează Sarcina" : "Adaugă Sarcina"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
                            <DialogContent className="max-w-4xl">
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
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="availability-filter">Disponibilitate</Label>
                                            <Select value={teamAvailability} onValueChange={setTeamAvailability}>
                                                <SelectTrigger id="availability-filter">
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
                                                    <Button variant="outline" className="w-full justify-between">
                                                        {teamSelectedSkills.length > 0 ? `${teamSelectedSkills.length} selectate` : "Selectează competențe"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Caută competențe..." />
                                                        <CommandEmpty>Nu s-au găsit competențe.</CommandEmpty>
                                                        <CommandGroup>
                                                            {skills.map((skill) => (
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
                                                            >
                                                                {employee.availability}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    onClick={() => handleAddToTeam(employee.id)}
                                                                    disabled={selectedProject?.team.includes(employee.id)}
                                                                    className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90"
                                                                >
                                                                    {selectedProject?.team.includes(employee.id) ? "În echipă" : "Adaugă în echipă"}
                                                                </Button>
                                                                <Button
                                                                    onClick={() => openEmployeeModal(employee)}
                                                                    variant="outline"
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

                        <EmployeeDetailsModal
                            isOpen={isEmployeeModalOpen}
                            onClose={() => setIsEmployeeModalOpen(false)}
                            employee={selectedEmployee}
                            project={selectedProject}
                        />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}

function TeamManagement({ project, teamMembers, handleRemoveFromTeam, setIsTeamModalOpen, openEmployeeModal }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Echipa Proiectului</h2>
                <Button onClick={() => setIsTeamModalOpen(true)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
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
                                    <Badge key={index} variant="outline" className="mr-1">
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
                                >
                                    {member.availability}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button variant="destructive" onClick={() => handleRemoveFromTeam(member.id)}>
                                        Elimină din Echipă
                                    </Button>
                                    <Button
                                        onClick={() => openEmployeeModal(member)}
                                        variant="outline"
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

    // Mock audit data (in a real application, this would come from a database)
    const auditData = [
        { date: "2023-07-01", action: "Asignat la proiect", details: `Asignat la proiectul "${project?.name}"` },
        { date: "2023-07-02", action: "Check-in", details: "Check-in la 08:00" },
        { date: "2023-07-02", action: "Check-out", details: "Check-out la 17:00" },
        { date: "2023-07-03", action: "Check-in", details: "Check-in la 08:15" },
        { date: "2023-07-03", action: "Check-out", details: "Check-out la 16:45" },
        // Add more mock audit data as needed
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{employee.name}</DialogTitle>
                    <DialogDescription>{employee.role}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informații Personale</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-[#FAA502]" />
                                    <span>{employee.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-[#FAA502]" />
                                    <span>{employee.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="h-4 w-4 text-[#FAA502]" />
                                    <span>Rating: {employee.rating}/5</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Briefcase className="h-4 w-4 text-[#FAA502]" />
                                    <span>Lucrări finalizate: {employee.completedJobs}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Competențe și Disponibilitate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <h4 className="font-semibold mb-1">Competențe:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {employee.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary">
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
                                    >
                                        {employee.availability}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="mt-4">
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

function ProjectDetails({ project, onProposeChange, changeProposal, setChangeProposal, setIsTaskModalOpen, setCurrentTask, handleDeleteTask }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-[#FAA502]" />
                    <span>Data început: {project.startDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-[#FAA502]" />
                    <span>Data finalizare: {project.endDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-[#FAA502]" />
                    <span>Locație: {project.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-[#FAA502]" />
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
                    }} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                        <Plus className="mr-2 h-4 w-4" /> Adaugă Sarcină
                    </Button>
                </div>
                <ul className="space-y-2">
                    {project.tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between">
                            <span>{task.name}</span>
                            <div className="flex items-center space-x-2">
                                <Badge variant={task.status === "Finalizat" ? "success" : task.status === "În desfășurare" ? "default" : "secondary"}>
                                    {task.status}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Deschide meniu</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                            setCurrentTask(task)
                                            setIsTaskModalOpen(true)
                                        }}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editează</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                                            <Trash className="mr-2 h-4 w-4" />
                                            <span>Șterge</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Separator />
            <div>
                <h3 className="mb-2 font-semibold">Contacte Client:</h3>
                {project.clientContacts.map((contact, index) => (
                    <div key={index} className="mb-4 space-y-2">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-[#FAA502]" />
                            <span className="font-semibold">{contact.name}</span>
                        </div>
                        <div className="ml-7 space-y-1">
                            <p>{contact.role}</p>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-[#FAA502]" />
                                <span>{contact.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-[#FAA502]" />
                                <span>{contact.email}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Separator />
            <div>
                <h3 className="mb-2 font-semibold">Materiale și Unelte:</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <h4 className="mb-2 font-medium">Materiale:</h4>
                        <ul className="list-inside list-disc space-y-1">
                            {project.materials.map((material, index) => (
                                <li key={index}>{material.name} - {material.quantity}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-2 font-medium">Unelte:</h4>
                        <ul className="list-inside list-disc space-y-1">
                            {project.tools.map((tool, index) => (
                                <li key={index}>{tool}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="mb-2 font-semibold">Propune Modificări:</h3>
                <Textarea
                    placeholder="Descrieți modificarea propusă..."
                    value={changeProposal}
                    onChange={(e) => setChangeProposal(e.target.value)}
                    className="min-h-[100px]"
                />
                <Button onClick={onProposeChange} className="mt-2 bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                    Trimite Propunerea
                </Button>
            </div>
        </div>
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
            project: "Renovare Clădire de Birouri" // This should be dynamic based on the selected project
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
            <Card>
                <CardHeader>
                    <CardTitle>Înregistrare Pontaj</CardTitle>
                    <CardDescription>Înregistrați prezența angajaților pentru ziua curentă</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label htmlFor="date-select">Data</Label>
                                <Input
                                    id="date-select"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="rounded-md"
                                />
                            </div>
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
                                                    <Button onClick={() => handleCheckIn(employee.id)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                                        Check-in
                                                    </Button>
                                                ) : !entry?.checkOut ? (
                                                    <Button onClick={() => handleCheckOut(employee.id)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                                        Check-out
                                                    </Button>
                                                ) : (
                                                    <Badge variant="success">Completat</Badge>
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

            <Card>
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
                                    <SelectTrigger id="employee-select" className="rounded-md">
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

            <Card>
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
                                className="rounded-md"
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="end-date">Data Sfârșit</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={reportPeriod.end}
                                onChange={(e) => setReportPeriod({ ...reportPeriod, end: e.target.value })}
                                className="rounded-md"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateReport} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                        <Send className="mr-2 h-4 w-4" /> Generează și Trimite Raport
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}