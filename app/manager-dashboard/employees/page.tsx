"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Search, User, Calendar, ClipboardList, Star, Briefcase, Plus, ChevronRight, ChevronLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/layout"
import { managerLinks } from "../page"
import { toast } from "@/hooks/use-toast"
// import { toast } from "@/components/ui/use-toast"

const initialEmployees = [
    { id: 1, name: "Ana Popescu", role: "Cleaning Specialist", team: "Residential", skills: ["Deep Cleaning", "Carpet Cleaning"], availability: "Disponibil", phone: "0722123456", email: "ana.popescu@cleanpro.com", projects: ["Vila Evergreen", "Apartamente Sunrise"], hoursWorked: 160, performance: 95 },
    { id: 2, name: "Mihai Ionescu", role: "Window Cleaner", team: "Commercial", skills: ["High-rise Window Cleaning", "Pressure Washing"], availability: "În proiect", phone: "0733234567", email: "mihai.ionescu@cleanpro.com", projects: ["Turnul de Birouri Skyline"], hoursWorked: 152, performance: 88 },
    { id: 3, name: "Elena Dumitrescu", role: "Team Lead", team: "Industrial", skills: ["Industrial Equipment Cleaning", "OSHA Safety Standards"], availability: "Disponibil", phone: "0744345678", email: "elena.dumitrescu@cleanpro.com", projects: ["Fabrica AutoTech", "Depozit LogiPro"], hoursWorked: 175, performance: 92 },
    { id: 4, name: "Alexandru Popa", role: "Sanitation Specialist", team: "Healthcare", skills: ["Hospital-grade Disinfection", "Biohazard Cleaning"], availability: "În concediu", phone: "0755456789", email: "alexandru.popa@cleanpro.com", projects: ["Spitalul Central"], hoursWorked: 120, performance: 85 },
    { id: 5, name: "Maria Stancu", role: "Green Cleaning Expert", team: "Eco-Friendly", skills: ["Eco-friendly Products", "LEED Certification"], availability: "Disponibil", phone: "0766567890", email: "maria.stancu@cleanpro.com", projects: ["Centrul de Afaceri GreenTech", "Hotelul Natura"], hoursWorked: 168, performance: 90 },
]

const mockProjects = [
    "Vila Evergreen", "Apartamente Sunrise", "Turnul de Birouri Skyline", "Fabrica AutoTech", 
    "Depozit LogiPro", "Spitalul Central", "Centrul de Afaceri GreenTech", "Hotelul Natura"
]

// Mock audit data
const mockAuditData = [
    { date: "2023-07-01", action: "Asignat la proiect", details: "Asignat la proiectul 'Vila Evergreen'", project: "Vila Evergreen" },
    { date: "2023-07-02", action: "Check-in", details: "Check-in la 08:00", project: "Vila Evergreen" },
    { date: "2023-07-02", action: "Check-out", details: "Check-out la 17:00", project: "Vila Evergreen" },
    { date: "2023-07-03", action: "Check-in", details: "Check-in la 08:15", project: "Apartamente Sunrise" },
    { date: "2023-07-03", action: "Check-out", details: "Check-out la 16:45", project: "Apartamente Sunrise" },
    { date: "2023-07-04", action: "Training", details: "Participare la training de siguranță", project: "N/A" },
    { date: "2023-07-05", action: "Evaluare performanță", details: "Evaluare trimestrială", project: "N/A" },
    { date: "2023-07-06", action: "Asignat la proiect", details: "Asignat la proiectul 'Turnul de Birouri Skyline'", project: "Turnul de Birouri Skyline" },
    { date: "2023-07-07", action: "Check-in", details: "Check-in la 07:45", project: "Turnul de Birouri Skyline" },
    { date: "2023-07-07", action: "Check-out", details: "Check-out la 16:30", project: "Turnul de Birouri Skyline" },
]

