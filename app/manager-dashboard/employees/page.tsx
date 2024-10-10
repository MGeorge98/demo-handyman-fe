"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Search, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/layout"
import { managerLinks } from "../page"

const initialEmployees = [
    { id: 1, name: "Ana Popescu", role: "Developer", team: "Frontend", skills: ["React", "TypeScript"], availability: "Disponibil", phone: "0722123456", email: "ana.popescu@example.com", projects: ["Proiect Alpha", "Proiect Beta"], hoursWorked: 160, performance: 95 },
    { id: 2, name: "Mihai Ionescu", role: "Designer", team: "UX/UI", skills: ["Figma", "Adobe XD"], availability: "În proiect", phone: "0733234567", email: "mihai.ionescu@example.com", projects: ["Proiect Gamma"], hoursWorked: 152, performance: 88 },
    { id: 3, name: "Elena Dumitrescu", role: "Manager", team: "Project Management", skills: ["Agile", "Scrum"], availability: "Disponibil", phone: "0744345678", email: "elena.dumitrescu@example.com", projects: ["Proiect Delta", "Proiect Epsilon"], hoursWorked: 175, performance: 92 },
    { id: 4, name: "Alexandru Popa", role: "Developer", team: "Backend", skills: ["Node.js", "Python"], availability: "În concediu", phone: "0755456789", email: "alexandru.popa@example.com", projects: ["Proiect Beta"], hoursWorked: 120, performance: 85 },
    { id: 5, name: "Maria Stancu", role: "Tester", team: "QA", skills: ["Selenium", "Jest"], availability: "Disponibil", phone: "0766567890", email: "maria.stancu@example.com", projects: ["Proiect Alpha", "Proiect Gamma"], hoursWorked: 168, performance: 90 },
]

export default function EmployeeManagement() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [employees, setEmployees] = useState(initialEmployees)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
    const [filterTeam, setFilterTeam] = useState("all")
    const [filterAvailability, setFilterAvailability] = useState("all")

    const handleViewChange = (view, employee = null) => {
        setCurrentView(view)
        setSelectedEmployee(employee)
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
        (filterAvailability === "all" || employee.availability === filterAvailability)
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

    const EmployeeList = () => (
        <Card>
            <CardHeader>
                <CardTitle>Lista Angajaților</CardTitle>
                <CardDescription>Gestionează și vizualizează detaliile angajaților</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center space-x-2">
                    <Input
                        placeholder="Caută angajați..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={filterTeam} onValueChange={setFilterTeam}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrează după echipă" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate echipele</SelectItem>
                            <SelectItem value="Frontend">Frontend</SelectItem>
                            <SelectItem value="Backend">Backend</SelectItem>
                            <SelectItem value="UX/UI">UX/UI</SelectItem>
                            <SelectItem value="Project Management">Project Management</SelectItem>
                            <SelectItem value="QA">QA</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrează după disponibilitate" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate</SelectItem>
                            <SelectItem value="Disponibil">Disponibil</SelectItem>
                            <SelectItem value="În proiect">În proiect</SelectItem>
                            <SelectItem value="În concediu">În concediu</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ScrollArea className="h-[500px]">
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
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.role}</TableCell>
                                    <TableCell>{employee.team}</TableCell>
                                    <TableCell>
                                        {employee.skills.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="mr-1">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={employee.availability === "Disponibil" ? "success" : employee.availability === "În proiect" ? "warning" : "secondary"}>
                                            {employee.availability}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90"
                                            onClick={() => handleViewChange("details", employee)}
                                        >
                                            Detalii
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )

    const EmployeeDetails = ({ employee, onBack }) => (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Înapoi
                    </Button>
                    <CardTitle>{employee.name}</CardTitle>
                </div>
                <CardDescription>Detalii despre angajat</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="personal">
                    <TabsList>
                        <TabsTrigger value="personal">Date Personale</TabsTrigger>
                        <TabsTrigger value="work">Istoric Lucrări</TabsTrigger>
                        <TabsTrigger value="performance">Performanță</TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-[#0A2747]" />
                                <span>Rol: {employee.role}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-5 w-5 text-[#0A2747]" />
                                <span>Email: {employee.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-5 w-5 text-[#0A2747]" />
                                <span>Telefon: {employee.phone}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#0A2747]">Competențe:</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {employee.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="work">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#0A2747]">Proiecte Asignate:</h3>
                            <ul className="list-disc list-inside">
                                {employee.projects.map((project) => (
                                    <li key={project}>{project}</li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>
                    <TabsContent value="performance">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-[#0A2747]">Ore Lucrate:</h3>
                                <p>{employee.hoursWorked} ore în ultima lună</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#0A2747]">Scor de Performanță:</h3>
                                <p>{employee.performance}/100</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )

    return (
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Gestionare Angajați</h1>
                        {currentView === "list" && <EmployeeList />}
                        {currentView === "details" && <EmployeeDetails employee={selectedEmployee} onBack={() => handleViewChange("list")} />}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}