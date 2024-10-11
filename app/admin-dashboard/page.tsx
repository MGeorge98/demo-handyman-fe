"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, Bell, Edit, Eye, FileText, Home, Search, Settings, Trash2, UserPlus, Users } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

export const adminLinks = [
  { href: "/admin-dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
  { href: "/admin-dashboard/users", label: "Utilizatori", icon: <Users className="h-4 w-4" /> },
  { href: "/admin-dashboard/projects", label: "Proiecte", icon: <BarChart2 className="h-4 w-4" /> },
  { href: "/admin-dashboard/reports", label: "Rapoarte", icon: <FileText className="h-4 w-4" /> },
]

export default function AdminDashboard() {
  const [userFilter, setUserFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' })
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isViewUserOpen, setIsViewUserOpen] = useState(false)
  const [userToView, setUserToView] = useState(null)

  const [users, setUsers] = useState([
    { id: 1, name: "Ana Popescu", role: "Manager", avatar: "/placeholder.svg?height=32&width=32", email: "ana.popescu@example.com", projects: 5, lastActive: "2024-10-09" },
    { id: 2, name: "Ion Ionescu", role: "Coordonator", avatar: "/placeholder.svg?height=32&width=32", email: "ion.ionescu@example.com", projects: 3, lastActive: "2024-10-10" },
    { id: 3, name: "Maria Georgescu", role: "Manager", avatar: "/placeholder.svg?height=32&width=32", email: "maria.georgescu@example.com", projects: 4, lastActive: "2024-10-08" },
    { id: 4, name: "Andrei Popa", role: "Coordonator", avatar: "/placeholder.svg?height=32&width=32", email: "andrei.popa@example.com", projects: 2, lastActive: "2024-10-10" },
  ])

  const [projects, setProjects] = useState([
    { id: 1, name: "Curățenie Birouri A", status: "În desfășurare", progress: 75, manager: "Ana Popescu", team: "Echipa Alpha", dueDate: "2024-10-15" },
    { id: 2, name: "Curățenie Rezidențială B", status: "În așteptare", progress: 0, manager: "Maria Georgescu", team: "Echipa Beta", dueDate: "2024-10-20" },
    { id: 3, name: "Curățenie Industrială C", status: "În desfășurare", progress: 25, manager: "Ana Popescu", team: "Echipa Gamma", dueDate: "2024-10-25" },
    { id: 4, name: "Întreținere Spații Verzi D", status: "Finalizat", progress: 100, manager: "Maria Georgescu", team: "Echipa Delta", dueDate: "2024-10-05" },
  ])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
    user.role.toLowerCase().includes(userFilter.toLowerCase())
  )

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectFilter.toLowerCase()) ||
    project.status.toLowerCase().includes(projectFilter.toLowerCase())
  )

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Eroare",
        description: "Vă rugăm să completați toate câmpurile.",
        variant: "destructive",
      })
      return
    }
    const newUserId = users.length + 1
    const userToAdd = { ...newUser, id: newUserId, avatar: "/placeholder.svg?height=32&width=32", projects: 0, lastActive: new Date().toISOString().split('T')[0] }
    setUsers([...users, userToAdd])
    setIsAddUserOpen(false)
    setNewUser({ name: '', email: '', role: '' })
    toast({
      title: "Utilizator adăugat",
      description: `${newUser.name} a fost adăugat cu succes.`,
    })
  }

  const handleUpdateUser = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    )
    setUsers(updatedUsers)
    setSelectedUser(null)
    toast({
      title: "Utilizator actualizat",
      description: `Informațiile pentru ${selectedUser.name} au fost actualizate.`,
    })
  }

  const handleDeleteUser = () => {
    const updatedUsers = users.filter(user => user.id !== userToDelete.id)
    setUsers(updatedUsers)
    setIsDeleteUserOpen(false)
    setUserToDelete(null)
    toast({
      title: "Utilizator șters",
      description: `${userToDelete.name} a fost șters din sistem.`,
    })
  }

  const handleViewUser = (user) => {
    setUserToView(user)
    setIsViewUserOpen(true)
  }

  const handleGenerateReport = (reportType) => {
    toast({
      title: "Raport generat",
      description: `Raportul de ${reportType} a fost generat cu succes.`,
    })
  }

  return (
    <DashboardLayout links={adminLinks}>
      <div className="min-h-screen bg-[#F4F7FA]">
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-[#0A2747]">Bun venit, Admin!</h2>
            <Button 
              className="bg-[#FAA502] hover:bg-[#E69500] text-white" 
              onClick={() => setIsAddUserOpen(true)}
            >
              <UserPlus className="mr-2 h-5 w-5" /> Adaugă Utilizator
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Utilizatori"
              value={users.length}
              icon={<Users className="h-6 w-6 text-[#FAA502]" />}
              subtext="+2 față de luna trecută"
            />
            <DashboardCard
              title="Proiecte Active"
              value={projects.filter(p => p.status !== "Finalizat").length}
              icon={<BarChart2 className="h-6 w-6 text-[#FAA502]" />}
              subtext={`din ${projects.length} total`}
            />
            <DashboardCard
              title="Rapoarte Generate"
              value={24}
              icon={<FileText className="h-6 w-6 text-[#FAA502]" />}
              subtext="în ultima lună"
            />
            <DashboardCard
              title="Eficiență Globală"
              value="92%"
              icon={<BarChart2 className="h-6 w-6 text-[#FAA502]" />}
              subtext="+5% față de luna trecută"
            />
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="bg-[#0A2747] text-white">
              <TabsTrigger value="users" className="data-[state=active]:bg-[#FAA502]">Utilizatori</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-[#FAA502]">Proiecte</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A2747]">Gestionare Utilizatori</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-[#0A2747]" />
                    <Input
                      placeholder="Caută utilizatori..."
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="max-w-sm border-[#0A2747]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[#0A2747]">Nume</TableHead>
                        <TableHead className="text-[#0A2747]">Rol</TableHead>
                        <TableHead className="text-[#0A2747]">Email</TableHead>
                        <TableHead className="text-[#0A2747]">Proiecte</TableHead>
                        <TableHead className="text-[#0A2747]">Ultima Activitate</TableHead>
                        <TableHead className="text-[#0A2747]">Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.projects}</TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => { setUserToDelete(user); setIsDeleteUserOpen(true); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A2747]">Vizualizare Proiecte</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-[#0A2747]" />
                    <Input
                      placeholder="Caută proiecte..."
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                      className="max-w-sm border-[#0A2747]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[#0A2747]">Nume Proiect</TableHead>
                        <TableHead className="text-[#0A2747]">Status</TableHead>
                        <TableHead className="text-[#0A2747]">Progres</TableHead>
                        <TableHead className="text-[#0A2747]">Manager</TableHead>
                        <TableHead className="text-[#0A2747]">Echipă</TableHead>
                        <TableHead className="text-[#0A2747]">Termen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={project.status === "În desfășurare" ? "default" :
                                project.status === "În așteptare" ? "secondary" : "success"}
                              className="bg-[#FAA502] text-white"
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Progress value={project.progress} className="w-[60px]" />
                          </TableCell>
                          <TableCell>{project.manager}</TableCell>
                          <TableCell>{project.team}</TableCell>
                          <TableCell>{project.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A2747]">Rapoarte Rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4">
                <Button variant="outline" className="border-[#0A2747] text-[#0A2747] hover:bg-[#FAA502] hover:text-white" onClick={() => handleGenerateReport('utilizatori')}>
                  <FileText className="mr-2 h-4 w-4" /> Raport Utilizatori
                </Button>
                <Button variant="outline" className="border-[#0A2747] text-[#0A2747] hover:bg-[#FAA502] hover:text-white" onClick={() => handleGenerateReport('proiecte')}>
                  <FileText className="mr-2 h-4 w-4" /> Raport Proiecte
                </Button>
                <Button variant="outline" className="border-[#0A2747] text-[#0A2747] hover:bg-[#FAA502] hover:text-white" onClick={() => handleGenerateReport('financiar')}>
                  <FileText className="mr-2 h-4 w-4" /> Raport Financiar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#0A2747]">Adaugă Utilizator Nou</DialogTitle>
                <DialogDescription className="text-[#0A2747] opacity-70">
                  Completează informațiile pentru noul utilizator.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#0A2747]">Nume</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="border-[#0A2747]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#0A2747]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="border-[#0A2747]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#0A2747]">Rol</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger className="border-[#0A2747]">
                      <SelectValue placeholder="Selectează rolul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="coordonator">Coordonator</SelectItem>
                      <SelectItem value="angajat">Angajat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser} className="bg-[#FAA502] text-white hover:bg-[#E69500]">Adaugă Utilizator</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#0A2747]">Editează Utilizator</DialogTitle>
                <DialogDescription className="text-[#0A2747] opacity-70">
                  Modifică informațiile pentru {selectedUser?.name}.
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-[#0A2747]">Nume</Label>
                    <Input 
                      id="edit-name" 
                      value={selectedUser.name} 
                      onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                      className="border-[#0A2747]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-[#0A2747]">Email</Label>
                    <Input 
                      id="edit-email" 
                      type="email" 
                      value={selectedUser.email} 
                      onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                      className="border-[#0A2747]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role" className="text-[#0A2747]">Rol</Label>
                    <Select 
                      value={selectedUser.role}
                      onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                    >
                      <SelectTrigger className="border-[#0A2747]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="coordonator">Coordonator</SelectItem>
                        <SelectItem value="angajat">Angajat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={handleUpdateUser} className="bg-[#FAA502] text-white hover:bg-[#E69500]">Salvează Modificările</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#0A2747]">Confirmare Ștergere Utilizator</DialogTitle>
                <DialogDescription className="text-[#0A2747] opacity-70">
                  Sunteți sigur că doriți să ștergeți acest utilizator? Această acțiune nu poate fi anulată.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>Anulează</Button>
                <Button variant="destructive" onClick={handleDeleteUser}>Șterge Utilizator</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#0A2747]">Detalii Utilizator</DialogTitle>
              </DialogHeader>
              {userToView && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={userToView.avatar} alt={userToView.name} />
                      <AvatarFallback>{userToView.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-[#0A2747]">{userToView.name}</h3>
                      <p className="text-sm text-[#0A2747] opacity-70">{userToView.role}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A2747]">Email</p>
                    <p className="text-sm text-[#0A2747] opacity-70">{userToView.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A2747]">Proiecte Asignate</p>
                    <p className="text-sm text-[#0A2747] opacity-70">{userToView.projects}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A2747]">Ultima Activitate</p>
                    <p className="text-sm text-[#0A2747] opacity-70">{userToView.lastActive}</p>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewUserOpen(false)} className="bg-[#FAA502] text-white hover:bg-[#E69500]">Închide</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </DashboardLayout>
  )
}

function DashboardCard({ title, value, icon, subtext }) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#0A2747]">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#0A2747]">{value}</div>
        <p className="text-xs text-[#0A2747] opacity-70">{subtext}</p>
      </CardContent>
    </Card>
  )
}