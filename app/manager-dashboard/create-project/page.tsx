"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, Trash2, Plus, X, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from '@/components/layout'
import { managerLinks } from '../page'
import { toast } from '@/hooks/use-toast'
// import { toast } from "@/components/ui/use-toast"

type Contact = {
    name: string;
    phone: string;
}

type Team = {
    id: string;
    name: string;
    skills: string[];
}

type Project = {
    name: string;
    description: string;
    location: string;
    contacts: Contact[];
    materials: string;
    people: string;
    equipment: string;
    price: string;
    date: Date | undefined;
    startTime: string;
    endTime: string;
    duration: number;
    teams: string[];
    files: File[];
}

const teams: Team[] = [
    { id: '1', name: 'Echipa Rezidențială', skills: ['Curățenie generală', 'Curățare covoare'] },
    { id: '2', name: 'Echipa Comercială', skills: ['Curățenie birouri', 'Curățare geamuri'] },
    { id: '3', name: 'Echipa Industrială', skills: ['Curățenie fabrici', 'Decontaminare'] },
]

export default function ProjectCreation() {
    const [project, setProject] = useState<Project>({
        name: '',
        description: '',
        location: '',
        contacts: [{ name: '', phone: '' }],
        materials: '',
        people: '',
        equipment: '',
        price: '',
        date: undefined,
        startTime: '',
        endTime: '',
        duration: 0,
        teams: [],
        files: [],
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProject({ ...project, [e.target.name]: e.target.value })
    }

    const handleContactChange = (index: number, field: 'name' | 'phone', value: string) => {
        const newContacts = [...project.contacts]
        newContacts[index][field] = value
        setProject({ ...project, contacts: newContacts })
    }

    const addContact = () => {
        setProject({ ...project, contacts: [...project.contacts, { name: '', phone: '' }] })
    }

    const removeContact = (index: number) => {
        const newContacts = project.contacts.filter((_, i) => i !== index)
        setProject({ ...project, contacts: newContacts })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProject({ ...project, files: [...project.files, ...Array.from(e.target.files)] })
        }
    }

    const removeFile = (index: number) => {
        const newFiles = project.files.filter((_, i) => i !== index)
        setProject({ ...project, files: newFiles })
    }

    const handleTeamChange = (value: string) => {
        if (!project.teams.includes(value)) {
            setProject({ ...project, teams: [...project.teams, value] })
        }
    }

    const removeTeam = (teamId: string) => {
        const newTeams = project.teams.filter(id => id !== teamId)
        setProject({ ...project, teams: newTeams })
    }

    const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
        setProject({ ...project, [field]: value })
        if (project.startTime && field === 'endTime') {
            const start = new Date(`2000-01-01T${project.startTime}`)
            const end = new Date(`2000-01-01T${value}`)
            const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
            setProject(prev => ({ ...prev, duration: parseFloat(durationInHours.toFixed(2)) }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the project data to your backend
        console.log('Project submitted:', project)
        // Simulating an API call
        setTimeout(() => {
            toast({
                title: "Proiect creat cu succes",
                description: `Proiectul "${project.name}" a fost înregistrat.`,
            })
        }, 1000)
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-4xl space-y-8">
                        {/* <h1 className="text-3xl font-bold text-gray-900">Creare Proiect Nou</h1> */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <CardHeader className="bg-white border-b border-gray-200 px-6 py-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">Detalii Proiect</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Introduceți informațiile de bază ale proiectului</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nume Proiect</Label>
                                        <Input id="name" name="name" value={project.name} onChange={handleInputChange} required className="rounded-md" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descriere Detaliată</Label>
                                        <Textarea id="description" name="description" value={project.description} onChange={handleInputChange} required className="rounded-md" rows={4} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">Locație</Label>
                                        <Input id="location" name="location" value={project.location} onChange={handleInputChange} required className="rounded-md" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <CardHeader className="bg-white border-b border-gray-200 px-6 py-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">Persoane de Contact</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Adăugați persoanele de contact pentru acest proiect</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    {project.contacts.map((contact, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Input
                                                placeholder="Nume"
                                                value={contact.name}
                                                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                                className="rounded-md flex-grow"
                                            />
                                            <Input
                                                placeholder="Telefon"
                                                value={contact.phone}
                                                onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                                                className="rounded-md flex-grow"
                                            />
                                            <Button type="button" onClick={() => removeContact(index)} variant="ghost" size="icon" className="rounded-full">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" onClick={addContact} variant="outline" className="mt-2 rounded-md">
                                        <Plus className="mr-2 h-4 w-4" /> Adaugă Contact
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <CardHeader className="bg-white border-b border-gray-200 px-6 py-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">Resurse Necesare</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Specificați resursele necesare pentru proiect</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="materials" className="text-sm font-medium text-gray-700">Materiale de Curățenie</Label>
                                        <Textarea id="materials" name="materials" value={project.materials} onChange={handleInputChange} placeholder="Ex: Detergenți, mopuri, lavete" className="rounded-md" rows={3} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="people" className="text-sm font-medium text-gray-700">Personal Necesar</Label>
                                        <Textarea id="people" name="people" value={project.people} onChange={handleInputChange} placeholder="Ex: 3 curățători, 1 supervizor" className="rounded-md" rows={3} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="equipment" className="text-sm font-medium text-gray-700">Echipamente</Label>
                                        <Textarea id="equipment" name="equipment" value={project.equipment} onChange={handleInputChange} placeholder="Ex: Aspiratoare industriale, mașini de spălat pardoseli" className="rounded-md" rows={3} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <CardHeader className="bg-white border-b border-gray-200 px-6 py-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">Detalii Financiare și Planificare</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Setați prețul, data și durata proiectului</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-sm font-medium text-gray-700">Preț Lucrare (vizibil doar pentru manager)</Label>
                                        <Input id="price" name="price" type="number" value={project.price} onChange={handleInputChange} className="rounded-md" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Data Începerii</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal rounded-md",
                                                        !project.date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {project.date ? format(project.date, "PPP") : <span>Alege o dată</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={project.date}
                                                    onSelect={(date) => setProject({ ...project, date })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Interval Orar</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="time"
                                                value={project.startTime}
                                                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                                                className="rounded-md"
                                            />
                                            <span>-</span>
                                            <Input
                                                type="time"
                                                value={project.endTime}
                                                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                                                className="rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Durata Proiectului</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="number"
                                                value={project.duration}
                                                readOnly
                                                className="rounded-md"
                                            />
                                            <span>ore</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <CardHeader className="bg-white border-b border-gray-200 px-6 py-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">Asignare Echipe</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Selectați echipele care vor lucra la acest proiect</CardDescription>
                                
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Select onValueChange={handleTeamChange}>
                                        <SelectTrigger className="rounded-md">
                                            <SelectValue placeholder="Selectează echipa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teams.map((team) => (
                                                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="mt-4 space-y-2">
                                        {project.teams.map((teamId) => {
                                            const team = teams.find(t => t.id === teamId)
                                            return team ? (
                                                <div key={team.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                                    <span>{team.name}</span>
                                                    <Button onClick={() => removeTeam(team.id)} variant="ghost" size="sm" className="rounded-full">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : null
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <CardHeader className="bg-white border-b border-gray-200 px-6 py-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">Încărcare Documente</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Adăugați documentele relevante pentru proiect</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                        <Input id="file" type="file" multiple onChange={handleFileChange} className="rounded-md flex-grow" />
                                        <Button asChild variant="secondary" className="rounded-md">
                                            <Label htmlFor="file" className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" /> Import
                                            </Label>
                                        </Button>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {project.files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                                <span className="truncate">{file.name}</span>
                                                <Button onClick={() => removeFile(index)} variant="ghost" size="sm" className="rounded-full">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-md py-2 text-lg font-semibold">
                                Creează Proiect
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}