"use client"

import { useState } from "react"
import { Bell, Lock, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { coordinatorLinks } from "../page"

export default function SettingsAndProfile() {
    const [personalInfo, setPersonalInfo] = useState({
        name: "Ana Popescu",
        email: "ana.popescu@cleaningpro.com",
        phone: "0722123456",
        role: "Coordonator Echipă"
    })

    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    })

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: true
    })

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
    }

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    const handleNotificationChange = (type) => {
        setNotifications({ ...notifications, [type]: !notifications[type] })
    }

    const handleSavePersonalInfo = () => {
        // În practică, aici ar fi un apel API pentru a salva informațiile
        toast({
            title: "Informații personale actualizate",
            description: "Modificările au fost salvate cu succes.",
        })
    }

    const handleChangePassword = () => {
        // În practică, aici ar fi un apel API pentru a schimba parola
        if (password.new !== password.confirm) {
            toast({
                title: "Eroare",
                description: "Parolele noi nu se potrivesc.",
                variant: "destructive",
            })
            return
        }
        if (password.new.length < 8) {
            toast({
                title: "Eroare",
                description: "Noua parolă trebuie să aibă cel puțin 8 caractere.",
                variant: "destructive",
            })
            return
        }
        toast({
            title: "Parolă schimbată",
            description: "Parola dvs. a fost actualizată cu succes.",
        })
        setPassword({ current: "", new: "", confirm: "" })
    }

    const handleSaveNotifications = () => {
        // În practică, aici ar fi un apel API pentru a salva setările de notificări
        toast({
            title: "Setări de notificări actualizate",
            description: "Preferințele dvs. de notificare au fost salvate.",
        })
    }

    return (
        <DashboardLayout links={coordinatorLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Setări și Profil</h1>

                        <Tabs defaultValue="personal-info" className="space-y-4">
                            <TabsList className="bg-[#0A2747] text-white">
                                <TabsTrigger value="personal-info" className="data-[state=active]:bg-[#FAA502]">
                                    <User className="mr-2 h-4 w-4" />
                                    Informații Personale
                                </TabsTrigger>
                                <TabsTrigger value="security" className="data-[state=active]:bg-[#FAA502]">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Securitate
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="data-[state=active]:bg-[#FAA502]">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notificări
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal-info">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                        <CardTitle>Informații Personale</CardTitle>
                                        <CardDescription className="text-gray-300">Actualizați-vă datele personale și de contact</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nume Complet</Label>
                                                <Input id="name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className="rounded-md" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" name="email" type="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className="rounded-md" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Telefon</Label>
                                                <Input id="phone" name="phone" type="tel" value={personalInfo.phone} onChange={handlePersonalInfoChange} className="rounded-md" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="role">Rol</Label>
                                                <Input id="role" name="role" value={personalInfo.role} readOnly className="rounded-md bg-gray-100" />
                                            </div>
                                        </form>
                                    </CardContent>
                                    <CardFooter className="bg-gray-50 rounded-b-lg">
                                        <Button onClick={handleSavePersonalInfo} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                            Salvează Modificările
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                        <CardTitle>Securitate</CardTitle>
                                        <CardDescription className="text-gray-300">Gestionați-vă parola și setările de securitate</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Parola Curentă</Label>
                                                <Input id="current-password" name="current" type="password" value={password.current} onChange={handlePasswordChange} className="rounded-md" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">Parola Nouă</Label>
                                                <Input id="new-password" name="new" type="password" value={password.new} onChange={handlePasswordChange} className="rounded-md" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirmă Parola Nouă</Label>
                                                <Input id="confirm-password" name="confirm" type="password" value={password.confirm} onChange={handlePasswordChange} className="rounded-md" />
                                            </div>
                                        </form>
                                    </CardContent>
                                    <CardFooter className="bg-gray-50 rounded-b-lg">
                                        <Button onClick={handleChangePassword} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                            Schimbă Parola
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-lg">
                                        <CardTitle>Setări Notificări</CardTitle>
                                        <CardDescription className="text-gray-300">Gestionați preferințele de notificare</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="email-notifications">Notificări Email</Label>
                                                    <p className="text-sm text-muted-foreground">Primiți actualizări prin email despre proiecte și sarcini</p>
                                                </div>
                                                <Switch
                                                    id="email-notifications"
                                                    checked={notifications.email}
                                                    onCheckedChange={() => handleNotificationChange('email')}
                                                />
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="push-notifications">Notificări Push</Label>
                                                    <p className="text-sm text-muted-foreground">Primiți notificări push pe dispozitiv pentru actualizări urgente</p>
                                                </div>
                                                <Switch
                                                    id="push-notifications"
                                                    checked={notifications.push}
                                                    onCheckedChange={() => handleNotificationChange('push')}
                                                />
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="sms-notifications">Notificări SMS</Label>
                                                    <p className="text-sm text-muted-foreground">Primiți notificări prin SMS pentru schimbări de program</p>
                                                </div>
                                                <Switch
                                                    id="sms-notifications"
                                                    checked={notifications.sms}
                                                    onCheckedChange={() => handleNotificationChange('sms')}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-gray-50 rounded-b-lg">
                                        <Button onClick={handleSaveNotifications} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                            Salvează Preferințele
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}