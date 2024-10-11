"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Check, ChevronDown, Filter, Mail, Phone, Search, User, Briefcase, Clock, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/layout"
import { coordinatorLinks } from "../page"

// Mock data for a cleaning company
const employees = [
    { id: 1, name: "Ana Popescu", role: "Curățător General", skills: ["Curățenie Rezidențială", "Curățenie Birouri"], availability: "Disponibil", phone: "0722123456", email: "ana.popescu@example.com", rating: 4.8, completedJobs: 120 },
    { id: 2, name: "Mihai Ionescu", role: "Specialist Curățenie Industrială", skills: ["Curățenie Industrială", "Manipulare Echipamente"], availability: "Parțial disponibil", phone: "0733234567", email: "mihai.ionescu@example.com", rating: 4.6, completedJobs: 95 },
    { id: 3, name: "Elena Dumitrescu", role: "Supervizor Echipă", skills: ["Management Echipă", "Control Calitate"], availability: "Indisponibil", phone: "0744345678", email: "elena.dumitrescu@example.com", rating: 4.9, completedJobs: 200 },
    { id: 4, name: "Alexandru Popa", role: "Specialist Curățenie Geamuri", skills: ["Curățare Geamuri", "Lucru la Înălțime"], availability: "Disponibil", phone: "0755456789", email: "alexandru.popa@example.com", rating: 4.7, completedJobs: 110 },
    { id: 5, name: "Maria Stancu", role: "Curățător Covoare", skills: ["Curățare Covoare", "Tratamente Speciale"], availability: "Parțial disponibil", phone: "0766567890", email: "maria.stancu@example.com", rating: 4.5, completedJobs: 85 },
]

const skills = ["Curățenie Rezidențială", "Curățenie Birouri", "Curățenie Industrială", "Manipulare Echipamente", "Management Echipă", "Control Calitate", "Curățare Geamuri", "Lucru la Înălțime", "Curățare Covoare", "Tratamente Speciale"]

const projects = [
    { id: 1, name: "Curățenie Sediu Corporație", type: "Curățenie Birouri", startDate: "2024-03-15", endDate: "2024-03-16", requiredSkills: ["Curățenie Birouri", "Control Calitate"] },
    { id: 2, name: "Curățenie Post-Construcție", type: "Curățenie Industrială", startDate: "2024-03-20", endDate: "2024-03-22", requiredSkills: ["Curățenie Industrială", "Manipulare Echipamente"] },
    { id: 3, name: "Întreținere Clădire Rezidențială", type: "Curățenie Rezidențială", startDate: "2024-03-18", endDate: "2024-03-19", requiredSkills: ["Curățenie Rezidențială", "Curățare Covoare"] },
]

