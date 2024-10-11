"use client"

import { useState } from "react"
import { Calendar, Clock, Download, Send, User, CheckCircle, XCircle } from "lucide-react"

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
import { coordinatorLinks } from "../page"

const employees = [
    { id: 1, name: "Ana Popescu", role: "Curățător General", status: "Absent" },
    { id: 2, name: "Mihai Ionescu", role: "Specialist Curățenie Industrială", status: "Prezent" },
    { id: 3, name: "Elena Dumitrescu", role: "Supervizor Echipă", status: "Absent" },
    { id: 4, name: "Alexandru Popa", role: "Specialist Curățenie Geamuri", status: "Prezent" },
    { id: 5, name: "Maria Stancu", role: "Curățător Covoare", status: "Absent" },
]

const initialAttendanceHistory = [
    { id: 1, employeeId: 1, date: "2024-03-10", checkIn: "07:30", checkOut: "16:00", totalHours: 8.5, project: "Curățenie Birouri A" },
    { id: 2, employeeId: 2, date: "2024-03-10", checkIn: "08:00", checkOut: "17:30", totalHours: 9.5, project: "Curățenie Industrială C" },
    { id: 3, employeeId: 4, date: "2024-03-10", checkIn: "07:45", checkOut: "16:15", totalHours: 8.5, project: "Curățenie Rezidențială B" },
    { id: 4, employeeId: 1, date: "2024-03-11", checkIn: "07:25", checkOut: "15:55", totalHours: 8.5, project: "Curățenie Birouri A" },
    { id: 5, employeeId: 2, date: "2024-03-11", checkIn: "07:50", checkOut: "17:20", totalHours: 9.5, project: "Curățenie Industrială C" },
]

