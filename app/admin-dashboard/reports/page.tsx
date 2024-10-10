"use client"

import { useState } from "react"
import { Calendar, Download, FileSpreadsheet, FileText, PieChart, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { adminLinks } from "../page"

const initialReports = [
    { id: 1, name: "Raport Lunar - Iunie 2023", type: "Lunar", date: "2023-07-01", status: "Generat" },
    { id: 2, name: "Raport Săptămânal - Săptămâna 26", type: "Săptămânal", date: "2023-07-02", status: "Generat" },
    { id: 3, name: "Raport Proiect - Renovare Centru Comercial", type: "Proiect", date: "2023-07-03", status: "În așteptare" },
    { id: 4, name: "Raport Echipă - Construcții", type: "Echipă", date: "2023-07-04", status: "Generat" },
    { id: 5, name: "Raport Angajat - Ana Popescu", type: "Angajat", date: "2023-07-05", status: "În așteptare" },
]

const globalStats = {
    totalProjects: 15,
    activeProjects: 8,
    completedProjects: 7,
    totalEmployees: 150,
    totalHoursWorked: 12500,
    totalResourcesCost: 1500000,
}

export default function ReportViewingExport() {
    const [reports, setReports] = useState(initialReports)
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
    const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
    const [newReport, setNewReport] = useState({ name: "", type: "", startDate: "", endDate: "" })
    const [scheduleConfig, setScheduleConfig] = useState({ type: "", day: "", time: "" })

    const handleGenerateReport = () => {
        const newReportEntry = {
            id: reports.length + 1,
            ...newReport,
            date: new Date().toISOString().split('T')[0],
            status: "În așteptare"
        }
        setReports([...reports, newReportEntry])
        setIsGenerateDialogOpen(false)
        toast({
            title: "Raport programat pentru generare",
            description: `Raportul "${newReport.name}" a fost adăugat în lista de generare.`,
        })
    }

    const handleScheduleReport = () => {
        setIsScheduleDialogOpen(false)
        toast({
            title: "Raport programat",
            description: `Raportul ${scheduleConfig.type} va fi generat automat ${scheduleConfig.type === "Săptămânal" ? "în fiecare " + scheduleConfig.day : "în ziua " + scheduleConfig.day} la ora ${scheduleConfig.time}.`,
        })
    }

    const handleExportReport = (reportId, format) => {
        const report = reports.find(r => r.id === reportId)
        toast({
            title: "Raport exportat",
            description: `Raportul "${report.name}" a fost exportat în format ${format}.`,
        })
    }

    return (
        <DashboardLayout links={adminLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Vizualizare și Export Rapoarte</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Proiecte Totale</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{globalStats.totalProjects}</div>
                                    <p className="text-sm text-muted-foreground">
                                        Active: {globalStats.activeProjects} | Finalizate: {globalStats.completedProjects}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Angajați Totali</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{globalStats.totalEmployees}</div>
                                    <p className="text-sm text-muted-foreground">
                                        Ore lucrate: {globalStats.totalHoursWorked}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cost Total Resurse</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{globalStats.totalResourcesCost.toLocaleString()} RON</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Rapoarte Generate</CardTitle>
                                <CardDescription>Vizualizați și exportați rapoartele generate</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between mb-4">
                                    <Button onClick={() => setIsGenerateDialogOpen(true)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                        <Plus className="mr-2 h-4 w-4" /> Generează Raport Nou
                                    </Button>
                                    <Button onClick={() => setIsScheduleDialogOpen(true)} variant="outline">
                                        <Calendar className="mr-2 h-4 w-4" /> Programează Raport
                                    </Button>
                                </div>
                                <ScrollArea className="h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nume Raport</TableHead>
                                                <TableHead>Tip</TableHead>
                                                <TableHead>Data Generării</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Acțiuni</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.map((report) => (
                                                <TableRow key={report.id}>
                                                    <TableCell>{report.name}</TableCell>
                                                    <TableCell>{report.type}</TableCell>
                                                    <TableCell>{report.date}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={report.status === "Generat" ? "default" : "secondary"}>
                                                            {report.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleExportReport(report.id, 'PDF')}
                                                                disabled={report.status !== "Generat"}
                                                            >
                                                                <FileText className="h-4 w-4 mr-1" /> PDF
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleExportReport(report.id, 'Excel')}
                                                                disabled={report.status !== "Generat"}
                                                            >
                                                                <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generează Raport Nou</DialogTitle>
                            <DialogDescription>Completați detaliile pentru noul raport</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="report-name" className="text-right">
                                    Nume Raport
                                </Label>
                                <Input
                                    id="report-name"
                                    value={newReport.name}
                                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="report-type" className="text-right">
                                    Tip Raport
                                </Label>
                                <Select
                                    value={newReport.type}
                                    onValueChange={(value) => setNewReport({ ...newReport, type: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selectează tipul de raport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lunar">Lunar</SelectItem>
                                        <SelectItem value="Săptămânal">Săptămânal</SelectItem>
                                        <SelectItem value="Proiect">Proiect</SelectItem>
                                        <SelectItem value="Echipă">Echipă</SelectItem>
                                        <SelectItem value="Angajat">Angajat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="start-date" className="text-right">
                                    Data Început
                                </Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={newReport.startDate}
                                    onChange={(e) => setNewReport({ ...newReport, startDate: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="end-date" className="text-right">
                                    Data Sfârșit
                                </Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={newReport.endDate}
                                    onChange={(e) => setNewReport({ ...newReport, endDate: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleGenerateReport}>Generează Raport</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Programează Generare Automată Rapoarte</DialogTitle>
                            <DialogDescription>Setați programul pentru generarea automată a rapoartelor</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="schedule-type" className="text-right">
                                    Tip Raport
                                </Label>
                                <Select
                                    value={scheduleConfig.type}
                                    onValueChange={(value) => setScheduleConfig({ ...scheduleConfig, type: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selectează tipul de raport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Săptămânal">Săptămânal</SelectItem>
                                        <SelectItem value="Lunar">Lunar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="schedule-day" className="text-right">
                                    {scheduleConfig.type === "Săptămânal" ? "Zi a Săptămânii" : "Zi a Lunii"}
                                </Label>
                                <Select
                                    value={scheduleConfig.day}
                                    onValueChange={(value) => setScheduleConfig({ ...scheduleConfig, day: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selectează ziua" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {scheduleConfig.type === "Săptămânal"
                                            ? ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"].map(day => (
                                                <SelectItem key={day} value={day}>{day}</SelectItem>
                                            ))
                                            : Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                                <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="schedule-time" className="text-right">
                                    Ora
                                </Label>
                                <Input
                                    id="schedule-time"
                                    type="time"
                                    value={scheduleConfig.time}
                                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, time: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleScheduleReport}>Programează Raport</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}