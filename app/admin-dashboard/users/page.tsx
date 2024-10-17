"use client"

import { useState } from "react"
import { Edit, Plus, Search, Trash, User, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Mail, Phone, Briefcase } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { adminLinks } from "../page"

const initialUsers = [
  { id: 1, name: "Ana Popescu", email: "ana.popescu@example.com", phone: "0722123456", role: "Manager", team: "Curățenie Birouri", status: "Activ" },
  { id: 2, name: "Mihai Ionescu", email: "mihai.ionescu@example.com", phone: "0733234567", role: "Coordonator", team: "Curățenie Rezidențială", status: "Activ" },
  { id: 3, name: "Elena Dumitrescu", email: "elena.dumitrescu@example.com", phone: "0744345678", role: "Angajat", team: "Curățenie Industrială", status: "Inactiv" },
  { id: 4, name: "Alexandru Popa", email: "alexandru.popa@example.com", phone: "0755456789", role: "Angajat", team: "Întreținere Spații Verzi", status: "Activ" },
  { id: 5, name: "Maria Stancu", email: "maria.stancu@example.com", phone: "0766567890", role: "Coordonator", team: "Curățenie Post-Construcție", status: "Activ" },
]

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState([])
  const [teamFilter, setTeamFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const filteredUsers = users.filter(user =>
    (searchTerm === "" || user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter.length === 0 || roleFilter.includes(user.role)) &&
    (teamFilter.length === 0 || teamFilter.includes(user.team)) &&
    (statusFilter.length === 0 || statusFilter.includes(user.status))
  ).sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
    }
    return 0
  })

  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  const handleCreateUser = (userData) => {
    const newUser = { id: users.length + 1, ...userData }
    setUsers([...users, newUser])
    setIsDialogOpen(false)
    toast({
      title: "Utilizator creat",
      description: `Utilizatorul ${userData.name} a fost creat cu succes.`,
    })
  }

  const handleEditUser = (userData) => {
    setUsers(users.map(user => user.id === userData.id ? userData : user))
    setIsDialogOpen(false)
    toast({
      title: "Utilizator actualizat",
      description: `Informațiile utilizatorului ${userData.name} au fost actualizate.`,
    })
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
    toast({
      title: "Utilizator șters",
      description: "Utilizatorul a fost șters cu succes.",
    })
  }

  return (
    <DashboardLayout links={adminLinks}>
      <div className="flex min-h-screen w-full flex-col bg-gray-50">
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">Gestionare Utilizatori</CardTitle>
                    <CardDescription className="text-gray-200">Gestionați conturile de utilizator pentru manageri, coordonatori și angajați</CardDescription>
                  </div>
                  <Button 
                    onClick={() => { setCurrentUser(null); setIsDialogOpen(true) }} 
                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adaugă Utilizator
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Caută utilizatori..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full">Filtrare</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Rol</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["Manager", "Coordonator", "Angajat"].map((role) => (
                        <DropdownMenuCheckboxItem
                          key={role}
                          checked={roleFilter.includes(role)}
                          onCheckedChange={(checked) =>
                            setRoleFilter(
                              checked
                                ? [...roleFilter, role]
                                : roleFilter.filter((item) => item !== role)
                            )
                          }
                        >
                          {role}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Echipă</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["Curățenie Birouri", "Curățenie Rezidențială", "Curățenie Industrială", "Întreținere Spații Verzi", "Curățenie Post-Construcție"].map((team) => (
                        <DropdownMenuCheckboxItem
                          key={team}
                          checked={teamFilter.includes(team)}
                          onCheckedChange={(checked) =>
                            setTeamFilter(
                              checked
                                ? [...teamFilter, team]
                                : teamFilter.filter((item) => item !== team)
                            )
                          }
                        >
                          {team}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["Activ", "Inactiv"].map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={(checked) =>
                            setStatusFilter(
                              checked
                                ? [...statusFilter, status]
                                : statusFilter.filter((item) => item !== status)
                            )
                          }
                        >
                          {status}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                        Nume {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </TableHead>
                      <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                        Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </TableHead>
                      <TableHead onClick={() => handleSort('role')} className="cursor-pointer">
                        Rol {sortConfig.key === 'role' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </TableHead>
                      <TableHead onClick={() => handleSort('team')} className="cursor-pointer">
                        Echipă {sortConfig.key === 'team' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </TableHead>
                      <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                      </TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.team}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Activ" ? "success" : "secondary"} className={`rounded-full ${user.status === "Activ" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setCurrentUser(user); setIsDialogOpen(true) }}
                              className="rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="rounded-full text-red-500 border-red-500 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Afișare {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUsers.length)} din {filteredUsers.length} utilizatori
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-full"
                      variant="outline"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                      disabled={currentPage === pageCount}
                      className="rounded-full"
                      variant="outline"
                    >
                      Următor
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white rounded-2xl max-w-2xl">
            
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">{currentUser ? "Editare Utilizator" : "Creare Utilizator Nou"}</DialogTitle>
              <DialogDescription className="text-gray-500">
                {currentUser ? "Modificați informațiile utilizatorului" : "Introduceți detaliile noului utilizator"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const userData = {
                id: currentUser?.id,
                name: formData.get("name"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                role: formData.get("role"),
                team: formData.get("team"),
                status: formData.get("status")
              }
              currentUser ? handleEditUser(userData) : handleCreateUser(userData)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nume</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={currentUser?.name}
                      className="rounded-full mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={currentUser?.email}
                      className="rounded-full mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={currentUser?.phone}
                      className="rounded-full mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">Rol</Label>
                    <Select name="role" defaultValue={currentUser?.role || "Angajat"}>
                      <SelectTrigger className="rounded-full mt-1">
                        <SelectValue placeholder="Selectează rolul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Coordonator">Coordonator</SelectItem>
                        <SelectItem value="Angajat">Angajat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team" className="text-sm font-medium text-gray-700">Echipă</Label>
                    <Select name="team" defaultValue={currentUser?.team || "Curățenie Birouri"}>
                      <SelectTrigger className="rounded-full mt-1">
                        <SelectValue placeholder="Selectează echipa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Curățenie Birouri">Curățenie Birouri</SelectItem>
                        <SelectItem value="Curățenie Rezidențială">Curățenie Rezidențială</SelectItem>
                        <SelectItem value="Curățenie Industrială">Curățenie Industrială</SelectItem>
                        <SelectItem value="Întreținere Spații Verzi">Întreținere Spații Verzi</SelectItem>
                        <SelectItem value="Curățenie Post-Construcție">Curățenie Post-Construcție</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                    <Select name="status" defaultValue={currentUser?.status || "Activ"}>
                      <SelectTrigger className="rounded-full mt-1">
                        <SelectValue placeholder="Selectează statusul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activ">Activ</SelectItem>
                        <SelectItem value="Inactiv">Inactiv</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                  {currentUser ? "Salvează Modificările" : "Creează Utilizator"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}