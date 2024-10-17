"use client"

import { useState, useCallback, useMemo } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter, Plus, Edit, Trash } from "lucide-react"
import { DashboardLayout } from '@/components/layout'
import { managerLinks } from '../page'
// import { DatePicker } from "@/components/ui/date-picker"

const localizer = momentLocalizer(moment)

const services = [
    'Întreținere Spații Verzi',
    'Merchandising',
    'Alpinism Utilitar',
    'Dezinfecție',
    'Deratizare',
    'Dezinsecție',
    'Curățenie Interioară',
    'Curățenie Exterioară',
    'Operațiuni Sezon Rece'
]

const employees = [
    { id: 1, name: "Ana Popescu", role: "Specialist Curățenie", skills: ["Curățenie Interioară", "Curățenie Exterioară"], availability: "Disponibil", color: "#34C759" },
    { id: 2, name: "Mihai Ionescu", role: "Tehnician DDD", skills: ["Dezinfecție", "Deratizare", "Dezinsecție"], availability: "Parțial disponibil", color: "#FF9500" },
    { id: 3, name: "Elena Dumitrescu", role: "Specialist Spații Verzi", skills: ["Întreținere Spații Verzi"], availability: "Disponibil", color: "#007AFF" },
    { id: 4, name: "Alexandru Popa", role: "Alpinist Utilitar", skills: ["Alpinism Utilitar"], availability: "Indisponibil", color: "#FF3B30" },
    { id: 5, name: "Maria Stancu", role: "Merchandiser", skills: ["Merchandising"], availability: "Disponibil", color: "#5856D6" }
]

const generateMockData = () => {
    const mockData = []
    const startDate = new Date()
    for (let i = 0; i < 30; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        const numEvents = Math.floor(Math.random() * 4) + 2
        for (let j = 0; j < numEvents; j++) {
            const startHour = Math.floor(Math.random() * 8) + 8 // 8 AM to 4 PM
            const employee = employees[Math.floor(Math.random() * employees.length)]
            const service = employee.skills[Math.floor(Math.random() * employee.skills.length)]
            mockData.push({
                id: mockData.length + 1,
                title: `${service} - ${employee.name}`,
                start: new Date(date.setHours(startHour, 0, 0, 0)),
                end: new Date(date.setHours(startHour + 2, 0, 0, 0)),
                service: service,
                employee: employee
            })
        }
    }
    return mockData
}

const initialEvents = generateMockData()

