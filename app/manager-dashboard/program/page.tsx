"use client"

import React, { useState } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, addMonths, startOfMonth, endOfMonth, isSameMonth, isSameDay, parseISO, isWithinInterval, addDays, subDays } from 'date-fns'
import { ro } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Clock, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from '@/components/layout'
import { managerLinks } from '../page'

type Team = {
    id: string;
    name: string;
    skills: string[];
    color: string;
}

type Activity = {
    id: string;
    projectId: string;
    teamId: string;
    date: string;
    startTime: string;
    endTime: string;
}

type Project = {
    id: string;
    name: string;
    teamId: string;
    start: string;
    end: string;
}

const teams: Team[] = [
    { id: '1', name: 'Echipa Alpha', skills: ['Construcții', 'Electricitate'], color: '#FAA502' },
    { id: '2', name: 'Echipa Beta', skills: ['Instalații', 'Finisaje'], color: '#4CAF50' },
    { id: '3', name: 'Echipa Gamma', skills: ['Design', 'Proiectare'], color: '#2196F3' },
]

const initialProjects: Project[] = [
    { id: '1', name: 'Proiect A', teamId: '1', start: '2024-03-01', end: '2024-03-15' },
    { id: '2', name: 'Proiect B', teamId: '2', start: '2024-03-05', end: '2024-03-20' },
    { id: '3', name: 'Proiect C', teamId: '3', start: '2024-03-10', end: '2024-03-25' },
]

const initialActivities: Activity[] = [
    { id: '1', projectId: '1', teamId: '1', date: '2024-03-01', startTime: '09:00', endTime: '17:00' },
    { id: '2', projectId: '1', teamId: '1', date: '2024-03-02', startTime: '09:00', endTime: '17:00' },
    { id: '3', projectId: '2', teamId: '2', date: '2024-03-05', startTime: '08:00', endTime: '16:00' },
    { id: '4', projectId: '2', teamId: '2', date: '2024-03-06', startTime: '08:00', endTime: '16:00' },
    { id: '5', projectId: '3', teamId: '3', date: '2024-03-10', startTime: '10:00', endTime: '18:00' },
    { id: '6', projectId: '3', teamId: '3', date: '2024-03-11', startTime: '10:00', endTime: '18:00' },
]

