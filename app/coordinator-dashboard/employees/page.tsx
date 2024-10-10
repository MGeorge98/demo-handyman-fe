"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Check, ChevronDown, Filter, Mail, Phone, Search, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/layout"
import { coordinatorLinks } from "../page"

const employees = [
    { id: 1, name: "Ana Popescu", role: "Developer", skills: ["React", "TypeScript"], availability: "Disponibil", phone: "0722123456", email: "ana.popescu@example.com" },
    { id: 2, name: "Mihai Ionescu", role: "Designer", skills: ["UI/UX", "Figma"], availability: "Parțial disponibil", phone: "0733234567", email: "mihai.ionescu@example.com" },
    { id: 3, name: "Elena Dumitrescu", role: "Manager", skills: ["Project Management", "Agile"], availability: "Indisponibil", phone: "0744345678", email: "elena.dumitrescu@example.com" },
    { id: 4, name: "Alexandru Popa", role: "Developer", skills: ["Node.js", "Python"], availability: "Disponibil", phone: "0755456789", email: "alexandru.popa@example.com" },
    { id: 5, name: "Maria Stancu", role: "Tester", skills: ["QA", "Automation"], availability: "Parțial disponibil", phone: "0766567890", email: "maria.stancu@example.com" },
]

const skills = ["React", "TypeScript", "UI/UX", "Figma", "Project Management", "Agile", "Node.js", "Python", "QA", "Automation"]

export default function EmployeeSelection() {
    const [selectedSkills, setSelectedSkills] = useState([])
    const [availability, setAvailability] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [date, setDate] = useState(new Date())

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

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Selectare Angajați pentru Proiect</h1>

                        <Card>
                            <CardHeader>
                                <CardTitle>Filtrare și Căutare</CardTitle>
                                <CardDescription>Selectați criteriile pentru a găsi angajații potriviți</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Căutare</Label>
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Caută angajați..."
                                                className="pl-8"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Competențe</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
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
                                            <SelectTrigger>
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Angajați Disponibili</CardTitle>
                                <CardDescription>Selectați angajații pentru proiect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    {filteredEmployees.map((employee) => (
                                        <div key={employee.id} className="mb-4 flex items-center justify-between">
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
                                                    <Badge key={skill} variant="secondary">
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
                                                >
                                                    {employee.availability}
                                                </Badge>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            Detalii
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{employee.name}</DialogTitle>
                                                            <DialogDescription>{employee.role}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Phone className="h-4 w-4" />
                                                                <span>{employee.phone}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Mail className="h-4 w-4" />
                                                                <span>{employee.email}</span>
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
                            <Button className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                Adaugă Angajați Selectați ({selectedEmployees.length})
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}