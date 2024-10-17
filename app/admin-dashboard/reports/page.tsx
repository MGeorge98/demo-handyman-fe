"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Download, FileSpreadsheet, FileText, PieChart, Plus } from "lucide-react"
import { format } from "date-fns"
import { ro } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
    { id: 3, name: "Raport Proiect - Curățenie Centru Comercial", type: "Proiect", date: "2023-07-03", status: "În așteptare" },
    { id: 4, name: "Raport Echipă - Curățenie Comercială", type: "Echipă", date: "2023-07-04", status: "Generat" },
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
    const [newReport, setNewReport] = useState({ name: "", type: "", startDate: new Date(), endDate: new Date() })
    const [scheduleConfig, setScheduleConfig] = useState({ type: "", day: "", time: "" })

    const handleGenerateReport = () => {
        if (!newReport.name || !newReport.type || !newReport.startDate || !newReport.endDate) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să completați toate câmpurile pentru generarea raportului.",
                variant: "destructive",
            })
            return
        }

        const newReportEntry = {
            id: reports.length + 1,
            name: newReport.name,
            type: newReport.type,
            date: format(new Date(), "yyyy-MM-dd"),
            status: "În așteptare"
        }
        setReports([...reports, newReportEntry])
        setIsGenerateDialogOpen(false)
        setNewReport({ name: "", type: "", startDate: new Date(), endDate: new Date() })
        toast({
            title: "Raport programat pentru generare",
            description: `Raportul "${newReport.name}" a fost adăugat în lista de generare.`,
        })
    }

    const handleScheduleReport = () => {
        if (!scheduleConfig.type || !scheduleConfig.day || !scheduleConfig.time) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să completați toate câmpurile pentru programarea raportului.",
                variant: "destructive",
            })
            return
        }

        setIsScheduleDialogOpen(false)
        setScheduleConfig({ type: "", day: "", time: "" })
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
        <DashboardLayout links={adminLinks} title="Vizualizare si Export Rapoarte">
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-7xl space-y-8">


                        <Card className="bg-white shadow-lg border-none rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                        <div className="flex justify-between items-center">
                                    <div>

                                        <CardTitle className="text-2xl font-bold">Rapoarte Generate</CardTitle>
                                        <CardDescription className="text-gray-200">Vizualizați și exportați rapoartele generate</CardDescription>
                                    </div>
                                    <Button
                                        onClick={() => setIsGenerateDialogOpen(true)}
                                        className="bg-white text-blue-600 hover:bg-blue-50 rounded-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Generează Raport Nou
                                    </Button>
                                </div>

                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex justify-between mb-6">
                                    <Button onClick={() => setIsScheduleDialogOpen(true)} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-full px-6 py-2 text-sm font-medium">
                                        <CalendarIcon className="mr-2 h-4 w-4" /> Programează Raport
                                    </Button>
                                </div>
                                <ScrollArea className="h-[400px] rounded-lg border border-gray-200">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="text-gray-600 font-medium">Nume Raport</TableHead>
                                                <TableHead className="text-gray-600 font-medium">Tip</TableHead>
                                                <TableHead className="text-gray-600 font-medium">Data Generării</TableHead>
                                                <TableHead className="text-gray-600 font-medium">Status</TableHead>
                                                <TableHead className="text-gray-600 font-medium">Acțiuni</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.map((report) => (
                                                <TableRow key={report.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <TableCell className="font-medium text-gray-900">{report.name}</TableCell>
                                                    <TableCell className="text-gray-600">{report.type}</TableCell>
                                                    <TableCell className="text-gray-600">{report.date}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={report.status === "Generat" ? "default" : "secondary"}
                                                            className={`${report.status === "Generat"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                                } rounded-full px-2 py-1 text-xs font-medium`}
                                                        >
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
                                                                className="text-blue-600 border-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-full px-3 py-1 text-xs font-medium"
                                                            >
                                                                <FileText className="h-4 w-4 mr-1" /> PDF
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleExportReport(report.id, 'Excel')}
                                                                disabled={report.status !== "Generat"}
                                                                className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50 rounded-full px-3 py-1 text-xs font-medium"
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
                    <DialogContent className="bg-white rounded-2xl p-6 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-900">Generează Raport Nou</DialogTitle>
                            <DialogDescription className="text-gray-500 mt-2">Completați detaliile pentru noul raport</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="report-name" className="text-sm font-medium text-gray-700">
                                    Nume Raport
                                </Label>
                                <Input
                                    id="report-name"
                                    value={newReport.name}
                                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                                    className="rounded-lg border-gray-300"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="report-type" className="text-sm font-medium text-gray-700">
                                    Tip Raport
                                </Label>
                                <Select
                                    value={newReport.type}
                                    onValueChange={(value) => setNewReport({ ...newReport, type: value })}
                                >
                                    <SelectTrigger className="rounded-lg border-gray-300">
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
                            <div className="grid gap-2">
                                <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">
                                    Data Început
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`rounded-lg border-gray-300 text-left font-normal ${!newReport.startDate && "text-gray-400"
                                                }`}
                                        >
                                            {newReport.startDate ? (
                                                format(newReport.startDate, "PPP", { locale: ro })
                                            ) : (
                                                <span>Alege o dată</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={newReport.startDate}
                                            onSelect={(date) => setNewReport({ ...newReport, startDate: date })}
                                            locale={ro}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date" className="text-sm font-medium text-gray-700">
                                    Data Sfârșit
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`rounded-lg border-gray-300 text-left font-normal ${!newReport.endDate && "text-gray-400"
                                                }`}
                                        >
                                            {newReport.endDate ? (
                                                format(newReport.endDate, "PPP", { locale: ro })
                                            ) : (
                                                <span>Alege o dată</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={newReport.endDate}
                                            onSelect={(date) => setNewReport({ ...newReport, endDate: date })}
                                            locale={ro}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleGenerateReport} className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-full px-6 py-2 text-sm font-medium">Generează Raport</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                    <DialogContent className="bg-white rounded-2xl p-6 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-900">Programează Generare Automată Rapoarte</DialogTitle>
                            <DialogDescription className="text-gray-500 mt-2">Setați programul pentru generarea automată a rapoartelor</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="schedule-type" className="text-sm font-medium text-gray-700">
                                    Tip Raport
                                </Label>
                                <Select
                                    value={scheduleConfig.type}
                                    onValueChange={(value) => setScheduleConfig({ ...scheduleConfig, type: value })}
                                >
                                    <SelectTrigger className="rounded-lg border-gray-300">
                                        <SelectValue placeholder="Selectează tipul de raport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Săptămânal">Săptămânal</SelectItem>
                                        <SelectItem value="Lunar">Lunar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="schedule-day" className="text-sm font-medium text-gray-700">
                                    {scheduleConfig.type === "Săptămânal" ? "Zi a Săptămânii" : "Zi a Lunii"}
                                </Label>
                                <Select
                                    value={scheduleConfig.day}
                                    onValueChange={(value) => setScheduleConfig({ ...scheduleConfig, day: value })}
                                >
                                    <SelectTrigger className="rounded-lg border-gray-300">
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
                            <div className="grid gap-2">
                                <Label htmlFor="schedule-time" className="text-sm font-medium text-gray-700">
                                    Ora
                                </Label>
                                <Input
                                    id="schedule-time"
                                    type="time"
                                    value={scheduleConfig.time}
                                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, time: e.target.value })}
                                    className="rounded-lg border-gray-300"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleScheduleReport} className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-full px-6 py-2 text-sm font-medium">Programează Raport</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}