export default function CalendarInteractivEchipeImbunatatit() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
    const [projects, setProjects] = useState<Project[]>(initialProjects)
    const [activities, setActivities] = useState<Activity[]>(initialActivities)
    const [view, setView] = useState<'day' | 'week' | 'month'>('week')
    const [notifications, setNotifications] = useState<boolean>(true)

    const handlePrevious = () => {
        if (view === 'day') setCurrentDate(prev => subDays(prev, 1))
        if (view === 'week') setCurrentDate(prev => addWeeks(prev, -1))
        if (view === 'month') setCurrentDate(prev => addMonths(prev, -1))
    }

    const handleNext = () => {
        if (view === 'day') setCurrentDate(prev => addDays(prev, 1))
        if (view === 'week') setCurrentDate(prev => addWeeks(prev, 1))
        if (view === 'month') setCurrentDate(prev => addMonths(prev, 1))
    }

    const filteredProjects = projects.filter(project =>
        (!selectedTeam || project.teamId === selectedTeam) &&
        (!selectedSkill || teams.find(t => t.id === project.teamId)?.skills.includes(selectedSkill))
    )

    const getDaysToRender = () => {
        if (view === 'day') return [currentDate]
        if (view === 'week') return eachDayOfInterval({ start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) })
        return eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })
    }

    const updateActivity = (updatedActivity: Activity) => {
        setActivities(activities.map(a => a.id === updatedActivity.id ? updatedActivity : a))
    }

    const addActivity = (newActivity: Omit<Activity, 'id'>) => {
        const activityWithId = { ...newActivity, id: (activities.length + 1).toString() }
        setActivities([...activities, activityWithId])
    }

    const deleteActivity = (activityId: string) => {
        setActivities(activities.filter(a => a.id !== activityId))
    }

    return (
        <DashboardLayout links={managerLinks}>
            <div className="min-h-screen bg-[#F4F7FA] p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Calendar și Activitate Echipe</h1>

                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div className="flex items-center space-x-2">
                        <Button onClick={handlePrevious}><ChevronLeft /></Button>
                        <span className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy', { locale: ro })}</span>
                        <Button onClick={handleNext}><ChevronRight /></Button>
                        {view === 'day' && (
                            <>
                                <Button onClick={() => setCurrentDate(prev => subDays(prev, 1))} variant="outline" size="sm">
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Ziua anterioară
                                </Button>
                                <Button onClick={() => setCurrentDate(prev => addDays(prev, 1))} variant="outline" size="sm">
                                    Ziua următoare
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </>
                        )}
                    </div>
                    <Tabs value={view} onValueChange={(v) => setView(v as 'day' | 'week' | 'month')}>
                        <TabsList>
                            <TabsTrigger value="day">Zi</TabsTrigger>
                            <TabsTrigger value="week">Săptămână</TabsTrigger>
                            <TabsTrigger value="month">Lună</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Select onValueChange={(value) => setSelectedTeam(value === 'all' ? null : value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrează după echipă" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate echipele</SelectItem>
                            {teams.map(team => (
                                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setSelectedSkill(value === 'all' ? null : value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrează după competență" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate competențele</SelectItem>
                            {Array.from(new Set(teams.flatMap(t => t.skills))).map(skill => (
                                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="notifications"
                            checked={notifications}
                            onCheckedChange={setNotifications}
                        />
                        <Label htmlFor="notifications">Notificări</Label>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <CalendarGrid
                            days={getDaysToRender()}
                            view={view}
                            projects={filteredProjects}
                            activities={activities}
                            teams={teams}
                            onUpdateActivity={updateActivity}
                            onAddActivity={addActivity}
                            onDeleteActivity={deleteActivity}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

function CalendarGrid({
    days,
    view,
    projects,
    activities,
    teams,
    onUpdateActivity,
    onAddActivity,
    onDeleteActivity
}: {
    days: Date[];
    view: 'day' | 'week' | 'month';
    projects: Project[];
    activities: Activity[];
    teams: Team[];
    onUpdateActivity: (activity: Activity) => void;
    onAddActivity: (activity: Omit<Activity, 'id'>) => void;
    onDeleteActivity: (activityId: string) => void;
}) {
    const gridCols = view === 'month' ? 'grid-cols-7' : view === 'week' ? 'grid-cols-7' : 'grid-cols-1'

    return (
        <div className={`grid ${gridCols} gap-px bg-gray-200`}>
            {days.map(day => (
                <CalendarDay
                    key={day.toString()}
                    day={day}
                    view={view}
                    projects={projects}
                    activities={activities}
                    teams={teams}
                    onUpdateActivity={onUpdateActivity}
                    onAddActivity={onAddActivity}
                    onDeleteActivity={onDeleteActivity}
                />
            ))}
        </div>
    )
}

function CalendarDay({
    day,
    view,
    projects,
    activities,
    teams,
    onUpdateActivity,
    onAddActivity,
    onDeleteActivity
}: {
    day: Date;
    view: 'day' | 'week' | 'month';
    projects: Project[];
    activities: Activity[];
    teams: Team[];
    onUpdateActivity: (activity: Activity) => void;
    onAddActivity: (activity: Omit<Activity, 'id'>) => void;
    onDeleteActivity: (activityId: string) => void;
}) {
    const dayActivities = activities.filter(activity => activity.date === format(day, 'yyyy-MM-dd'))
    const isToday = isSameDay(day, new Date())
    const isCurrentMonth = isSameMonth(day, new Date())

    return (
        <div className={`bg-white p-2 ${view === 'month' ? 'h-48' : 'h-[600px]'} overflow-y-auto`}>
            <div className="flex justify-between items-center mb-2">
                <div className={`font-semibold ${isToday ? 'text-blue-600' : ''} ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                    {format(day, view === 'month' ? 'd' : 'EEE d', { locale: ro })}
                    {view === 'month' && (
                        <div className="text-xs text-gray-500">{format(day, 'EEEE', { locale: ro })}</div>
                    )}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Editează Activitățile pentru {format(day, 'd MMMM yyyy', { locale: ro })}</DialogTitle>
                        </DialogHeader>
                        <DayEditForm
                            day={day}
                            activities={dayActivities}
                            projects={projects}
                            teams={teams}
                            onUpdateActivity={onUpdateActivity}
                            onAddActivity={onAddActivity}
                            onDeleteActivity={onDeleteActivity}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="space-y-1">
                {teams.map(team => (
                    <TeamDaySchedule
                        key={team.id}
                        team={team}
                        activities={dayActivities.filter(a => a.teamId === team.id)}
                        projects={projects}
                    />
                ))}
            </div>
        </div>
    )
}

function TeamDaySchedule({ team, activities, projects }: { team: Team, activities: Activity[], projects: Project[] }) {
    return (
        <div className="text-xs">
            <div className="font-semibold" style={{ color: team.color }}>{team.name}</div>
            {activities.length > 0 ? (
                activities.map(activity => {
                    const project = projects.find(p => p.id === activity.projectId)
                    return (
                        <div key={activity.id} className="flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{activity.startTime} - {activity.endTime}</span>
                            <span className="ml-1 truncate">{project?.name}</span>
                        </div>
                    )
                })
            ) : (
                <div className="text-gray-500 mt-1">Nicio activitate programată</div>
            )}
        </div>
    )
}

function DayEditForm({
    day,
    activities,
    projects,
    teams,
    onUpdateActivity,
    onAddActivity,
    onDeleteActivity
}: {
    day: Date,
    activities: Activity[],
    projects: Project[],
    teams: Team[],
    onUpdateActivity: (activity: Activity) => void,
    onAddActivity: (activity: Omit<Activity, 'id'>) => void,
    onDeleteActivity: (activityId: string) => void
}) {
    const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
        projectId: '',
        teamId: '',
        date: format(day, 'yyyy-MM-dd'),
        startTime: '',
        endTime: ''
    })

    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault()
        onAddActivity(newActivity)
        setNewActivity({
            projectId: '',
            teamId: '',
            date: format(day, 'yyyy-MM-dd'),
            startTime: '',
            endTime: ''
        })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Activități existente</h3>
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <ActivityEditItem
                            key={activity.id}
                            activity={activity}
                            projects={projects}
                            teams={teams}
                            onUpdateActivity={onUpdateActivity}
                            onDeleteActivity={onDeleteActivity}
                        />
                    ))
                ) : (
                    <p>Nu există activități programate pentru această zi.</p>
                )}
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Adaugă activitate nouă</h3>
                <form onSubmit={handleAddActivity} className="space-y-4">
                    <Select onValueChange={(value) => setNewActivity({ ...newActivity, teamId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selectează echipa" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams.map(team => (
                                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setNewActivity({ ...newActivity, projectId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selectează proiectul" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map(project => (
                                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <Label htmlFor="startTime">Ora început</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={newActivity.startTime}
                                onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="endTime">Ora sfârșit</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={newActivity.endTime}
                                onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit">Adaugă Activitate</Button>
                </form>
            </div>
        </div>
    )
}

function ActivityEditItem({
    activity,
    projects,
    teams,
    onUpdateActivity,
    onDeleteActivity
}: {
    activity: Activity,
    projects: Project[],
    teams: Team[],
    onUpdateActivity: (activity: Activity) => void,
    onDeleteActivity: (activityId: string) => void
}) {
    const [editedActivity, setEditedActivity] = useState(activity)

    const handleUpdate = () => {
        onUpdateActivity(editedActivity)
    }

    return (
        <div className="flex items-center space-x-2">
            <Select value={editedActivity.teamId} onValueChange={(value) => setEditedActivity({ ...editedActivity, teamId: value })}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Echipa" />
                </SelectTrigger>
                <SelectContent>
                    {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={editedActivity.projectId} onValueChange={(value) => setEditedActivity({ ...editedActivity, projectId: value })}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Proiect" />
                </SelectTrigger>
                <SelectContent>
                    {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                type="time"
                value={editedActivity.startTime}
                onChange={(e) => setEditedActivity({ ...editedActivity, startTime: e.target.value })}
                className="w-24"
            />
            <Input
                type="time"
                value={editedActivity.endTime}
                onChange={(e) => setEditedActivity({ ...editedActivity, endTime: e.target.value })}
                className="w-24"
            />
            <Button onClick={handleUpdate} size="sm">Actualizează</Button>
            <Button onClick={() => onDeleteActivity(activity.id)} variant="destructive" size="sm">Șterge</Button>
        </div>
    )
}