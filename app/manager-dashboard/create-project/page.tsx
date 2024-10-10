'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload } from "lucide-react"
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
}

type Project = {
    name: string;
    description: string;
    location: string;
    contacts: Contact[];
    materials: string;
    people: string;
    tools: string;
    price: string;
    date: Date | undefined;
    teams: string[];
    files: File[];
}

const teams: Team[] = [
    { id: '1', name: 'Echipa Alpha' },
    { id: '2', name: 'Echipa Beta' },
    { id: '3', name: 'Echipa Gamma' },
]

export default function ProjectCreation() {
    const [project, setProject] = useState<Project>({
        name: '',
        description: '',
        location: '',
        contacts: [{ name: '', phone: '' }],
        materials: '',
        people: '',
        tools: '',
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProject({ ...project, files: [...project.files, ...Array.from(e.target.files)] })
        }
    }

    const handleTeamChange = (value: string) => {
        setProject({ ...project, teams: [...project.teams, value] })
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
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Creare Proiect Nou</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalii Proiect</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nume Proiect</Label>
                                <Input id="name" name="name" value={project.name} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="description">Descriere Detaliată</Label>
                                <Textarea id="description" name="description" value={project.description} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="location">Locație</Label>
                                <Input id="location" name="location" value={project.location} onChange={handleInputChange} required />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Persoane de Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {project.contacts.map((contact, index) => (
                                <div key={index} className="flex space-x-2">
                                    <Input
                                        placeholder="Nume"
                                        value={contact.name}
                                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Telefon"
                                        value={contact.phone}
                                        onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button type="button" onClick={addContact} variant="outline">Adaugă Contact</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resurse Necesare</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="materials">Materiale</Label>
                                <Textarea id="materials" name="materials" value={project.materials} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="people">Oameni</Label>
                                <Textarea id="people" name="people" value={project.people} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="tools">Unelte</Label>
                                <Textarea id="tools" name="tools" value={project.tools} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detalii Financiare și Planificare</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="price">Preț Lucrare (vizibil doar pentru manager)</Label>
                                <Input id="price" name="price" type="number" value={project.price} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label>Data și Ora Începerii</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Asignare Echipe</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select onValueChange={handleTeamChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectează echipa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teams.map((team) => (
                                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="mt-2">
                                Echipe selectate: {project.teams.map((teamId) => teams.find(t => t.id === teamId)?.name).join(', ')}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Încărcare Documente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input id="file" type="file" multiple onChange={handleFileChange} />
                            <div className="mt-2">
                                Fișiere încărcate: {project.files.map(file => file.name).join(', ')}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full" style={{ backgroundColor: "#FAA502", color: "white" }}>Creează Proiect</Button>
                </form>
            </div>
        </DashboardLayout>
    )
}