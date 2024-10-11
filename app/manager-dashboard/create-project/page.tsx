"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, Trash2, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from '@/components/layout'
import { managerLinks } from '../page'

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the project data to your backend
        console.log('Project submitted:', project)
        // You can also add logic here to send notifications to the coordinator
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="min-h-screen bg-[#F4F7FA] p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-8 text-[#0A2747]">Creare Proiect Nou</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="border-none shadow-md rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#0A2747] text-white p-6">
                            <CardTitle className="text-xl">Detalii Proiect</CardTitle>
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

                    <Card className="border-none shadow-md rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#0A2747] text-white p-6">
                            <CardTitle className="text-xl">Persoane de Contact</CardTitle>
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

                    <Card className="border-none shadow-md rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#0A2747] text-white p-6">
                            <CardTitle className="text-xl">Resurse Necesare</CardTitle>
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

                    <Card className="border-none shadow-md rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#0A2747] text-white p-6">
                            <CardTitle className="text-xl">Detalii Financiare și Planificare</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium text-gray-700">Preț Lucrare (vizibil doar pentru manager)</Label>
                                <Input id="price" name="price" type="number" value={project.price} onChange={handleInputChange} className="rounded-md" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Data și Ora Începerii</Label>
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
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#0A2747] text-white p-6">
                            <CardTitle className="text-xl">Asignare Echipe</CardTitle>
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

                    <Card className="border-none shadow-md rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#0A2747] text-white p-6">
                            <CardTitle className="text-xl">Încărcare Documente</CardTitle>
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

                    <Button type="submit" className="w-full bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md py-2 text-lg font-semibold">
                        Creează Proiect
                    </Button>
                </form>
            </div>
        </DashboardLayout>
    )
}