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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const performanceData = [
    { name: 'Ian', Frontend: 65, Backend: 78, Design: 72 },
    { name: 'Feb', Frontend: 70, Backend: 82, Design: 75 },
    { name: 'Mar', Frontend: 75, Backend: 85, Design: 80 },
    { name: 'Apr', Frontend: 72, Backend: 87, Design: 78 },
    { name: 'Mai', Frontend: 78, Backend: 90, Design: 82 },
    { name: 'Iun', Frontend: 82, Backend: 92, Design: 85 },
]

const projectStatusData = [
    { name: 'În desfășurare', value: 5 },
    { name: 'Finalizate', value: 3 },
    { name: 'În întârziere', value: 2 },
    { name: 'Anulate', value: 1 },
]

const teamPerformanceData = [
    { name: 'Frontend', performanță: 82 },
    { name: 'Backend', performanță: 92 },
    { name: 'Design', performanță: 85 },
    { name: 'QA', performanță: 88 },
    { name: 'Management', performanță: 90 },
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
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Rapoarte și Statistici</h1>

                        <Card>
                            <CardHeader>
                                <CardTitle>Generare Raport Personalizat</CardTitle>
                                <CardDescription>Selectați criteriile pentru generarea raportului</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="report-type">Tip Raport</Label>
                                        <Select value={reportType} onValueChange={setReportType}>
                                            <SelectTrigger id="report-type">
                                                <SelectValue placeholder="Selectați tipul de raport" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="performanță">Performanță</SelectItem>
                                                <SelectItem value="proiecte">Proiecte</SelectItem>
                                                <SelectItem value="resurse">Resurse Umane</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="start-date">Data Început</Label>
                                        <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-date">Data Sfârșit</Label>
                                        <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="team">Echipă</Label>
                                        <Select value={team} onValueChange={setTeam}>
                                            <SelectTrigger id="team">
                                                <SelectValue placeholder="Selectați echipa" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toate echipele</SelectItem>
                                                <SelectItem value="frontend">Frontend</SelectItem>
                                                <SelectItem value="backend">Backend</SelectItem>
                                                <SelectItem value="design">Design</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="employee">Angajat</Label>
                                        <Select value={employee} onValueChange={setEmployee}>
                                            <SelectTrigger id="employee">
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
                                <div className="mt-6 flex justify-between">
                                    <Button onClick={handleGenerateReport} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                        Generează Raport
                                    </Button>
                                    <div className="space-x-2">
                                        <Button variant="outline" onClick={handleExportPDF}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Export PDF
                                        </Button>
                                        <Button variant="outline" onClick={handleExportExcel}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Export Excel
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Vizualizare Statistici</CardTitle>
                                <CardDescription>Tendințe și zone de îmbunătățire</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="performance">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="performance">
                                            <LineChart className="mr-2 h-4 w-4" />
                                            Performanță
                                        </TabsTrigger>
                                        <TabsTrigger value="projects">
                                            <PieChart className="mr-2 h-4 w-4" />
                                            Stare Proiecte
                                        </TabsTrigger>
                                        <TabsTrigger value="teams">
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
                                                    <Line type="monotone" dataKey="Frontend" stroke="#8884d8" />
                                                    <Line type="monotone" dataKey="Backend" stroke="#82ca9d" />
                                                    <Line type="monotone" dataKey="Design" stroke="#ffc658" />
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
                                                    <Bar dataKey="performanță" fill="#8884d8" />
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