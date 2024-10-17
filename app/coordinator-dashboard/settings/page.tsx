"use client"

import { Bell, Lock, User } from "lucide-react"
import { useState } from "react"

import { DashboardLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
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
        toast({
            title: "Informații personale actualizate",
            description: "Modificările au fost salvate cu succes.",
        })
    }

    const handleChangePassword = () => {
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
        toast({
            title: "Setări de notificări actualizate",
            description: "Preferințele dvs. de notificare au fost salvate.",
        })
    }

    return (
        <DashboardLayout links={coordinatorLinks} title="Setari">
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                                <CardTitle className="text-2xl font-bold">Setări și Profil</CardTitle>
                                <CardDescription className="text-gray-200">Gestionați-vă informațiile personale și preferințele</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Tabs defaultValue="personal-info" className="w-full">
                                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                        <TabsTrigger value="personal-info" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">
                                            <User className="mr-2 h-4 w-4" />
                                            Informații Personale
                                        </TabsTrigger>
                                        <TabsTrigger value="security" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">
                                            <Lock className="mr-2 h-4 w-4" />
                                            Securitate
                                        </TabsTrigger>
                                        <TabsTrigger value="notifications" className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:shadow">
                                            <Bell className="mr-2 h-4 w-4" />
                                            Notificări
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="personal-info" className="p-6">
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nume Complet</Label>
                                                <Input id="name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className="rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" name="email" type="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className="rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Telefon</Label>
                                                <Input id="phone" name="phone" type="tel" value={personalInfo.phone} onChange={handlePersonalInfoChange} className="rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="role">Rol</Label>
                                                <Input id="role" name="role" value={personalInfo.role} readOnly className="rounded-full bg-gray-100" />
                                            </div>
                                            <Button onClick={handleSavePersonalInfo} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                                Salvează Modificările
                                            </Button>
                                        </form>
                                    </TabsContent>

                                    <TabsContent value="security" className="p-6">
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Parola Curentă</Label>
                                                <Input id="current-password" name="current" type="password" value={password.current} onChange={handlePasswordChange} className="rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">Parola Nouă</Label>
                                                <Input id="new-password" name="new" type="password" value={password.new} onChange={handlePasswordChange} className="rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirmă Parola Nouă</Label>
                                                <Input id="confirm-password" name="confirm" type="password" value={password.confirm} onChange={handlePasswordChange} className="rounded-full" />
                                            </div>
                                            <Button onClick={handleChangePassword} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                                Schimbă Parola
                                            </Button>
                                        </form>
                                    </TabsContent>

                                    <TabsContent value="notifications" className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="email-notifications">Notificări Email</Label>
                                                    <p className="text-sm text-gray-500">Primiți actualizări prin email despre proiecte și sarcini</p>
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
                                                    <p className="text-sm text-gray-500">Primiți notificări push pe dispozitiv pentru actualizări urgente</p>
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
                                                    <p className="text-sm text-gray-500">Primiți notificări prin SMS pentru schimbări de program</p>
                                                </div>
                                                <Switch
                                                    id="sms-notifications"
                                                    checked={notifications.sms}
                                                    onCheckedChange={() => handleNotificationChange('sms')}
                                                />
                                            </div>
                                            <Button onClick={handleSaveNotifications} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full mt-4">
                                                Salvează Preferințele
                                            </Button>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}