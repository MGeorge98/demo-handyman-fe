"use client"

import { useState, useEffect } from "react"
import { Edit, Plus, Send, Trash, AlertTriangle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { coordinatorLinks } from "../page"

// Mock data for projects
const projects = [
    { id: 1, name: "Renovare Clădire de Birouri", location: "Str. Victoriei nr. 100, București" },
    { id: 2, name: "Curățenie Industrială Fabrică", location: "Șos. Industriilor nr. 50, Ploiești" },
    { id: 3, name: "Întreținere Complex Rezidențial", location: "Aleea Teilor nr. 15, Cluj-Napoca" },
]

const initialMaterials = [
    { id: 1, name: "Detergent universal", quantity: 50, unit: "l", threshold: 20 },
    { id: 2, name: "Soluție pentru geamuri", quantity: 30, unit: "l", threshold: 15 },
    { id: 3, name: "Dezinfectant", quantity: 40, unit: "l", threshold: 20 },
    { id: 4, name: "Saci menajeri", quantity: 1000, unit: "buc", threshold: 500 },
    { id: 5, name: "Lavete microfibră", quantity: 200, unit: "buc", threshold: 100 },
]

const initialTools = [
    { id: 1, name: "Mop profesional", quantity: 10, status: "Disponibil", lastMaintenance: "2024-02-15" },
    { id: 2, name: "Aspirator industrial", quantity: 5, status: "În folosință", lastMaintenance: "2024-01-20" },
    { id: 3, name: "Mașină de curățat pardoseli", quantity: 2, status: "În reparații", lastMaintenance: "2024-03-01" },
    { id: 4, name: "Scară telescopică", quantity: 3, status: "Disponibil", lastMaintenance: "2024-02-28" },
    { id: 5, name: "Kit curățare geamuri", quantity: 8, status: "În folosință", lastMaintenance: "2024-02-10" },
]

export default function ResourceManagement() {
    const [selectedProject, setSelectedProject] = useState(projects[0])
    const [materials, setMaterials] = useState(initialMaterials)
    const [tools, setTools] = useState(initialTools)
    const [editingResource, setEditingResource] = useState(null)
    const [isAddingResource, setIsAddingResource] = useState(false)
    const [newResource, setNewResource] = useState({ name: "", quantity: "", unit: "", threshold: "" })
    const [requestMessage, setRequestMessage] = useState("")
    const [activeTab, setActiveTab] = useState("materials")

    useEffect(() => {
        if (selectedProject) {
            setMaterials(initialMaterials)
            setTools(initialTools)
        }
    }, [selectedProject])

    const handleProjectSelection = (projectId) => {
        const project = projects.find(p => p.id === parseInt(projectId))
        setSelectedProject(project)
        toast({
            title: "Proiect selectat",
            description: `Ați selectat proiectul: ${project.name}`,
        })
    }

    const handleAddResource = (type) => {
        if (!selectedProject) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să selectați un proiect înainte de a adăuga resurse.",
                variant: "destructive",
            })
            return
        }

        if (type === "material") {
            setMaterials([...materials, { ...newResource, id: materials.length + 1, quantity: parseInt(newResource.quantity), threshold: parseInt(newResource.threshold) }])
        } else {
            setTools([...tools, { ...newResource, id: tools.length + 1, quantity: parseInt(newResource.quantity), status: "Disponibil", lastMaintenance: new Date().toISOString().split('T')[0] }])
        }
        setNewResource({ name: "", quantity: "", unit: "", threshold: "" })
        setIsAddingResource(false)
        toast({
            title: "Resursă adăugată",
            description: "Noua resursă a fost adăugată cu succes.",
        })
    }

    const handleEditResource = (type) => {
        if (type === "material") {
            setMaterials(materials.map(m => m.id === editingResource.id ? { ...editingResource, quantity: parseInt(editingResource.quantity), threshold: parseInt(editingResource.threshold) } : m))
        } else {
            setTools(tools.map(t => t.id === editingResource.id ? { ...editingResource, quantity: parseInt(editingResource.quantity) } : t))
        }
        setEditingResource(null)
        toast({
            title: "Resursă actualizată",
            description: "Resursa a fost actualizată cu succes.",
        })
    }

    const handleDeleteResource = (type, id) => {
        if (type === "material") {
            setMaterials(materials.filter(m => m.id !== id))
        } else {
            setTools(tools.filter(t => t.id !== id))
        }
        toast({
            title: "Resursă ștearsă",
            description: "Resursa a fost ștearsă cu succes.",
        })
    }

    const handleSendRequest = () => {
        if (!selectedProject) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să selectați un proiect înainte de a trimite o solicitare.",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Cerere trimisă",
            description: `Cererea pentru resurse suplimentare a fost trimisă managerului pentru proiectul ${selectedProject.name}.`,
        })
        setRequestMessage("")
    }

    const isLowStock = (material) => material.quantity <= material.threshold

    return (
            
                    <div className="mx-auto max-w-6xl space-y-8">
                
                            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                              
                                <CardContent className="p-0">
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                            <TabsTrigger value="materials" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">Materiale</TabsTrigger>
                                            <TabsTrigger value="tools" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">Unelte</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="materials" className="p-6">
                                            <ScrollArea className="h-[400px] rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Nume</TableHead>
                                                            <TableHead>Cantitate</TableHead>
                                                            <TableHead>Unitate</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Acțiuni</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {materials.map((material) => (
                                                            <TableRow key={material.id}>
                                                                <TableCell>{material.name}</TableCell>
                                                                <TableCell>{material.quantity}</TableCell>
                                                                <TableCell>{material.unit}</TableCell>
                                                                <TableCell>
                                                                    {isLowStock(material) ? (
                                                                        <Badge variant="destructive" className="rounded-full flex items-center space-x-1">
                                                                            <AlertTriangle className="h-4 w-4" />
                                                                            <span>Stoc Redus</span>
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="success" className="rounded-full">Stoc Suficient</Badge>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex space-x-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => setEditingResource(material)}
                                                                            className="rounded-full"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteResource("material", material.id)}
                                                                            className="rounded-full"
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
                                            <Button onClick={() => setIsAddingResource(true)} className="mt-4 bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                                <Plus className="mr-2 h-4 w-4" /> Adaugă Material
                                            </Button>
                                        </TabsContent>
                                        <TabsContent value="tools" className="p-6">
                                            <ScrollArea className="h-[400px] rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Nume</TableHead>
                                                            <TableHead>Cantitate</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Ultima Întreținere</TableHead>
                                                            <TableHead>Acțiuni</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {tools.map((tool) => (
                                                            <TableRow key={tool.id}>
                                                                <TableCell>{tool.name}</TableCell>
                                                                <TableCell>{tool.quantity}</TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            tool.status === "Disponibil"
                                                                                ? "success"
                                                                                : tool.status === "În folosință"
                                                                                    ? "warning"
                                                                                    : "destructive"
                                                                        }
                                                                        className="rounded-full"
                                                                    >
                                                                        {tool.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>{tool.lastMaintenance}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex space-x-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => setEditingResource(tool)}
                                                                            className="rounded-full"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteResource("tool", tool.id)}
                                                                            className="rounded-full"
                                                                        
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
                                            <Button onClick={() => setIsAddingResource(true)} className="mt-4 bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                                <Plus className="mr-2 h-4 w-4" /> Adaugă Unealtă
                                            </Button>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        

                        {selectedProject && (
                            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                                    <CardTitle className="text-2xl font-bold">Solicitare Resurse Suplimentare - {selectedProject.name}</CardTitle>
                                    <CardDescription className="text-gray-200">Trimiteți o cerere către manager pentru resurse adiționale</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Textarea
                                        placeholder="Descrieți resursele suplimentare necesare și motivul solicitării..."
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        className="min-h-[100px] rounded-xl"
                                    />
                                </CardContent>
                                <CardFooter className="bg-gray-50 rounded-b-lg">
                                    <Button onClick={handleSendRequest} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                        <Send className="mr-2 h-4 w-4" /> Trimite Solicitarea
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
    

                <Dialog open={editingResource !== null} onOpenChange={() => setEditingResource(null)}>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Editare Resursă</DialogTitle>
                            <DialogDescription>Modificați detaliile resursei</DialogDescription>
                        </DialogHeader>
                        {editingResource && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Nume
                                    </Label>
                                    <Input
                                        id="name"
                                        value={editingResource.name}
                                        onChange={(e) => setEditingResource({ ...editingResource, name: e.target.value })}
                                        className="col-span-3 rounded-full"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="quantity" className="text-right">
                                        Cantitate
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={editingResource.quantity}
                                        onChange={(e) => setEditingResource({ ...editingResource, quantity: e.target.value })}
                                        className="col-span-3 rounded-full"
                                    />
                                </div>
                                {editingResource.unit && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="unit" className="text-right">
                                            Unitate
                                        </Label>
                                        <Input
                                            id="unit"
                                            value={editingResource.unit}
                                            onChange={(e) => setEditingResource({ ...editingResource, unit: e.target.value })}
                                            className="col-span-3 rounded-full"
                                        />
                                    </div>
                                )}
                                {editingResource.threshold && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="threshold" className="text-right">
                                            Prag Minim
                                        </Label>
                                        <Input
                                            id="threshold"
                                            type="number"
                                            value={editingResource.threshold}
                                            onChange={(e) => setEditingResource({ ...editingResource, threshold: e.target.value })}
                                            className="col-span-3 rounded-full"
                                        />
                                    </div>
                                )}
                                {editingResource.status && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            Status
                                        </Label>
                                        <Select
                                            value={editingResource.status}
                                            onValueChange={(value) => setEditingResource({ ...editingResource, status: value })}
                                        >
                                            <SelectTrigger className="col-span-3 rounded-full">
                                                <SelectValue placeholder="Selectează status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Disponibil">Disponibil</SelectItem>
                                                <SelectItem value="În folosință">În folosință</SelectItem>
                                                <SelectItem value="În reparații">În reparații</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {editingResource.lastMaintenance && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="lastMaintenance" className="text-right">
                                            Ultima Întreținere
                                        </Label>
                                        <Input
                                            id="lastMaintenance"
                                            type="date"
                                            value={editingResource.lastMaintenance}
                                            onChange={(e) => setEditingResource({ ...editingResource, lastMaintenance: e.target.value })}
                                            className="col-span-3 rounded-full"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => handleEditResource(editingResource.unit ? "material" : "tool")} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                Salvează Modificările
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Adăugare Resursă Nouă</DialogTitle>
                            <DialogDescription>Introduceți detaliile noii resurse</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-name" className="text-right">
                                    Nume
                                </Label>
                                <Input
                                    id="new-name"
                                    value={newResource.name}
                                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                                    className="col-span-3 rounded-full"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-quantity" className="text-right">
                                    Cantitate
                                </Label>
                                <Input
                                    id="new-quantity"
                                    type="number"
                                    value={newResource.quantity}
                                    onChange={(e) => setNewResource({ ...newResource, quantity: e.target.value })}
                                    className="col-span-3 rounded-full"
                                />
                            </div>
                            {activeTab === "materials" && (
                                <>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="new-unit" className="text-right">
                                            Unitate
                                        </Label>
                                        <Input
                                            id="new-unit"
                                            value={newResource.unit}
                                            onChange={(e) => setNewResource({ ...newResource, unit: e.target.value })}
                                            className="col-span-3 rounded-full"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="new-threshold" className="text-right">
                                            Prag Minim
                                        </Label>
                                        <Input
                                            id="new-threshold"
                                            type="number"
                                            value={newResource.threshold}
                                            onChange={(e) => setNewResource({ ...newResource, threshold: e.target.value })}
                                            className="col-span-3 rounded-full"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => handleAddResource(activeTab === "materials" ? "material" : "tool")} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                Adaugă Resursă
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

    )
}