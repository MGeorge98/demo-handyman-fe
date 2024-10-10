"use client"

import { useState } from "react"
import { Camera, FileUp, Send, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { coordinatorLinks } from "../page"

export default function DailyReporting() {
    const [photos, setPhotos] = useState([])
    const [notes, setNotes] = useState("")
    const [additionalRequest, setAdditionalRequest] = useState({ type: "", description: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotos([...photos, { id: Date.now(), src: reader.result }])
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemovePhoto = (id) => {
        setPhotos(photos.filter(photo => photo.id !== id))
    }

    const handleSubmitReport = () => {
        setIsSubmitting(true)
        // Simulăm trimiterea raportului
        setTimeout(() => {
            setIsSubmitting(false)
            toast({
                title: "Raport trimis",
                description: "Raportul zilnic a fost trimis cu succes managerului.",
            })
            // Resetăm starea după trimitere
            setPhotos([])
            setNotes("")
        }, 2000)
    }

    const handleSubmitRequest = () => {
        if (!additionalRequest.type || !additionalRequest.description) {
            toast({
                title: "Eroare",
                description: "Vă rugăm să completați toate câmpurile cererii.",
                variant: "destructive",
            })
            return
        }
        // Simulăm trimiterea cererii
        toast({
            title: "Cerere trimisă",
            description: `Cererea pentru ${additionalRequest.type} a fost trimisă managerului.`,
        })
        setAdditionalRequest({ type: "", description: "" })
    }

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Raportare Zilnică</h1>

                        <Card>
                            <CardHeader>
                                <CardTitle>Încărcare Fotografii</CardTitle>
                                <CardDescription>Adăugați fotografii cu stadiul actual al lucrării</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    {photos.map((photo) => (
                                        <div key={photo.id} className="relative">
                                            <img src={photo.src} alt="Stadiu lucrare" className="w-full h-32 object-cover rounded-md" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1"
                                                onClick={() => handleRemovePhoto(photo.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Label htmlFor="photo-upload" className="mt-4 cursor-pointer">
                                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md">
                                        <Camera className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <Input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} />
                                </Label>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notițe și Observații</CardTitle>
                                <CardDescription>Adăugați detalii despre progresul zilnic al proiectului</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Introduceți notițele și observațiile dvs. aici..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={6}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Cerere Resurse Suplimentare</CardTitle>
                                <CardDescription>Solicitați materiale, unelte sau utilaje suplimentare</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="request-type">Tip Resursă</Label>
                                        <Select
                                            value={additionalRequest.type}
                                            onValueChange={(value) => setAdditionalRequest({ ...additionalRequest, type: value })}
                                        >
                                            <SelectTrigger id="request-type">
                                                <SelectValue placeholder="Selectați tipul de resursă" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="materiale">Materiale</SelectItem>
                                                <SelectItem value="unelte">Unelte</SelectItem>
                                                <SelectItem value="utilaje">Utilaje</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="request-description">Descriere</Label>
                                        <Textarea
                                            id="request-description"
                                            placeholder="Descrieți resursele necesare și motivul solicitării..."
                                            value={additionalRequest.description}
                                            onChange={(e) => setAdditionalRequest({ ...additionalRequest, description: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSubmitRequest} className="w-full bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                    <Send className="mr-2 h-4 w-4" /> Trimite Cererea
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Trimitere Raport</CardTitle>
                                <CardDescription>Revizuiți și trimiteți raportul zilnic către manager</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Rezumat Raport:</h3>
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
                            <CardFooter>
                                <Button
                                    onClick={handleSubmitReport}
                                    className="w-full bg-[#FAA502] text-white hover:bg-[#FAA502]/90"
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
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}