"use client"

import { useState } from "react"
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
    const [materials, setMaterials] = useState(initialMaterials)
    const [tools, setTools] = useState(initialTools)
    const [editingResource, setEditingResource] = useState(null)
    const [isAddingResource, setIsAddingResource] = useState(false)
    const [newResource, setNewResource] = useState({ name: "", quantity: "", unit: "", threshold: "" })
    const [requestMessage, setRequestMessage] = useState("")
    const [activeTab, setActiveTab] = useState("materials")

    const handleAddResource = (type) => {
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
        // În practică, aici ar fi un apel API pentru a trimite cererea
        toast({
            title: "Cerere trimisă",
            description: "Cererea pentru resurse suplimentare a fost trimisă managerului.",
        })
        setRequestMessage("")
    }

    const isLowStock = (material) => material.quantity <= material.threshold

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Gestionare Resurse</h1>

                        <Tabs defaultValue="materials" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted p-1">
                                <TabsTrigger value="materials" className="rounded-md">Materiale</TabsTrigger>
                                <TabsTrigger value="tools" className="rounded-md">Unelte</TabsTrigger>
                            </TabsList>
                            <TabsContent value="materials">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                        <CardTitle>Materiale Asignate</CardTitle>
                                        <CardDescription className="text-gray-300">Listă cu toate materialele necesare proiectului</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
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
                                                                    <Badge variant="destructive" className="flex items-center space-x-1">
                                                                        <AlertTriangle className="h-4 w-4" />
                                                                        <span>Stoc Redus</span>
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="success">Stoc Suficient</Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setEditingResource(material)}
                                                                        className="rounded-md"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteResource("material", material.id)}
                                                                        className="rounded-md"
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
                                    <CardFooter className="bg-gray-50 rounded-b-lg">
                                        <Button onClick={() => setIsAddingResource(true)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                            <Plus className="mr-2 h-4 w-4" /> Adaugă Material
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="tools">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                        <CardTitle>Unelte Asignate</CardTitle>
                                        <CardDescription className="text-gray-300">Listă cu toate uneltele necesare proiectului</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
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
                                                                        className="rounded-md"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteResource("tool", tool.id)}
                                                                        className="rounded-md"
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
                                    <CardFooter className="bg-gray-50 rounded-b-lg">
                                        <Button onClick={() => setIsAddingResource(true)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                            <Plus className="mr-2 h-4 w-4" /> Adaugă Unealtă
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                <CardTitle>Solicitare Resurse Suplimentare</CardTitle>
                                <CardDescription className="text-gray-300">Trimiteți o cerere către manager pentru resurse adiționale</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Textarea
                                    placeholder="Descrieți resursele suplimentare necesare și motivul solicitării..."
                                    value={requestMessage}
                                    onChange={(e) => setRequestMessage(e.target.value)}
                                    className="min-h-[100px] rounded-md"
                                />
                            </CardContent>
                            <CardFooter className="bg-gray-50 rounded-b-lg">
                                <Button onClick={handleSendRequest} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                    <Send className="mr-2 h-4 w-4" /> Trimite Solicitarea
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>

                <Dialog open={editingResource !== null} onOpenChange={() => setEditingResource(null)}>
                    <DialogContent className="sm:max-w-[425px] rounded-lg">
                        <DialogHeader>
                            <DialogTitle>Editare  Resursă</DialogTitle>
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
                                        className="col-span-3 rounded-md"
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
                                        className="col-span-3 rounded-md"
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
                                            className="col-span-3 rounded-md"
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
                                            className="col-span-3 rounded-md"
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
                                            <SelectTrigger className="col-span-3 rounded-md">
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
                                            className="col-span-3 rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => handleEditResource(editingResource.unit ? "material" : "tool")} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                Salvează Modificările
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
                    <DialogContent className="sm:max-w-[425px] rounded-lg">
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
                                    className="col-span-3 rounded-md"
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
                                    className="col-span-3 rounded-md"
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
                                            className="col-span-3 rounded-md"
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
                                            className="col-span-3 rounded-md"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => handleAddResource(activeTab === "materials" ? "material" : "tool")} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                Adaugă Resursă
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}