export default function EmployeeTimeTracking() {
    const [employeeList, setEmployeeList] = useState(employees)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedEmployee, setSelectedEmployee] = useState("all")
    const [reportPeriod, setReportPeriod] = useState({ start: "", end: "" })
    const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false)
    const [checkInDetails, setCheckInDetails] = useState({ employeeId: null, project: "", notes: "" })
    const [attendanceHistory, setAttendanceHistory] = useState(initialAttendanceHistory)

    const handleCheckInOut = (employeeId) => {
        const employee = employeeList.find(emp => emp.id === employeeId)
        if (employee.status === "Absent") {
            setCheckInDetails({ employeeId, project: "", notes: "" })
            setIsCheckInDialogOpen(true)
        } else {
            completeCheckInOut(employeeId, "Absent")
        }
    }

    const completeCheckInOut = (employeeId, newStatus, project = "", notes = "") => {
        setEmployeeList(employeeList.map(emp => {
            if (emp.id === employeeId) {
                const action = newStatus === "Prezent" ? "Pontare" : "Depontare"
                toast({
                    title: `${action} reușită`,
                    description: `${emp.name} a fost ${action.toLowerCase()} cu succes.`,
                })
                return { ...emp, status: newStatus }
            }
            return emp
        }))

        if (newStatus === "Prezent") {
            const newEntry = {
                id: attendanceHistory.length + 1,
                employeeId,
                date: new Date().toISOString().split('T')[0],
                checkIn: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
                checkOut: "",
                totalHours: 0,
                project,
                notes
            }
            setAttendanceHistory([...attendanceHistory, newEntry])
        } else {
            setAttendanceHistory(attendanceHistory.map(entry => {
                if (entry.employeeId === employeeId && entry.checkOut === "") {
                    const checkOut = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
                    const totalHours = calculateTotalHours(entry.checkIn, checkOut)
                    return { ...entry, checkOut, totalHours }
                }
                return entry
            }))
        }

        setIsCheckInDialogOpen(false)
    }

    const calculateTotalHours = (checkIn, checkOut) => {
        const [inHours, inMinutes] = checkIn.split(':').map(Number)
        const [outHours, outMinutes] = checkOut.split(':').map(Number)
        const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes)
        return Math.round((totalMinutes / 60) * 10) / 10 // Round to 1 decimal place
    }


    const filteredHistory = attendanceHistory.filter(entry =>
        (selectedEmployee === "all" || entry.employeeId === parseInt(selectedEmployee)) &&
        entry.date === selectedDate
    )

    const handleGenerateReport = () => {
        if (!reportPeriod.start || !reportPeriod.end) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să selectați o perioadă validă pentru raport.",
                variant: "destructive",
            })
            return
        }

        const reportData = attendanceHistory.filter(entry =>
            entry.date >= reportPeriod.start && entry.date <= reportPeriod.end
        )

        if (reportData.length === 0) {
            toast({
                title: "Nicio înregistrare găsită",
                description: "Nu există date de pontaj pentru perioada selectată.",
                variant: "warning",
            })
            return
        }

        // În practică, aici ar fi logica pentru generarea și trimiterea raportului
        console.log("Generating report for:", reportData)

        toast({
            title: "Raport generat",
            description: `Raportul pentru perioada ${reportPeriod.start} - ${reportPeriod.end} a fost trimis managerului.`,
        })
    }

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Pontaj Angajați</h1>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Pontaj Zilnic</CardTitle>
                                <CardDescription className="text-gray-300">Înregistrați prezența angajaților pentru ziua curentă</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nume</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Acțiuni</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {employeeList.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell className="font-medium">{employee.name}</TableCell>
                                                <TableCell>{employee.role}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={employee.status === "Prezent" ? "success" : "secondary"}
                                                        className="rounded-full"
                                                    >
                                                        {employee.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => handleCheckInOut(employee.id)}
                                                        variant={employee.status === "Absent" ? "default" : "secondary"}
                                                        className="rounded-md"
                                                    >
                                                        {employee.status === "Absent" ? (
                                                            <>
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Check-in
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Check-out
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Istoric Pontaje</CardTitle>
                                <CardDescription className="text-gray-300">Vizualizați istoricul pontajelor pentru angajați</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex space-x-4 mb-4">
                                    <div className="flex-1">
                                        <Label htmlFor="date-select">Data</Label>
                                        <Input
                                            id="date-select"
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="employee-select">Angajat</Label>
                                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                            <SelectTrigger id="employee-select" className="rounded-md">
                                                <SelectValue placeholder="Selectați angajatul" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toți angajații</SelectItem>
                                                {employeeList.map((emp) => (
                                                    <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <ScrollArea className="h-[300px] rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nume</TableHead>
                                                <TableHead>Data</TableHead>
                                                <TableHead>Check-in</TableHead>
                                                <TableHead>Check-out</TableHead>
                                                <TableHead>Total Ore</TableHead>
                                                <TableHead>Proiect</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredHistory.map((entry) => (
                                                <TableRow key={entry.id}>
                                                    <TableCell className="font-medium">{employeeList.find(emp => emp.id === entry.employeeId)?.name}</TableCell>
                                                    <TableCell>{entry.date}</TableCell>
                                                    <TableCell>{entry.checkIn}</TableCell>
                                                    <TableCell>{entry.checkOut || "În lucru"}</TableCell>
                                                    <TableCell>{entry.totalHours || "-"}</TableCell>
                                                    <TableCell>{entry.project}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Raportare Ore Lucrate</CardTitle>
                                <CardDescription className="text-gray-300">Generați și trimiteți rapoarte către manager</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex space-x-4 mb-4">
                                    <div className="flex-1">
                                        <Label htmlFor="start-date">Data Început</Label>
                                        <Input
                                            id="start-date"
                                            type="date"
                                            value={reportPeriod.start}
                                            onChange={(e) => setReportPeriod({ ...reportPeriod, start: e.target.value })}
                                            className="rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="end-date">Data Sfârșit</Label>
                                        <Input
                                            id="end-date"
                                            type="date"
                                            value={reportPeriod.end}
                                            onChange={(e) => setReportPeriod({ ...reportPeriod,   end: e.target.value })}
                                            className="rounded-md"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 rounded-b-lg">
                                <Button onClick={handleGenerateReport} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                    <Send className="mr-2 h-4 w-4" /> Generează și Trimite Raport
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>

                <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] rounded-lg">
                        <DialogHeader>
                            <DialogTitle>Check-in Angajat</DialogTitle>
                            <DialogDescription>
                                Introduceți detaliile pentru pontajul angajatului
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="project" className="text-right">
                                    Proiect
                                </Label>
                                <Select
                                    value={checkInDetails.project}
                                    onValueChange={(value) => setCheckInDetails({ ...checkInDetails, project: value })}
                                >
                                    <SelectTrigger className="col-span-3 rounded-md">
                                        <SelectValue placeholder="Selectați proiectul" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Curățenie Birouri A">Curățenie Birouri A</SelectItem>
                                        <SelectItem value="Curățenie Rezidențială B">Curățenie Rezidențială B</SelectItem>
                                        <SelectItem value="Curățenie Industrială C">Curățenie Industrială C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">
                                    Note
                                </Label>
                                <Input
                                    id="notes"
                                    value={checkInDetails.notes}
                                    onChange={(e) => setCheckInDetails({ ...checkInDetails, notes: e.target.value })}
                                    className="col-span-3 rounded-md"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => completeCheckInOut(checkInDetails.employeeId, "Prezent", checkInDetails.project, checkInDetails.notes)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                Confirmă Check-in
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}