export default function HandymanCalendar() {
    const [events, setEvents] = useState(initialEvents)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [filters, setFilters] = useState({ service: 'all', employee: 'all', project: 'all', date: null })
    const [isEditMode, setIsEditMode] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState(Views.MONTH)

    const filteredEvents = useMemo(() => {
        return events.filter(event =>
            (filters.service === 'all' || event.service === filters.service) &&
            (filters.employee === 'all' || event.employee.id === parseInt(filters.employee)) &&
            (filters.project === 'all' || event.project === filters.project) &&
            (!filters.date || moment(event.start).isSame(filters.date, 'day'))
        )
    }, [events, filters])

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event)
        setIsEditMode(false)
    }, [])

    const handleSelectSlot = useCallback((slotInfo) => {
        setSelectedSlot(slotInfo)
        setIsAddModalOpen(true)
    }, [])

    const handleAddEvent = (newEvent) => {
        setEvents([...events, { ...newEvent, id: events.length + 1 }])
        setIsAddModalOpen(false)
    }

    const handleUpdateEvent = (updatedEvent) => {
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event))
        setSelectedEvent(null)
        setIsEditMode(false)
    }

    const handleDeleteEvent = (eventId) => {
        setEvents(events.filter(event => event.id !== eventId))
        setSelectedEvent(null)
    }

    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: event.employee.color,
            borderRadius: '8px',
            opacity: 0.8,
            color: 'white',
            border: 'none',
            display: 'block'
        }
        return {
            style: style
        }
    }

    const onNavigate = (newDate) => {
        setCurrentDate(newDate)
    }

    const onView = (newView) => {
        setCurrentView(newView)
    }

    return (
        <DashboardLayout links={managerLinks} title='Calendar'>
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                <main className="flex-1 p-6">
                    <Card className="mb-6 border-none shadow-md rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-200 px-6 py-4">
                    <CardTitle className="text-xl font-semibold text-gray-900">Calendar Programări</CardTitle>
                            <CardDescription className="text-sm text-gray-500">Gestionează și vizualizează detaliile programărilor</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className='w-full flex flex-wrap gap-4 mb-6'>
                            <Select onValueChange={(value) => setFilters({ ...filters, project: value })}>
                                    <SelectTrigger className="w-[200px] rounded-full">
                                        <SelectValue placeholder="Filtru Proiect" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toate Proiectele</SelectItem>
                                        {/* Add project options here */}
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(value) => setFilters({ ...filters, service: value })}>
                                    <SelectTrigger className="w-[200px] rounded-full">
                                        <SelectValue placeholder="Filtru Echipa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toate Echipele</SelectItem>
                                        {services.map(service => (
                                            <SelectItem key={service} value={service}>{service}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={(value) => setFilters({ ...filters, employee: value })}>
                                    <SelectTrigger className="w-[200px] rounded-full">
                                        <SelectValue placeholder="Filtru Angajat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toți Angajații</SelectItem>
                                        {employees.map(employee => (
                                            <SelectItem key={employee.id} value={employee.id.toString()}>{employee.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                          

                                {/* <DatePicker
                                    selected={filters.date}
                                    onSelect={(date) => setFilters({ ...filters, date })}
                                    placeholderText="Selectează data"
                                    className="w-[200px] rounded-full"
                                /> */}
                                <Input
                                    id="start"
                                    name="start"
                                    type="date"
                                    // value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                                    // onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                                    required
                                    className="rounded-full w-[140px]"
                                />
                                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                            <Plus className="mr-2 h-4 w-4" /> Adaugă Programare
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Adaugă Programare Nouă</DialogTitle>
                                        </DialogHeader>
                                        <EventForm onSubmit={handleAddEvent} initialDate={selectedSlot?.start} />
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className='w-full' style={{ height: '600px' }}>
                                <Calendar
                                    localizer={localizer}
                                    events={filteredEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    onSelectEvent={handleSelectEvent}
                                    onSelectSlot={handleSelectSlot}
                                    selectable
                                    views={['month', 'week', 'day']}
                                    defaultView={Views.MONTH}
                                    view={currentView}
                                    onView={onView}
                                    date={currentDate}
                                    onNavigate={onNavigate}
                                    eventPropGetter={eventStyleGetter}
                                    components={{
                                        toolbar: CustomToolbar,
                                    }}
                                    popup
                                    messages={{
                                        showMore: (total) => `+ Vezi alte ${total} programări`,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {selectedEvent && (
                        <Dialog open={!!selectedEvent} onOpenChange={() => { setSelectedEvent(null); setIsEditMode(false); }}>
                            <DialogContent className="rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle>{isEditMode ? "Editează Programare" : "Detalii Programare"}</DialogTitle>
                                </DialogHeader>
                                {isEditMode ? (
                                    <EventForm event={selectedEvent} onSubmit={handleUpdateEvent} />
                                ) : (
                                    <EventDetails event={selectedEvent} />
                                )}
                                <DialogFooter>
                                    {!isEditMode && (
                                        <>
                                            <Button onClick={() => setIsEditMode(true)} className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                                                <Edit className="mr-2 h-4 w-4" /> Editează
                                            </Button>
                                            <Button onClick={() => handleDeleteEvent(selectedEvent.id)} variant="destructive" className="rounded-full">
                                                <Trash className="mr-2 h-4 w-4" /> Șterge
                                            </Button>
                                        </>
                                    )}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </main>
            </div>
        </DashboardLayout>
    )
}

function EventForm({ onSubmit, event, initialDate }) {
    const [formData, setFormData] = useState(event || {
        title: '',
        start: initialDate || new Date(),
        end: initialDate ? new Date(initialDate.getTime() + 2 * 60 * 60 * 1000) : new Date(new Date().setHours(new Date().getHours() + 2)),
        service: '',
        employee: null,
        project: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="service">Serviciu</Label>
                <Select name="service" value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                    <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Selectează Serviciul" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map(service => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="employee">Angajat</Label>
                <Select name="employee" value={formData.employee?.id.toString()} onValueChange={(value) => setFormData({ ...formData, employee: employees.find(emp => emp.id === parseInt(value)) })}>
                    <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Selectează Angajatul" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map(employee => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>{employee.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="project">Proiect</Label>
                <Input
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="rounded-full"
                    placeholder="Introduceți numele proiectului"
                />
            </div>

            <div>
                <Label htmlFor="start">Data și Ora Început</Label>
                <Input
                    id="start"
                    name="start"
                    type="datetime-local"
                    value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                    required
                    className="rounded-full"
                />
            </div>
            <div>
                <Label htmlFor="end">Data și Ora Sfârșit</Label>
                <Input
                    id="end"
                    name="end"
                    type="datetime-local"
                    value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
                    required
                    className="rounded-full"
                />
            </div>
            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full w-full">
                {event ? 'Actualizează Programare' : 'Adaugă Programare'}
            </Button>
        </form>
    )
}

function EventDetails({ event }) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="font-bold">Serviciu</Label>
                <p>{event.service}</p>
            </div>
            <div>
                <Label className="font-bold">Angajat</Label>
                <p>{event.employee.name}</p>
            </div>
            <div>
                <Label className="font-bold">Rol</Label>
                <p>{event.employee.role}</p>
            </div>
            <div>
                <Label className="font-bold">Proiect</Label>
                <p>{event.project || 'N/A'}</p>
            </div>
            <div>
                <Label className="font-bold">Data și Ora Început</Label>
                <p>{moment(event.start).format('DD/MM/YYYY HH:mm')}</p>
            </div>
            <div>
                <Label className="font-bold">Data și Ora Sfârșit</Label>
                <p>{moment(event.end).format('DD/MM/YYYY HH:mm')}</p>
            </div>
            <div>
                <Label className="font-bold">Disponibilitate</Label>
                <Badge
                    variant={
                        event.employee.availability === "Disponibil"
                            ? "success"
                            : event.employee.availability === "Parțial disponibil"
                                ? "warning"
                                : "destructive"
                    }
                    className="rounded-full"
                >
                    {event.employee.availability}
                </Badge>
            </div>
        </div>
    )
}

function CustomToolbar({ date, onNavigate, onView, view }) {
    const goToBack = () => {
        onNavigate('PREV')
    }

    const goToNext = () => {
        onNavigate('NEXT')
    }

    const goToCurrent = () => {
        onNavigate('TODAY')
    }

    const label = () => {
        const dateObj = moment(date)
        return (
            <span className="text-lg font-semibold">{dateObj.format('MMMM YYYY')}</span>
        )
    }

    return (
        <div className="flex justify-between items-center mb-4">
            <div>
                <Button onClick={goToBack} variant="outline" className="mr-2 rounded-full">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Anterioră
                </Button>
                <Button onClick={goToNext} variant="outline" className="mr-2 rounded-full">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Următore
                </Button>
                <Button onClick={goToCurrent} variant="outline" className="rounded-full">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Astăzi
                </Button>
            </div>
            <div>{label()}</div>
            <div>

                <Select
                    value={view}
                    onValueChange={onView}
                >
                    <SelectTrigger className="w-[120px] rounded-full">
                        <SelectValue placeholder="Selectează vizualizarea" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="month">Lună</SelectItem>
                        <SelectItem value="week">Săptămână</SelectItem>
                        <SelectItem value="day">Zi</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}