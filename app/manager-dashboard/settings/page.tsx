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
        toast({
            title: "Parolă schimbată",
            description: "Parola dvs. a fost actualizată cu succes.",
        })
        setPassword({ current: "", new: "", confirm: "" })
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="flex min-h-screen w-full flex-col bg-[#F4F7FA]">
                <main className="flex-1 p-6 md:p-8">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <h1 className="text-3xl font-bold text-[#0A2747]">Setări și Profil</h1>

                        <Tabs defaultValue="personal-info" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 rounded-lg bg-muted p-1">
                                <TabsTrigger value="personal-info" className="rounded-md">
                                    <User className="mr-2 h-4 w-4" />
                                    Informații Personale
                                </TabsTrigger>
                                <TabsTrigger value="security" className="rounded-md">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Securitate
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="rounded-md">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notificări
                                </TabsTrigger>
                                <TabsTrigger value="preferences" className="rounded-md">
                                    <Globe className="mr-2 h-4 w-4" />
                                    Preferințe
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal-info">
                                <Card className="border-none shadow-md rounded-xl">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-xl">
                                        <CardTitle>Informații Personale</CardTitle>
                                        <CardDescription className="text-gray-300">Actualizați-vă datele personale și de contact</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
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
                                                <Label htmlFor="bio">Biografie</Label>
                                                <Textarea id="bio" name="bio" value={personalInfo.bio} onChange={handlePersonalInfoChange} className="rounded-md" />
                                            </div>
                                            <Button onClick={handleSavePersonalInfo} className="w-full bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                                Salvează Modificările
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security">
                                <Card className="border-none shadow-md rounded-xl">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-xl">
                                        <CardTitle>Securitate</CardTitle>
                                        <CardDescription className="text-gray-300">Gestionați-vă parola și setările de securitate</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
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
                                            <Button onClick={handleChangePassword} className="w-full bg-[#FAA502] text-white hover:bg-[#FAA502]/90 rounded-md">
                                                Schimbă Parola
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications">
                                <Card className="border-none shadow-md rounded-xl">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-xl">
                                        <CardTitle>Setări Notificări</CardTitle>
                                        <CardDescription className="text-gray-300">Gestionați preferințele de notificare</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
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
                                <Card className="border-none shadow-md rounded-xl">
                                    <CardHeader className="bg-[#0A2747] text-white rounded-t-xl">
                                        <CardTitle>Preferințe</CardTitle>
                                        <CardDescription className="text-gray-300">Personalizați experiența dvs. în aplicație</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Limbă</Label>
                                                <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                                                    <SelectTrigger id="language" className="rounded-md">
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
                                                    <SelectTrigger id="theme" className="rounded-md">
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