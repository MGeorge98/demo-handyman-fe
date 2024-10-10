"use client"

import { useState } from "react"
import { Calendar, Clock, Download, Send, User } from "lucide-react"

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
    { id: 1, name: "Ana Popescu", role: "Developer", status: "Absent" },
    { id: 2, name: "Mihai Ionescu", role: "Designer", status: "Prezent" },
    { id: 3, name: "Elena Dumitrescu", role: "Manager", status: "Absent" },
    { id: 4, name: "Alexandru Popa", role: "Developer", status: "Prezent" },
    { id: 5, name: "Maria Stancu", role: "Tester", status: "Absent" },
]

const attendanceHistory = [
    { id: 1, employeeId: 1, date: "2023-07-10", checkIn: "09:00", checkOut: "17:30" },
    { id: 2, employeeId: 2, date: "2023-07-10", checkIn: "08:45", checkOut: "18:00" },
    { id: 3, employeeId: 4, date: "2023-07-10", checkIn: "09:15", checkOut: "17:45" },
    { id: 4, employeeId: 1, date: "2023-07-11", checkIn: "08:55", checkOut: "17:25" },
    { id: 5, employeeId: 2, date: "2023-07-11", checkIn: "08:50", checkOut: "18:10" },
]

export default function EmployeeTimeTracking() {
    const [employeeList, setEmployeeList] = useState(employees)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedEmployee, setSelectedEmployee] = useState("all")
    const [reportPeriod, setReportPeriod] = useState({ start: "", end: "" })

    const handleCheckInOut = (employeeId) => {
        setEmployeeList(employeeList.map(emp => {
            if (emp.id === employeeId) {
                const newStatus = emp.status === "Absent" ? "Prezent" : "Absent"
                const action = newStatus === "Prezent" ? "Pontare" : "Depontare"
                toast({
                    title: `${action} reușită`,
                    description: `${emp.name} a fost ${action.toLowerCase()} cu succes.`,
                })
                return { ...emp, status: newStatus }
            }
            return emp
        }))
    }

    const filteredHistory = attendanceHistory.filter(entry =>
        (selectedEmployee === "all" || entry.employeeId === parseInt(selectedEmployee)) &&
        entry.date === selectedDate
    )

    const handleGenerateReport = () => {
        // În practică, aici ar fi logica pentru generarea și trimiterea raportului
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Pontaj Zilnic</CardTitle>
                                <CardDescription>Înregistrați prezența angajaților pentru ziua curentă</CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                                <TableCell>{employee.name}</TableCell>
                                                <TableCell>{employee.role}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={employee.status === "Prezent" ? "success" : "secondary"}
                                                    >
                                                        {employee.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => handleCheckInOut(employee.id)}
                                                        variant={employee.status === "Absent" ? "default" : "secondary"}
                                                    >
                                                        {employee.status === "Absent" ? "Check-in" : "Check-out"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Istoric Pontaje</CardTitle>
                                <CardDescription>Vizualizați istoricul pontajelor pentru angajați</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4 mb-4">
                                    <div className="flex-1">
                                        <Label htmlFor="date-select">Data</Label>
                                        <Input
                                            id="date-select"
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="employee-select">Angajat</Label>
                                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                            <SelectTrigger id="employee-select">
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
                                <ScrollArea className="h-[300px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nume</TableHead>
                                                <TableHead>Data</TableHead>
                                                <TableHead>Check-in</TableHead>
                                                <TableHead>Check-out</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredHistory.map((entry) => (
                                                <TableRow key={entry.id}>
                                                    <TableCell>{employeeList.find(emp => emp.id === entry.employeeId)?.name}</TableCell>
                                                    <TableCell>{entry.date}</TableCell>
                                                    <TableCell>{entry.checkIn}</TableCell>
                                                    <TableCell>{entry.checkOut}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Raportare Ore Lucrate</CardTitle>
                                <CardDescription>Generați și trimiteți rapoarte către manager</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4 mb-4">
                                    <div className="flex-1">
                                        <Label htmlFor="start-date">Data Început</Label>
                                        <Input
                                            id="start-date"
                                            type="date"
                                            value={reportPeriod.start}
                                            onChange={(e) => setReportPeriod({ ...reportPeriod, start: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="end-date">Data Sfârșit</Label>
                                        <Input
                                            id="end-date"
                                            type="date"
                                            value={reportPeriod.end}
                                            onChange={(e) => setReportPeriod({ ...reportPeriod, end: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleGenerateReport} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                    <Send className="mr-2 h-4 w-4" /> Generează și Trimite Raport
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}