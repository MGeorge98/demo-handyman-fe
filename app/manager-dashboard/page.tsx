'use client';

import React, { useState } from 'react'
import { Bell, Plus, BarChart2, Users, Clock, DollarSign, Search, X, Home, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DashboardLayout } from '@/components/layout';

export const managerLinks = [
  { href: "/manager-dashboard", label: "Dashboard", icon: <Home /> },
  { href: "/manager-dashboard/clients", label: "Clienți", icon: <Users className="h-4 w-4" /> },
  { href: "/manager-dashboard/create-project", label: "Creare Proiect", icon: <BarChart2 className="h-4 w-4" /> },
  { href: "/manager-dashboard/program", label: "Calendar", icon: <Settings className="h-4 w-4" /> },
  { href: "/manager-dashboard/active-projects", label: "Proiecte Active", icon: <Settings className="h-4 w-4" /> },
  { href: "/manager-dashboard/employees", label: "Gestionare Angajati", icon: <Settings className="h-4 w-4" /> },
  { href: "/manager-dashboard/reports", label: "Rapoarte si Statistici", icon: <Settings className="h-4 w-4" /> },
  { href: "/manager-dashboard/settings", label: "Setari", icon: <Settings className="h-4 w-4" /> },
]

export default function Dashboard() {
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

  const handleNewProjectChange = (e) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleNewProjectSubmit = (e) => {
    e.preventDefault()
    console.log('New Project Submitted:', newProject)
    // Here you would typically send this data to your backend
    setIsNewProjectModalOpen(false)
    setNewProject({
      name: '',
      description: '',
      client: '',
      startDate: '',
      endDate: '',
      assignedTeam: '',
    })
  }

  return (
    <DashboardLayout links={managerLinks}>
      <div className="min-h-screen bg-[#f4f7fa]">
        <main className="container mx-auto p-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-[#0A2647]">Bun venit, Manager!</h2>
            <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FFA500] hover:bg-[#FF8C00] text-white">
                  <Plus className="mr-2 h-4 w-4" /> Proiect Nou
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adaugă Proiect Nou</DialogTitle>
                  <DialogDescription>
                    Completează detaliile pentru noul proiect de curățenie.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNewProjectSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nume Proiect</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProject.name}
                      onChange={handleNewProjectChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descriere</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newProject.description}
                      onChange={handleNewProjectChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      name="client"
                      value={newProject.client}
                      onChange={handleNewProjectChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data Început</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={newProject.startDate}
                        onChange={handleNewProjectChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data Sfârșit</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={newProject.endDate}
                        onChange={handleNewProjectChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTeam">Echipă Asignată</Label>
                    <Select
                      name="assignedTeam"
                      value={newProject.assignedTeam}
                      onValueChange={(value) => handleNewProjectChange({ target: { name: 'assignedTeam', value } })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează o echipă" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.name} value={team.name}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsNewProjectModalOpen(false)}>
                      Anulează
                    </Button>
                    <Button type="submit" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white">
                      Adaugă Proiect
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proiecte Active</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 față de luna trecută</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Echipe Active</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+1 față de luna trecută</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ore Lucrate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+10% față de luna trecută</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Venit Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% față de luna trecută</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proiecte în Desfășurare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-[#0A2647] rounded-md flex items-center justify-center text-white">
                  Grafic Proiecte în Desfășurare
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Proiecte Viitoare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-[#0A2647] rounded-md flex items-center justify-center text-white">
                  Grafic Proiecte Viitoare
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="jobs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="jobs">Lucrări</TabsTrigger>
              <TabsTrigger value="teams">Echipe</TabsTrigger>
              <TabsTrigger value="employees">Angajați</TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Statistici per Lucrare</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Caută lucrări..."
                      value={jobFilter}
                      onChange={(e) => setJobFilter(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {filteredJobs.map((job, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{job.name}</h4>
                          <span className="text-sm text-muted-foreground">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
              <Card>
                <CardHeader>
                  <CardTitle>Statistici per Echipă</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Caută echipe..."
                      value={teamFilter}
                      onChange={(e) => setTeamFilter(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {filteredTeams.map((team, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{team.name}</h4>
                          <span className="text-sm text-muted-foreground">{team.members} membri</span>
                        </div>
                        <Progress value={team.efficiency} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
              <Card>
                <CardHeader>
                  <CardTitle>Statistici per Angajat</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Caută angajați..."
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {filteredEmployees.map((employee, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{employee.name}</h4>
                          <span className="text-sm text-muted-foreground">{employee.role}</span>
                        </div>
                        <Progress value={(employee.projects / 10) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
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