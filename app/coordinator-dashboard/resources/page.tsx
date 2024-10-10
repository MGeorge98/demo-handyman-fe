"use client"

import { useState } from "react"
import { Edit, Plus, Send, Trash } from "lucide-react"

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
    { id: 1, name: "Ciment", quantity: 100, unit: "kg" },
    { id: 2, name: "Cărămizi", quantity: 1000, unit: "buc" },
    { id: 3, name: "Vopsea lavabilă", quantity: 50, unit: "l" },
    { id: 4, name: "Gresie", quantity: 200, unit: "m²" },
    { id: 5, name: "Cabluri electrice", quantity: 500, unit: "m" },
]

const initialTools = [
    { id: 1, name: "Bormaşină", quantity: 5, status: "Disponibil" },
    { id: 2, name: "Şurubelniţă electrică", quantity: 10, status: "În folosinţă" },
    { id: 3, name: "Fierăstrău circular", quantity: 3, status: "În reparaţii" },
    { id: 4, name: "Nivelă cu laser", quantity: 2, status: "Disponibil" },
    { id: 5, name: "Compresor de aer", quantity: 1, status: "În folosinţă" },
]

export default function ResourceManagement() {
    const [materials, setMaterials] = useState(initialMaterials)
    const [tools, setTools] = useState(initialTools)
    const [editingResource, setEditingResource] = useState(null)
    const [isAddingResource, setIsAddingResource] = useState(false)
    const [newResource, setNewResource] = useState({ name: "", quantity: "", unit: "" })
    const [requestMessage, setRequestMessage] = useState("")

    const handleAddResource = (type) => {
        if (type === "material") {
            setMaterials([...materials, { ...newResource, id: materials.length + 1 }])
        } else {
            setTools([...tools, { ...newResource, id: tools.length + 1, status: "Disponibil" }])
        }
        setNewResource({ name: "", quantity: "", unit: "" })
        setIsAddingResource(false)
        toast({
            title: "Resursă adăugată",
            description: "Noua resursă a fost adăugată cu succes.",
        })
    }

    const handleEditResource = (type) => {
        if (type === "material") {
            setMaterials(materials.map(m => m.id === editingResource.id ? editingResource : m))
        } else {
            setTools(tools.map(t => t.id === editingResource.id ? editingResource : t))
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

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Gestionare Resurse</h1>

                        <Tabs defaultValue="materials">
                            <TabsList>
                                <TabsTrigger value="materials">Materiale</TabsTrigger>
                                <TabsTrigger value="tools">Unelte</TabsTrigger>
                            </TabsList>
                            <TabsContent value="materials">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Materiale Asignate</CardTitle>
                                        <CardDescription>Listă cu toate materialele necesare proiectului</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[400px]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Nume</TableHead>
                                                        <TableHead>Cantitate</TableHead>
                                                        <TableHead>Unitate</TableHead>
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
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setEditingResource(material)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteResource("material", material.id)}
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
                                    <CardFooter>
                                        <Button onClick={() => setIsAddingResource(true)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                            <Plus className="mr-2 h-4 w-4" /> Adaugă Material
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="tools">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Unelte Asignate</CardTitle>
                                        <CardDescription>Listă cu toate uneltele necesare proiectului</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[400px]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Nume</TableHead>
                                                        <TableHead>Cantitate</TableHead>
                                                        <TableHead>Status</TableHead>
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
                                                                            : tool.status === "În folosinţă"
                                                                                ? "warning"
                                                                                : "destructive"
                                                                    }
                                                                >
                                                                    {tool.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setEditingResource(tool)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteResource("tool", tool.id)}
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
                                    <CardFooter>
                                        <Button onClick={() => setIsAddingResource(true)} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                            <Plus className="mr-2 h-4 w-4" /> Adaugă Unealtă
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card>
                            <CardHeader>
                                <CardTitle>Solicitare Resurse Suplimentare</CardTitle>
                                <CardDescription>Trimiteți o cerere către manager pentru resurse adiționale</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Descrieți resursele suplimentare necesare și motivul solicitării..."
                                    value={requestMessage}
                                    onChange={(e) => setRequestMessage(e.target.value)}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSendRequest} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                    <Send className="mr-2 h-4 w-4" /> Trimite Solicitarea
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>

                <Dialog open={editingResource !== null} onOpenChange={() => setEditingResource(null)}>
                    <DialogContent>
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
                                        className="col-span-3"
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
                                        onChange={(e) => setEditingResource({ ...editingResource, quantity: parseInt(e.target.value) })}
                                        className="col-span-3"
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
                                            className="col-span-3"
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
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Selectează status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Disponibil">Disponibil</SelectItem>
                                                <SelectItem value="În folosinţă">În folosinţă</SelectItem>
                                                <SelectItem value="În reparaţii">În reparaţii</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => handleEditResource(editingResource.unit ? "material" : "tool")}>
                                Salvează Modificările
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
                    <DialogContent>
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
                                    className="col-span-3"
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
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-unit" className="text-right">
                                    Unitate
                                </Label>
                                <Input
                                    id="new-unit"
                                    value={newResource.unit}
                                    onChange={(e) => setNewResource({ ...newResource, unit: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => handleAddResource(newResource.unit ? "material" : "tool")}>
                                Adaugă Resursă
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}