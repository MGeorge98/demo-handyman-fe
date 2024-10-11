"use client"

import { useState } from "react"
import { Edit, Plus, Search, Trash, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <h1 className="text-3xl font-bold text-[#0A2747]">Gestionare Utilizatori</h1>

            <Card className="border-none shadow-md">
              <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                <CardTitle>Listă Utilizatori</CardTitle>
                <CardDescription className="text-gray-300">Gestionați conturile de utilizator pentru manageri, coordonatori și angajați</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-[#0A2747]" />
                    <Input
                      placeholder="Caută utilizatori..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 border-[#0A2747]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-[#0A2747] text-[#0A2747]">Filtrare</Button>
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
                    <Button onClick={() => { setCurrentUser(null); setIsDialogOpen(true) }} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                      <Plus className="mr-2 h-4 w-4" /> Adaugă Utilizator
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort('name')} className="cursor-pointer text-[#0A2747]">Nume</TableHead>
                        <TableHead onClick={() => handleSort('email')} className="cursor-pointer text-[#0A2747]">Email</TableHead>
                        <TableHead onClick={() => handleSort('phone')} className="cursor-pointer text-[#0A2747]">Telefon</TableHead>
                        <TableHead onClick={() => handleSort('role')} className="cursor-pointer text-[#0A2747]">Rol</TableHead>
                        <TableHead onClick={() => handleSort('team')} className="cursor-pointer text-[#0A2747]">Echipă</TableHead>
                        <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-[#0A2747]">Status</TableHead>
                        <TableHead className="text-[#0A2747]">Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.team}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Activ" ? "success" : "secondary"} className={user.status === "Activ" ? "bg-green-500" : "bg-gray-500"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setCurrentUser(user); setIsDialogOpen(true) }}
                                className="border-[#0A2747] text-[#0A2747] hover:bg-[#0A2747] hover:text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              >
                                <Trash className="h-4 w-4" />
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#0A2747]">{currentUser ? "Editare Utilizator" : "Creare Utilizator Nou"}</DialogTitle>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-[#0A2747]">
                    Nume
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={currentUser?.name}
                    className="col-span-3 border-[#0A2747]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right text-[#0A2747]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={currentUser?.email}
                    className="col-span-3 border-[#0A2747]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right text-[#0A2747]">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={currentUser?.phone}
                    className="col-span-3 border-[#0A2747]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center  gap-4">
                  <Label htmlFor="role" className="text-right text-[#0A2747]">
                    Rol
                  </Label>
                  <Select name="role" defaultValue={currentUser?.role || "Angajat"}>
                    <SelectTrigger className="col-span-3 border-[#0A2747]">
                      <SelectValue placeholder="Selectează rolul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Coordonator">Coordonator</SelectItem>
                      <SelectItem value="Angajat">Angajat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="team" className="text-right text-[#0A2747]">
                    Echipă
                  </Label>
                  <Select name="team" defaultValue={currentUser?.team || "Curățenie Birouri"}>
                    <SelectTrigger className="col-span-3 border-[#0A2747]">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right text-[#0A2747]">
                    Status
                  </Label>
                  <Select name="status" defaultValue={currentUser?.status || "Activ"}>
                    <SelectTrigger className="col-span-3 border-[#0A2747]">
                      <SelectValue placeholder="Selectează statusul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activ">Activ</SelectItem>
                      <SelectItem value="Inactiv">Inactiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
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