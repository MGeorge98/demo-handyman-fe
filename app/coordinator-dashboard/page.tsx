'use client'

import React, { useState } from 'react'
import { Bell, Users, Clock, CheckCircle, AlertCircle, MoreVertical, Search, Calendar, Briefcase, UserPlus, UserMinus, Edit, Home, BarChart2, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from '@/components/layout'
import { managerLinks } from '../manager-dashboard/page'

export const coordinatorLinks = [
  { href: "/coordinator-dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
  { href: "/coordinator-dashboard/project-details", label: "Proiecte", icon: <Briefcase className="h-4 w-4" /> },
  // { href: "/coordinator-dashboard/employees", label: "Gestionare Angajati", icon: <Users className="h-4 w-4" /> },
  // { href: "/coordinator-dashboard/resources", label: "Resurse", icon: <BarChart2 className="h-4 w-4" /> },
  // { href: "/coordinator-dashboard/time-tracking", label: "Pontaj", icon: <Clock className="h-4 w-4" /> },
  // { href: "/coordinator-dashboard/daily-reporting", label: "Raportare Zilnica", icon: <CheckCircle className="h-4 w-4" /> },
  { href: "/coordinator-dashboard/settings", label: "Setari", icon: <Settings className="h-4 w-4" /> },
]

export default function CoordinatorDashboard() {
  const [projectFilter, setProjectFilter] = useState('')
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', email: '' })

  const projects = [
    { id: 1, name: "Curățenie Birouri A", status: "În desfășurare", progress: 75, team: "Echipa Alpha", dueDate: "2024-10-15" },
    { id: 2, name: "Curățenie Rezidențială B", status: "În așteptare", progress: 0, team: "Echipa Beta", dueDate: "2024-10-20" },
    { id: 3, name: "Curățenie Industrială C", status: "În desfășurare", progress: 25, team: "Echipa Gamma", dueDate: "2024-10-25" },
    { id: 4, name: "Întreținere Spații Verzi D", status: "Finalizat", progress: 100, team: "Echipa Delta", dueDate: "2024-10-05" },
  ]

  const notifications = [
    { id: 1, message: "Proiect nou asignat: Curățenie Rezidențială B", type: "info", timestamp: "2024-10-09 09:00" },
    { id: 2, message: "Actualizare pentru Curățenie Birouri A: 75% complet", type: "success", timestamp: "2024-10-09 11:30" },
    { id: 3, message: "Cerere de materiale suplimentare pentru Curățenie Industrială C", type: "warning", timestamp: "2024-10-09 14:15" },
    { id: 4, message: "Raport zilnic pentru Echipa Alpha disponibil", type: "info", timestamp: "2024-10-09 17:00" },
  ]

  const employees = [
    { id: 1, name: "Ana Popescu", role: "Curățător", avatar: "/placeholder.svg?height=32&width=32", email: "ana.popescu@example.com", team: "Echipa Alpha" },
    { id: 2, name: "Ion Ionescu", role: "Tehnician", avatar: "/placeholder.svg?height=32&width=32", email: "ion.ionescu@example.com", team: "Echipa Beta" },
    { id: 3, name: "Maria Georgescu", role: "Curățător", avatar: "/placeholder.svg?height=32&width=32", email: "maria.georgescu@example.com", team: "Echipa Gamma" },
    { id: 4, name: "Andrei Popa", role: "Specialist", avatar: "/placeholder.svg?height=32&width=32", email: "andrei.popa@example.com", team: "Echipa Delta" },
  ]

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectFilter.toLowerCase())
  )

  const handleAddEmployee = () => {
    console.log('New employee added:', newEmployee)
    setIsAddEmployeeOpen(false)
    setNewEmployee({ name: '', role: '', email: '' })
  }

  const handleEmployeeAction = (action, employee) => {
    console.log(`${action} employee:`, employee)
    setSelectedEmployee(null)
  }

  return (
    <DashboardLayout links={coordinatorLinks}>
      <div className="min-h-screen bg-[#f4f7fa] p-6">
        <main className="container mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-[#0A2647]">Bun venit, Coordonator!</h2>
            <Button className="bg-[#FAA502] hover:bg-[#E69500] text-white" onClick={() => setIsTeamManagementOpen(true)}>
              <Users className="mr-2 h-4 w-4" /> Gestionare Echipă
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-md shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proiecte Active</CardTitle>
                <Briefcase className="h-5 w-5 text-[#FAA502]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.filter(p => p.status !== "Finalizat").length}</div>
                <p className="text-xs text-muted-foreground">din {projects.length} total</p>
              </CardContent>
            </Card>
            <Card className="rounded-md shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Echipe Active</CardTitle>
                <Users className="h-5 w-5 text-[#FAA502]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">gestionează echipele</p>
              </CardContent>
            </Card>
            <Card className="rounded-md shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ore Lucrate Astăzi</CardTitle>
                <Clock className="h-5 w-5 text-[#FAA502]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">de toate echipele</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-md shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Proiecte Active</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Caută proiecte..."
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="max-w-sm rounded-md"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium">{project.name}</h4>
                      <Badge
                        variant={project.status === "În desfășurare" ? "default" :
                          project.status === "În așteptare" ? "secondary" : "success"}
                        className="rounded-full px-3 py-1"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <Progress value={project.progress} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Echipa: {project.team}</span>
                      <span>Progres: {project.progress}%</span>
                      <span>Termen: {project.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={isTeamManagementOpen} onOpenChange={setIsTeamManagementOpen}>
            <DialogContent className="sm:max-w-[800px] rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Gestionare Echipă</DialogTitle>
                <DialogDescription>
                  Gestionează membrii echipei și asignează-i la proiecte.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="members" className="w-full mt-4">
                <TabsList className="bg-[#0A2747] text-white">
                  <TabsTrigger value="members" className="data-[state=active]:bg-[#FAA502]">Membri Echipă</TabsTrigger>
                  <TabsTrigger value="projects" className="data-[state=active]:bg-[#FAA502]">Asignare Proiecte</TabsTrigger>
                </TabsList>
                <TabsContent value="members" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Membri Echipă</h3>
                      <Button onClick={() => setIsAddEmployeeOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" /> Adaugă Membru
                      </Button>
                    </div>
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleEmployeeAction('remove', employee)}>
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="projects" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Asignare Proiecte</h3>
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">Echipa: {project.team}</p>
                        </div>
                        <Select>
                          <SelectTrigger className="w-[180px] rounded-md">
                            <SelectValue placeholder="Selectează echipa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alpha">Echipa Alpha</SelectItem>
                            <SelectItem value="beta">Echipa Beta</SelectItem>
                            <SelectItem value="gamma">Echipa Gamma</SelectItem>
                            <SelectItem value="delta">Echipa Delta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogContent className="rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Adaugă  Membru Nou</DialogTitle>
                <DialogDescription>
                  Completează informațiile pentru noul membru al echipei.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={newEmployee.role}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                  >
                    <SelectTrigger className="rounded-md">
                      <SelectValue placeholder="Selectează rolul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curatator">Curățător</SelectItem>
                      <SelectItem value="tehnician">Tehnician</SelectItem>
                      <SelectItem value="specialist">Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="rounded-md"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEmployee}>Adaugă Membru</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
            <DialogContent className="rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Editează Membru</DialogTitle>
                <DialogDescription>
                  Modifică informațiile pentru {selectedEmployee?.name}.
                </DialogDescription>
              </DialogHeader>
              {selectedEmployee && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nume</Label>
                    <Input id="edit-name" defaultValue={selectedEmployee.name} className="rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Rol</Label>
                    <Select defaultValue={selectedEmployee.role}>
                      <SelectTrigger className="rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="curatator">Curățător</SelectItem>
                        <SelectItem value="tehnician">Tehnician</SelectItem>
                        <SelectItem value="specialist">Specialist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" type="email" defaultValue={selectedEmployee.email} className="rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-team">Echipă</Label>
                    <Select defaultValue={selectedEmployee.team}>
                      <SelectTrigger className="rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Echipa Alpha">Echipa Alpha</SelectItem>
                        <SelectItem value="Echipa Beta">Echipa Beta</SelectItem>
                        <SelectItem value="Echipa Gamma">Echipa Gamma</SelectItem>
                        <SelectItem value="Echipa Delta">Echipa Delta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => handleEmployeeAction('update', selectedEmployee)}>Salvează Modificările</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </DashboardLayout>
  )
}