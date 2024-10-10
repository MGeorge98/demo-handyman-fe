"use client"

import { useState } from "react"
import { Building, Calendar, MapPin, Phone, Wrench, User, Mail } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { coordinatorLinks } from "../page"
import { DashboardLayout } from "@/components/layout"

const projectData = {
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
    ]
}

export default function ProjectDetails() {
    const [changeProposal, setChangeProposal] = useState("")

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

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-[#0A2747]">{projectData.name}</h1>
                            <Badge variant={projectData.status === "În desfășurare" ? "default" : "secondary"}>
                                {projectData.status}
                            </Badge>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Detalii Proiect</CardTitle>
                                <CardDescription>Informații generale despre proiect</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-[#0A2747]" />
                                        <span>Data început: {projectData.startDate}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-[#0A2747]" />
                                        <span>Data finalizare: {projectData.endDate}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5 text-[#0A2747]" />
                                        <span>Locație: {projectData.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-5 w-5 text-[#0A2747]" />
                                        <span>Tip: Renovare</span>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="mb-2 font-semibold">Descriere:</h3>
                                    <p>{projectData.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="tasks">
                            <TabsList>
                                <TabsTrigger value="tasks">Sarcini</TabsTrigger>
                                <TabsTrigger value="contacts">Contacte Client</TabsTrigger>
                                <TabsTrigger value="materials">Materiale și Unelte</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tasks">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sarcini Proiect</CardTitle>
                                        <CardDescription>Lista sarcinilor și statusul lor</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[300px]">
                                            {projectData.tasks.map((task) => (
                                                <div key={task.id} className="mb-4 flex items-center justify-between">
                                                    <span>{task.name}</span>
                                                    <Badge variant={task.status === "Finalizat" ? "success" : task.status === "În desfășurare" ? "default" : "secondary"}>
                                                        {task.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="contacts">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contacte Client</CardTitle>
                                        <CardDescription>Persoane de contact pentru acest proiect</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {projectData.clientContacts.map((contact, index) => (
                                            <div key={index} className="mb-4 space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-5 w-5 text-[#0A2747]" />
                                                    <span className="font-semibold">{contact.name}</span>
                                                </div>
                                                <div className="ml-7 space-y-1">
                                                    <p>{contact.role}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="h-4 w-4 text-[#0A2747]" />
                                                        <span>{contact.phone}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="h-4 w-4 text-[#0A2747]" />
                                                        <span>{contact.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="materials">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Materiale și Unelte</CardTitle>
                                        <CardDescription>Necesarul de materiale și unelte pentru proiect</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="mb-2 font-semibold">Materiale:</h3>
                                                <ul className="list-inside list-disc space-y-1">
                                                    {projectData.materials.map((material, index) => (
                                                        <li key={index}>{material.name} - {material.quantity}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h3 className="mb-2 font-semibold">Unelte:</h3>
                                                <ul className="list-inside list-disc space-y-1">
                                                    {projectData.tools.map((tool, index) => (
                                                        <li key={index}>{tool}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card>
                            <CardHeader>
                                <CardTitle>Propune Modificări</CardTitle>
                                <CardDescription>Trimite o propunere de modificare către manager</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Descrieți modificarea propusă..."
                                    value={changeProposal}
                                    onChange={(e) => setChangeProposal(e.target.value)}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleProposeChange} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                    Trimite Propunerea
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}