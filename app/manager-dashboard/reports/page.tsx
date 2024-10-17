"use client"

import { useState } from "react"
import { BarChart, Calendar, Download, LineChart, PieChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart as BarChartComponent, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as LineChartComponent, Line, PieChart as PieChartComponent, Pie, Cell } from "recharts"
import { DashboardLayout } from "@/components/layout"
import { managerLinks } from "../page"

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6']

const performanceData = [
    { name: 'Ian', Rezidențial: 85, Comercial: 78, Industrial: 72 },
    { name: 'Feb', Rezidențial: 88, Comercial: 82, Industrial: 75 },
    { name: 'Mar', Rezidențial: 90, Comercial: 85, Industrial: 80 },
    { name: 'Apr', Rezidențial: 92, Comercial: 87, Industrial: 82 },
    { name: 'Mai', Rezidențial: 95, Comercial: 90, Industrial: 85 },
    { name: 'Iun', Rezidențial: 97, Comercial: 92, Industrial: 88 },
]

const projectStatusData = [
    { name: 'În desfășurare', value: 15 },
    { name: 'Finalizate', value: 30 },
    { name: 'Programate', value: 10 },
    { name: 'În întârziere', value: 2 },
]

const teamPerformanceData = [
    { name: 'Rezidențial', performanță: 92 },
    { name: 'Comercial', performanță: 88 },
    { name: 'Industrial', performanță: 85 },
    { name: 'Sănătate', performanță: 95 },
    { name: 'Eco-Friendly', performanță: 90 },
]

export default function ReportsAndStatistics() {
    const [reportType, setReportType] = useState("performanță")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [team, setTeam] = useState("all")
    const [employee, setEmployee] = useState("all")

    const handleGenerateReport = () => {
        // În practică, aici ar fi logica pentru generarea raportului
        console.log("Generare raport:", { reportType, startDate, endDate, team, employee })
    }

    const handleExportPDF = () => {
        // În practică, aici ar fi logica pentru exportul în PDF
        console.log("Export PDF")
    }

    const handleExportExcel = () => {
        // În practică, aici ar fi logica pentru exportul în Excel
        console.log("Export Excel")
    }

    return (
        <DashboardLayout links={managerLinks} title="Rapoarte și Statistici">
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white">
                                <CardTitle className="text-2xl font-bold">Generare Raport Personalizat</CardTitle>
                                <CardDescription className="text-gray-200">Selectați criteriile pentru generarea raportului</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="report-type">Tip Raport</Label>
                                        <Select value={reportType} onValueChange={setReportType}>
                                            <SelectTrigger id="report-type" className="rounded-full">
                                                <SelectValue placeholder="Selectați tipul de raport" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="performanță">Performanță</SelectItem>
                                                <SelectItem value="proiecte">Proiecte</SelectItem>
                                                <SelectItem value="resurse">Resurse Umane</SelectItem>
                                                <SelectItem value="clienti">Satisfacție Clienți</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="start-date">Data Început</Label>
                                        <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-date">Data Sfârșit</Label>
                                        <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="team">Echipă</Label>
                                        <Select value={team} onValueChange={setTeam}>
                                            <SelectTrigger id="team" className="rounded-full">
                                                <SelectValue placeholder="Selectați echipa" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toate echipele</SelectItem>
                                                <SelectItem value="rezidential">Rezidențial</SelectItem>
                                                <SelectItem value="comercial">Comercial</SelectItem>
                                                <SelectItem value="industrial">Industrial</SelectItem>
                                                <SelectItem value="sanatate">Sănătate</SelectItem>
                                                <SelectItem value="eco">Eco-Friendly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="employee">Angajat</Label>
                                        <Select value={employee} onValueChange={setEmployee}>
                                            <SelectTrigger id="employee" className="rounded-full">
                                                <SelectValue placeholder="Selectați angajatul" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toți angajații</SelectItem>
                                                <SelectItem value="1">Ana Popescu</SelectItem>
                                                <SelectItem value="2">Mihai Ionescu</SelectItem>
                                                <SelectItem value="3">Elena Dumitrescu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap justify-between gap-4">
                                    <Button onClick={handleGenerateReport} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                        Generează Raport
                                    </Button>
                                    <div className="space-x-2">
                                        <Button variant="outline" onClick={handleExportPDF} className="rounded-full">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export PDF
                                        </Button>
                                        <Button variant="outline" onClick={handleExportExcel} className="rounded-full">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export Excel
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                                <CardTitle className="text-2xl font-bold">Vizualizare Statistici</CardTitle>
                                <CardDescription className="text-gray-200">Tendințe și zone de îmbunătățire</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Tabs defaultValue="performance">
                                    <TabsList className="mb-4 bg-gray-100 p-1 rounded-full">
                                        <TabsTrigger value="performance" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow">
                                            <LineChart className="mr-2 h-4 w-4" />
                                            Performanță
                                        </TabsTrigger>
                                        <TabsTrigger value="projects" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow">
                                            <PieChart className="mr-2 h-4 w-4" />
                                            Stare Proiecte
                                        </TabsTrigger>
                                        <TabsTrigger value="teams" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow">
                                            <BarChart className="mr-2 h-4 w-4" />
                                            Performanță Echipe
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="performance">
                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChartComponent data={performanceData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="Rezidențial" stroke="#007AFF" />
                                                    <Line type="monotone" dataKey="Comercial" stroke="#34C759" />
                                                    <Line type="monotone" dataKey="Industrial" stroke="#FF9500" />
                                                </LineChartComponent>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="projects">
                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChartComponent>
                                                    <Pie
                                                        data={projectStatusData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={150}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {projectStatusData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChartComponent>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="teams">
                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChartComponent data={teamPerformanceData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="performanță" fill="#007AFF" />
                                                </BarChartComponent>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}