export default function EmployeeManagement() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [employees, setEmployees] = useState(initialEmployees)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
    const [filterTeam, setFilterTeam] = useState("all")
    const [filterAvailability, setFilterAvailability] = useState("all")
    const [filterProject, setFilterProject] = useState("all")
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false)
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false)
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        role: "",
        team: "",
        skills: [],
        availability: "Disponibil",
        phone: "",
        email: "",
        projects: [],
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)

    const handleViewChange = (view, employee = null) => {
        setCurrentView(view)
        setSelectedEmployee(employee)
        if (view === "details") {
            setIsEmployeeModalOpen(true)
        }
    }

    const handleSort = (key) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterTeam === "all" || employee.team === filterTeam) &&
        (filterAvailability === "all" || employee.availability === filterAvailability) &&
        (filterProject === "all" || employee.projects.includes(filterProject))
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

    const pageCount = Math.ceil(filteredEmployees.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)

    const handleAddEmployee = () => {
        if (!newEmployee.name || !newEmployee.role || !newEmployee.team || !newEmployee.phone || !newEmployee.email) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să completați toate câmpurile obligatorii.",
                variant: "destructive",
            })
            return
        }
        const id = employees.length + 1
        setEmployees([...employees, { ...newEmployee, id, hoursWorked: 0, performance: 0 }])
        setIsAddEmployeeModalOpen(false)
        setNewEmployee({
            name: "",
            role: "",
            team: "",
            skills: [],
            availability: "Disponibil",
            phone: "",
            email: "",
            projects: [],
        })
        toast({
            title: "Succes",
            description: "Angajatul a fost adăugat cu succes.",
        })
    }

    const EmployeeList = () => (
        <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold">Lista Angajaților</CardTitle>
                        <CardDescription className="text-gray-200">Gestionează și vizualizează detaliile angajaților</CardDescription>
                    </div>
                    <Button 
                        onClick={() => setIsAddEmployeeModalOpen(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Adaugă Angajat
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            placeholder="Caută angajați..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                    </div>
                    <Select value={filterTeam} onValueChange={setFilterTeam}>
                        <SelectTrigger className="w-[180px] rounded-full">
                            <SelectValue placeholder="Filtrează după echipă" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate echipele</SelectItem>
                            <SelectItem value="Residential">Rezidențial</SelectItem>
                            <SelectItem value="Commercial">Comercial</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                            <SelectItem value="Healthcare">Sănătate</SelectItem>
                            <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                        <SelectTrigger className="w-[180px] rounded-full">
                            <SelectValue placeholder="Filtrează după disponibilitate" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate statusurile</SelectItem>
                            <SelectItem value="Disponibil">Disponibil</SelectItem>
                            <SelectItem value="În proiect">În proiect</SelectItem>
                            <SelectItem value="În concediu">În concediu</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterProject} onValueChange={setFilterProject}>
                        <SelectTrigger className="w-[180px] rounded-full">
                            <SelectValue placeholder="Filtrează după proiect" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate proiectele</SelectItem>
                            {mockProjects.map((project) => (
                                <SelectItem key={project} value={project}>{project}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                                Nume {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                            </TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('team')}>
                                Echipă {sortConfig.key === 'team' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                            </TableHead>
                            <TableHead>Competențe</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('availability')}>
                                Disponibilitate {sortConfig.key === 'availability' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                            </TableHead>
                            <TableHead>Acțiuni</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>{employee.team}</TableCell>
                                <TableCell>
                                    {employee.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="mr-1 mb-1 rounded-full">
                                            {skill}
                                        </Badge>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        variant={employee.availability === "Disponibil" ? "success" : employee.availability === "În  proiect" ? "warning" : "secondary"}
                                        className="rounded-full"
                                    >
                                        {employee.availability}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                                        onClick={() => handleViewChange("details", employee)}
                                    >
                                        Detalii
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Afișare {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredEmployees.length)} din {filteredEmployees.length} angajați
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
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                            disabled={currentPage === pageCount}
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

    const EmployeeDetailsModal = ({ employee, isOpen, onClose }) => {
        if (!employee) return null

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
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                        <span>Ore lucrate: {employee.hoursWorked} (ultima lună)</span>
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
                                                    : employee.availability === "În proiect"
                                                        ? "warning"
                                                        : "secondary"
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
                                            <TableHead>Proiect</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockAuditData.map((entry, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{entry.date}</TableCell>
                                                <TableCell>{entry.action}</TableCell>
                                                <TableCell>{entry.details}</TableCell>
                                                <TableCell>{entry.project}</TableCell>
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

    const AddEmployeeModal = ({ isOpen, onClose }) => {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Adaugă Angajat Nou</DialogTitle>
                        <DialogDescription>Completați informațiile pentru noul angajat</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nume</Label>
                                <Input
                                    id="name"
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Rol</Label>
                                <Input
                                    id="role"
                                    value={newEmployee.role}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="team">Echipă</Label>
                            <Select
                                value={newEmployee.team}
                                onValueChange={(value) => setNewEmployee({ ...newEmployee, team: value })}
                            >
                                <SelectTrigger id="team" className="rounded-full">
                                    <SelectValue placeholder="Selectează echipa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Residential">Rezidențial</SelectItem>
                                    <SelectItem value="Commercial">Comercial</SelectItem>
                                    <SelectItem value="Industrial">Industrial</SelectItem>
                                    <SelectItem value="Healthcare">Sănătate</SelectItem>
                                    <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="skills">Competențe (separate prin virgulă)</Label>
                            <Input
                                id="skills"
                                value={newEmployee.skills.join(", ")}
                                onChange={(e) => setNewEmployee({ ...newEmployee, skills: e.target.value.split(", ") })}
                                className="rounded-full"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone">Telefon</Label>
                                <Input
                                    id="phone"
                                    value={newEmployee.phone}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddEmployee} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                            Adaugă Angajat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <DashboardLayout links={managerLinks} title="Angajati">
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {/* <h1 className="text-3xl font-bold text-gray-900">Gestionare Angajați</h1> */}
                        <EmployeeList />
                        <EmployeeDetailsModal 
                            employee={selectedEmployee} 
                            isOpen={isEmployeeModalOpen} 
                            onClose={() => setIsEmployeeModalOpen(false)} 
                        />
                        <AddEmployeeModal
                            isOpen={isAddEmployeeModalOpen}
                            onClose={() => setIsAddEmployeeModalOpen(false)}
                        />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}