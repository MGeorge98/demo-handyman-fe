"use client"

import { useState } from "react"
import { Camera, Send, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { coordinatorLinks } from "../page"

const mockProjects = [
    { id: 1, name: "Curățenie Birouri A", client: "Tech Solutions SRL" },
    { id: 2, name: "Curățenie Rezidențială B", client: "Complexul Rezidențial Green Valley" },
    { id: 3, name: "Curățenie Industrială C", client: "Fabrica de Procesare Alimente Fresh" },
]

export default function DailyReporting() {
    const [selectedProject, setSelectedProject] = useState(mockProjects[0])
    const [photos, setPhotos] = useState([])
    const [notes, setNotes] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotos([...photos, { id: Date.now(), src: reader.result, name: file.name }])
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemovePhoto = (id) => {
        setPhotos(photos.filter(photo => photo.id !== id))
    }

    const handleSubmitReport = () => {
        if (!selectedProject) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să selectați un proiect înainte de a trimite raportul.",
                variant: "destructive",
            })
            return
        }

        if (photos.length === 0) {
            toast({
                title: "Avertisment",
                description: "Nu ați încărcat nicio fotografie. Sunteți sigur că doriți să continuați?",
                variant: "warning",
            })
        }

        setShowConfirmDialog(true)
    }

    const confirmSubmitReport = () => {
        setIsSubmitting(true)
        // Simulăm trimiterea raportului
        setTimeout(() => {
            setIsSubmitting(false)
            setShowConfirmDialog(false)
            toast({
                title: "Raport trimis",
                description: "Raportul zilnic a fost trimis cu succes managerului.",
            })
            // Resetăm starea după trimitere
            setSelectedProject("")
            setPhotos([])
            setNotes("")
        }, 2000)
    }

    return (

        <div className="mx-auto max-w-4xl space-y-8">

            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <CardTitle className="text-2xl font-bold">Încărcare Fotografii</CardTitle>
                    <CardDescription className="text-gray-200">Adăugați fotografii cu stadiul actual al lucrării</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative">
                                <img src={photo.src} alt="Stadiu lucrare" className="w-full h-32 object-cover rounded-xl" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 rounded-full"
                                    onClick={() => handleRemovePhoto(photo.id)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Label htmlFor="photo-upload" className="mt-4 cursor-pointer">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl">
                            <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <Input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} />
                    </Label>
                </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <CardTitle className="text-2xl font-bold">Notițe și Observații</CardTitle>
                    <CardDescription className="text-gray-200">Adăugați detalii despre progresul zilnic al proiectului</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Textarea
                        placeholder="Introduce��i notițele și observațiile dvs. aici..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={6}
                        className="rounded-xl"
                    />
                </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <CardTitle className="text-2xl font-bold">Trimitere Raport</CardTitle>
                    <CardDescription className="text-gray-200">Revizuiți și trimiteți raportul zilnic către manager</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Rezumat Raport:</h3>
                            <p>Proiect selectat: {selectedProject ? mockProjects.find(p => p.id.toString() === selectedProject)?.name : "Niciunul"}</p>
                            <p>Fotografii încărcate: {photos.length}</p>
                            <p>Notițe adăugate: {notes ? "Da" : "Nu"}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold mb-2">Confirmare:</h3>
                            <p>Sunteți sigur că doriți să trimiteți acest raport?</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50 rounded-b-lg">
            
                </CardFooter>
            </Card>
            <Button
                        onClick={handleSubmitReport}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            "Se trimite..."
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" /> Trimite Raportul
                            </>
                        )}
                    </Button>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Confirmare Trimitere Raport</DialogTitle>
                        <DialogDescription>
                            Sunteți sigur că doriți să trimiteți acest raport zilnic?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Proiect: {mockProjects.find(p => p.id.toString() === selectedProject)?.name}</p>
                        <p>Fotografii: {photos.length}</p>
                        <p>Notițe: {notes ? "Adăugate" : "Fără notițe"}</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="rounded-full">
                            Anulează
                        </Button>
                        <Button onClick={confirmSubmitReport} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                            Confirmă Trimiterea
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}