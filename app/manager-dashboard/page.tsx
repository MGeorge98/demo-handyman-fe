"use client"

import React, { useState } from 'react'
import { Bell, Plus, BarChart2, Users, Clock, DollarSign, Search, X, Home, Settings, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DashboardLayout } from '@/components/layout'
import { toast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

export const managerLinks = [
  { href: "/manager-dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
  { href: "/manager-dashboard/clients", label: "Clienți", icon: <Users className="h-4 w-4" /> },
  // { href: "/manager-dashboard/create-project", label: "Proiecte ", icon: <Plus className="h-4 w-4" /> },
  { href: "/manager-dashboard/program", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
  { href: "/manager-dashboard/active-projects", label: "Proiecte", icon: <BarChart2 className="h-4 w-4" /> },
  { href: "/manager-dashboard/employees", label: "Gestionare Angajați", icon: <Users className="h-4 w-4" /> },
  { href: "/manager-dashboard/reports", label: "Rapoarte și Statistici", icon: <FileText className="h-4 w-4" /> },
  { href: "/manager-dashboard/settings", label: "Setări", icon: <Settings className="h-4 w-4" /> },
]

export default function ManagerDashboard() {
  const [jobFilter, setJobFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState('')
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    client: '',
    startDate: '',
    endDate: '',
    assignedTeam: '',
  })
  const router = useRouter();

  const jobs = [
    { name: "Curățenie Birouri A", progress: 75, time: 120, cost: 3000, profit: 15 },
    { name: "Curățenie Rezidențială B", progress: 50, time: 80, cost: 2000, profit: 10 },
    { name: "Curățenie Industrială C", progress: 25, time: 200, cost: 5000, profit: -5 },
  ]

  const teams = [
    { name: "Echipa Alpha", members: 4, completedProjects: 5, totalTime: 450, efficiency: 95 },
    { name: "Echipa Beta", members: 3, completedProjects: 3, totalTime: 320, efficiency: 85 },
  ]

  const employees = [
    { name: "Ana Popescu", role: "Coordonator", projects: 8, hoursWorked: 160, performance: "Excelentă" },
    { name: "Ion Ionescu", role: "Tehnician", projects: 6, hoursWorked: 140, performance: "Bună" },
  ]

  const filteredJobs = jobs.filter(job => job.name.toLowerCase().includes(jobFilter.toLowerCase()))
  const filteredTeams = teams.filter(team => team.name.toLowerCase().includes(teamFilter.toLowerCase()))
  const filteredEmployees = employees.filter(employee => employee.name.toLowerCase().includes(employeeFilter.toLowerCase()))


  return (
    <DashboardLayout links={managerLinks}>
      <div className="min-h-screen bg-[#F4F7FA]">
        <main className="container mx-auto p-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-[#0A2747]">Bun venit, Manager!</h2>
            <Button
              className="bg-[#FAA502] hover:bg-[#E69500] text-white"
              onClick={() => { router.push("/manager-dashboard/create-project") }}
            >
              <Plus className="mr-2 h-4 w-4" /> Proiect Nou
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white shadow-md border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#0A2747]">Proiecte Active</CardTitle>
                <BarChart2 className="h-4 w-4 text-[#FAA502]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0A2747]">12</div>
                <p className="text-xs text-[#0A2747] opacity-70">+2 față de luna trecută</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#0A2747]">Echipe Active</CardTitle>
                <Users className="h-4 w-4 text-[#FAA502]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0A2747]">8</div>
                <p className="text-xs text-[#0A2747] opacity-70">+1 față de luna trecută</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#0A2747]">Ore Lucrate</CardTitle>
                <Clock className="h-4 w-4 text-[#FAA502]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0A2747]">1,234</div>
                <p className="text-xs text-[#0A2747] opacity-70">+10% față de luna trecută</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#0A2747]">Venit Total</CardTitle>
                <DollarSign className="h-4 w-4 text-[#FAA502]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0A2747]">$45,231.89</div>
                <p className="text-xs text-[#0A2747] opacity-70">+20.1% față de luna trecută</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-md border-none">
              <CardHeader>
                <CardTitle className="text-[#0A2747]">Proiecte în Desfășurare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-[#0A2647] rounded-md flex items-center justify-center text-white">
                  Grafic Proiecte în Desfășurare
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border-none">
              <CardHeader>
                <CardTitle className="text-[#0A2747]">Proiecte Viitoare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-[#0A2647] rounded-md flex items-center justify-center text-white">
                  Grafic Proiecte Viitoare
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="jobs" className="space-y-4">
            <TabsList className="bg-[#0A2747] text-white">
              <TabsTrigger value="jobs" className="data-[state=active]:bg-[#FAA502]">Lucrări</TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-[#FAA502]">Echipe</TabsTrigger>
              <TabsTrigger value="employees" className="data-[state=active]:bg-[#FAA502]">Angajați</TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
              <Card className="bg-white shadow-md border-none">
                <CardHeader>
                  <CardTitle className="text-[#0A2747]">Statistici per Lucrare</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-[#0A2747]" />
                    <Input
                      placeholder="Caută lucrări..."
                      value={jobFilter}
                      onChange={(e) => setJobFilter(e.target.value)}
                      className="max-w-sm border-[#0A2747]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {filteredJobs.map((job, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-[#0A2747]">{job.name}</h4>
                          <span className="text-sm text-[#0A2747] opacity-70">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-[#0A2747] opacity-70 mt-1">
                          <span>Timp lucrat: {job.time} ore</span>
                          <span>Cost: ${job.cost}</span>
                          <span className={job.profit >= 0 ? "text-green-500" : "text-red-500"}>
                            Profit: {job.profit > 0 ? '+' : ''}{job.profit}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="teams">
              <Card className="bg-white shadow-md border-none">
                <CardHeader>
                  <CardTitle className="text-[#0A2747]">Statistici per Echipă</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-[#0A2747]" />
                    <Input
                      placeholder="Caută echipe..."
                      value={teamFilter}
                      onChange={(e) => setTeamFilter(e.target.value)}
                      className="max-w-sm border-[#0A2747]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {filteredTeams.map((team, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-[#0A2747]">{team.name}</h4>
                          <span className="text-sm text-[#0A2747] opacity-70">{team.members} membri</span>
                        </div>
                        <Progress value={team.efficiency} className="h-2" />
                        <div className="flex justify-between text-xs text-[#0A2747] opacity-70 mt-1">
                          <span>Proiecte finalizate: {team.completedProjects}</span>
                          <span>Timp total: {team.totalTime} ore</span>
                          <span className={team.efficiency >= 90 ? "text-green-500" : "text-yellow-500"}>
                            Eficiență: {team.efficiency}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="employees">
              <Card className="bg-white shadow-md border-none">
                <CardHeader>
                  <CardTitle className="text-[#0A2747]">Statistici per Angajat</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-[#0A2747]" />
                    <Input
                      placeholder="Caută angajați..."
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      className="max-w-sm border-[#0A2747]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {filteredEmployees.map((employee, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-[#0A2747]">{employee.name}</h4>
                          <span className="text-sm text-[#0A2747] opacity-70">{employee.role}</span>
                        </div>
                        <Progress value={(employee.projects / 10) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-[#0A2747] opacity-70 mt-1">
                          <span>Proiecte: {employee.projects}</span>
                          <span>Ore lucrate: {employee.hoursWorked}</span>
                          <span className={employee.performance === "Excelentă" ? "text-green-500" : "text-yellow-500"}>
                            Performanță: {employee.performance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  )
}