export default function EmployeeSelection() {
    const [selectedSkills, setSelectedSkills] = useState([])
    const [availability, setAvailability] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [date, setDate] = useState(new Date())
    const [selectedProject, setSelectedProject] = useState(null)
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)

    const filteredEmployees = employees.filter(employee =>
        (searchTerm === "" || employee.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (availability === "all" || employee.availability === availability) &&
        (selectedSkills.length === 0 || selectedSkills.every(skill => employee.skills.includes(skill)))
    )

    const toggleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        )
    }

    const handleProjectSelection = (projectId) => {
        const project = projects.find(p => p.id === projectId)
        setSelectedProject(project)
        setSelectedSkills(project.requiredSkills)
    }

    const handleAssignEmployees = () => {
        if (!selectedProject) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să selectați un proiect înainte de a asigna angajați.",
                variant: "destructive",
            })
            return
        }

        if (selectedEmployees.length === 0) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să selectați cel puțin un angajat pentru asignare.",
                variant: "destructive",
            })
            return
        }

        // Here you would typically send this data to your backend
        console.log(`Angajați asignați la proiectul ${selectedProject.name}:`, selectedEmployees)
        toast({
            title: "Succes",
            description: `${selectedEmployees.length} angajați au fost asignați la proiectul ${selectedProject.name}.`,
        })
        setIsAssignmentModalOpen(false)
        setSelectedEmployees([])
        setSelectedProject(null)
    }

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Selectare Angajați pentru Proiect</h1>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Selectare Proiect</CardTitle>
                                <CardDescription className="text-gray-300">Alegeți proiectul pentru care doriți să selectați angajați</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Select onValueChange={handleProjectSelection}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selectați un proiect" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={project.id}>
                                                {project.name} ({project.startDate} - {project.endDate})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Filtrare și Căutare</CardTitle>
                                <CardDescription className="text-gray-300">Selectați criteriile pentru a găsi angajații potriviți</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Căutare</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                            <Input
                                                placeholder="Caută angajați..."
                                                className="pl-10 rounded-md"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Competențe</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between rounded-md">
                                                    {selectedSkills.length > 0 ? `${selectedSkills.length} selectate` : "Selectează competențe"}
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
                                                                    setSelectedSkills(prev =>
                                                                        prev.includes(skill)
                                                                            ? prev.filter(s => s !== skill)
                                                                            : [...prev, skill]
                                                                    )
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={selectedSkills.includes(skill)}
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
                                    <div className="space-y-2">
                                        <Label>Disponibilitate</Label>
                                        <Select value={availability} onValueChange={setAvailability}>
                                            <SelectTrigger className="rounded-md">
                                                <SelectValue placeholder="Selectează disponibilitatea" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toți</SelectItem>
                                                <SelectItem value="Disponibil">Disponibil</SelectItem>
                                                <SelectItem value="Parțial disponibil">Parțial disponibil</SelectItem>
                                                <SelectItem value="Indisponibil">Indisponibil</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Angajați Disponibili</CardTitle>
                                <CardDescription className="text-gray-300">Selectați angajații pentru proiect</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ScrollArea className="h-[400px] rounded-md border">
                                    {filteredEmployees.map((employee) => (
                                        <div key={employee.id} className="mb-4 flex items-center justify-between p-4 hover:bg-gray-100 rounded-md">
                                            <div className="flex items-center space-x-4">
                                                <Checkbox
                                                    checked={selectedEmployees.includes(employee.id)}
                                                    onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                                                />
                                                <div>
                                                    <p className="font-medium">{employee.name}</p>
                                                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {employee.skills.map((skill) => (
                                                    <Badge key={skill} variant="secondary" className="rounded-full">
                                                        {skill}
                                                    </Badge>
                                                ))}
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
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="rounded-md">
                                                            Detalii
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>{employee.name}</DialogTitle>
                                                            <DialogDescription>{employee.role}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Phone className="h-4 w-4 text-[#FAA502]" />
                                                                <span>{employee.phone}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Mail className="h-4  w-4 text-[#FAA502]" />
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
                                                            <Separator />
                                                            <div>
                                                                <h4 className="mb-2 font-medium">Calendar Disponibilitate</h4>
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={date}
                                                                    onSelect={setDate}
                                                                    className="rounded-md border"
                                                                />
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button 
                                className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md"
                                onClick={() => setIsAssignmentModalOpen(true)}
                                disabled={selectedEmployees.length === 0 || !selectedProject}
                            >
                                Asignează Angajați Selectați ({selectedEmployees.length})
                            </Button>
                        </div>

                        <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirmare Asignare Angajați</DialogTitle>
                                    <DialogDescription>
                                        Sunteți pe cale să asignați {selectedEmployees.length} angajați la proiectul {selectedProject?.name}.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <h4 className="font-medium mb-2">Detalii Proiect:</h4>
                                    <p>Nume: {selectedProject?.name}</p>
                                    <p>Tip: {selectedProject?.type}</p>
                                    <p>Perioada: {selectedProject?.startDate} - {selectedProject?.endDate}</p>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAssignmentModalOpen(false)}>
                                        Anulează
                                    </Button>
                                    <Button onClick={handleAssignEmployees} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                        Confirmă Asignarea
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}