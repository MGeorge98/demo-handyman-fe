"use client"

import { useState } from "react"
import { Bell, Globe, Lock, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout"
import { managerLinks } from "../page"

export default function SettingsAndProfile() {
    const [personalInfo, setPersonalInfo] = useState({
        name: "Ana Popescu",
        email: "ana.popescu@example.com",
        phone: "0722123456",
        bio: "Manager de proiect cu 5 ani de experiență în industria IT."
    })

    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    })

    const [notifications, setNotifications] = useState({
        email: true,
        push: false
    })

    const [preferences, setPreferences] = useState({
        language: "ro",
        theme: "light"
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

    const handlePreferenceChange = (type, value) => {
        setPreferences({ ...preferences, [type]: value })
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
        toast({
            title: "Parolă schimbată",
            description: "Parola dvs. a fost actualizată cu succes.",
        })
        setPassword({ current: "", new: "", confirm: "" })
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Setări și Profil</h1>

                        <Tabs defaultValue="personal-info">
                            <TabsList className="mb-4">
                                <TabsTrigger value="personal-info">
                                    <User className="mr-2 h-4 w-4" />
                                    Informații Personale
                                </TabsTrigger>
                                <TabsTrigger value="security">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Securitate
                                </TabsTrigger>
                                <TabsTrigger value="notifications">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notificări
                                </TabsTrigger>
                                <TabsTrigger value="preferences">
                                    <Globe className="mr-2 h-4 w-4" />
                                    Preferințe
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal-info">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informații Personale</CardTitle>
                                        <CardDescription>Actualizați-vă datele personale și de contact</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nume Complet</Label>
                                                <Input id="name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" name="email" type="email" value={personalInfo.email} onChange={handlePersonalInfoChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Telefon</Label>
                                                <Input id="phone" name="phone" type="tel" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Biografie</Label>
                                                <Textarea id="bio" name="bio" value={personalInfo.bio} onChange={handlePersonalInfoChange} />
                                            </div>
                                            <Button onClick={handleSavePersonalInfo} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                                Salvează Modificările
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Securitate</CardTitle>
                                        <CardDescription>Gestionați-vă parola și setările de securitate</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Parola Curentă</Label>
                                                <Input id="current-password" name="current" type="password" value={password.current} onChange={handlePasswordChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">Parola Nouă</Label>
                                                <Input id="new-password" name="new" type="password" value={password.new} onChange={handlePasswordChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirmă Parola Nouă</Label>
                                                <Input id="confirm-password" name="confirm" type="password" value={password.confirm} onChange={handlePasswordChange} />
                                            </div>
                                            <Button onClick={handleChangePassword} className="bg-[#FAA502] text-white hover:bg-[#FAA502]/90">
                                                Schimbă Parola
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Setări Notificări</CardTitle>
                                        <CardDescription>Gestionați preferințele de notificare</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="email-notifications">Notificări Email</Label>
                                                    <p className="text-sm text-muted-foreground">Primiți actualizări prin email</p>
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
                                                    <p className="text-sm text-muted-foreground">Primiți notificări push pe dispozitiv</p>
                                                </div>
                                                <Switch
                                                    id="push-notifications"
                                                    checked={notifications.push}
                                                    onCheckedChange={() => handleNotificationChange('push')}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="preferences">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preferințe</CardTitle>
                                        <CardDescription>Personalizați experiența dvs. în aplicație</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Limbă</Label>
                                                <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                                                    <SelectTrigger id="language">
                                                        <SelectValue placeholder="Selectați limba" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ro">Română</SelectItem>
                                                        <SelectItem value="en">English</SelectItem>
                                                        <SelectItem value="fr">Français</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="theme">Temă</Label>
                                                <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                                                    <SelectTrigger id="theme">
                                                        <SelectValue placeholder="Selectați tema" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="light">Luminos</SelectItem>
                                                        <SelectItem value="dark">Întunecat</SelectItem>
                                                        <SelectItem value="system">Sistem</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    )
}