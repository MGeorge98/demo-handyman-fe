'use client';

import { DashboardLayout } from '@/components/layout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Bell, Edit, Eye, FileText, Home, Search, Settings, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
export const adminLinks = [
  { href: "/admin-dashboard", label: "Dashboard", icon: <Home /> },
  { href: "/admin-dashboard/users", label: "Utilizatori", icon: <Users className="h-4 w-4" /> },
  { href: "/admin-dashboard/projects", label: "Proiecte", icon: <BarChart2 className="h-4 w-4" /> },
  { href: "/admin-dashboard/reports", label: "Reports", icon: <Settings className="h-4 w-4" /> },
]


export default function AdminDashboard() {
  const [userFilter, setUserFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' })
  const [selectedUser, setSelectedUser] = useState(null)

  const users = [
    { id: 1, name: "Ana Popescu", role: "Manager", avatar: "/placeholder.svg?height=32&width=32", email: "ana.popescu@example.com", projects: 5, lastActive: "2024-10-09" },
    { id: 2, name: "Ion Ionescu", role: "Coordonator", avatar: "/placeholder.svg?height=32&width=32", email: "ion.ionescu@example.com", projects: 3, lastActive: "2024-10-10" },
    { id: 3, name: "Maria Georgescu", role: "Manager", avatar: "/placeholder.svg?height=32&width=32", email: "maria.georgescu@example.com", projects: 4, lastActive: "2024-10-08" },
    { id: 4, name: "Andrei Popa", role: "Coordonator", avatar: "/placeholder.svg?height=32&width=32", email: "andrei.popa@example.com", projects: 2, lastActive: "2024-10-10" },
  ]

  const projects = [
    { id: 1, name: "Curățenie Birouri A", status: "În desfășurare", progress: 75, manager: "Ana Popescu", team: "Echipa Alpha", dueDate: "2024-10-15" },
    { id: 2, name: "Curățenie Rezidențială B", status: "În așteptare", progress: 0, manager: "Maria Georgescu", team: "Echipa Beta", dueDate: "2024-10-20" },
    { id: 3, name: "Curățenie Industrială C", status: "În desfășurare", progress: 25, manager: "Ana Popescu", team: "Echipa Gamma", dueDate: "2024-10-25" },
    { id: 4, name: "Întreținere Spații Verzi D", status: "Finalizat", progress: 100, manager: "Maria Georgescu", team: "Echipa Delta", dueDate: "2024-10-05" },
  ]

 

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
    user.role.toLowerCase().includes(userFilter.toLowerCase())
  )

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectFilter.toLowerCase()) ||
    project.status.toLowerCase().includes(projectFilter.toLowerCase())
  )

  const handleAddUser = () => {
    console.log('New user added:', newUser)
    setIsAddUserOpen(false)
    setNewUser({ name: '', email: '', role: '' })
  }

  const handleUserAction = (action, user) => {
    console.log(`${action} user:`, user)
    setSelectedUser(null)
  }



  return (
    <DashboardLayout links={adminLinks}>


      <div className="min-h-screen bg-[#f4f7fa]">
      

        <main className="container mx-auto p-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-[#0A2647]">Bun venit, Admin!</h2>
            <Button className="bg-[#FFA500] hover:bg-[#FF8C00] text-white" onClick={() => setIsAddUserOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Adaugă Utilizator
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">+2 față de luna trecută</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proiecte Active</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.filter(p => p.status !== "Finalizat").length}</div>
                <p className="text-xs text-muted-foreground">din {projects.length} total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rapoarte Generate</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">în ultima lună</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eficiență Globală</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">+5% față de luna trecută</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Utilizatori</TabsTrigger>
              <TabsTrigger value="projects">Proiecte</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionare Utilizatori</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Caută utilizatori..."
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nume</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Proiecte</TableHead>
                        <TableHead>Ultima Activitate</TableHead>
                        <TableHead>Acțiuni</TableHead>
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
                              <Button variant="outline" size="sm" onClick={() => handleUserAction('view', user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleUserAction('delete', user)}>
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
                  <CardTitle>Vizualizare Proiecte</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Caută proiecte..."
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nume Proiect</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progres</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Echipă</TableHead>
                        <TableHead>Termen</TableHead>
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
              <CardTitle>Rapoarte Rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Raport Utilizatori
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Raport Proiecte
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Raport Financiar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adaugă Utilizator Nou</DialogTitle>
                <DialogDescription>
                  Completează informațiile pentru noul utilizator.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
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
                <Button onClick={handleAddUser}>Adaugă Utilizator</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editează Utilizator</DialogTitle>
                <DialogDescription>
                  Modifică informațiile pentru {selectedUser?.name}.
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nume</Label>
                    <Input id="edit-name" defaultValue={selectedUser.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Rol</Label>
                    <Select defaultValue={selectedUser.role}>
                      <SelectTrigger>
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
                <Button onClick={() => handleUserAction('update', selectedUser)}>Salvează Modificările</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </DashboardLayout>
  )
}