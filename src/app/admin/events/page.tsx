"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, Plus } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  capacity: number
  price: number
  image_url?: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  created_at: string
}

type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled"

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    capacity: 100,
    price: 0,
    image: null as File | null,
    status: "upcoming" as EventStatus,
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("description", formData.description)
      form.append("date", formData.date)
      form.append("time", formData.time)
      form.append("capacity", formData.capacity.toString())
      form.append("price", formData.price.toString())
      form.append("status", formData.status)
      if (formData.image) {
        form.append("image", formData.image)
      }

      const url = editingId ? `/api/events/${editingId}` : "/api/events"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: form,
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Success",
        description: editingId ? "Event updated successfully" : "Event created successfully",
      })

      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        capacity: 100,
        price: 0,
        image: null,
        status: "upcoming",
      })
      setEditingId(null)
      setIsAdding(false)
      fetchEvents()
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Event deleted successfully",
      })

      fetchEvents()
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  function handleEdit(event: Event) {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      capacity: event.capacity,
      price: event.price,
      image: null,
      status: event.status,
    })
    setEditingId(event.id)
    setIsAdding(true)
  }

  async function fetchEvents() {
    try {
      setLoading(true)
      const response = await fetch("/api/events")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <div className="flex-1">
        <div className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Events</h1>
        </div>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Events</h1>
            <Button
              onClick={() => {
                setIsAdding(!isAdding)
                if (isAdding) {
                  setFormData({
                    title: "",
                    description: "",
                    date: "",
                    time: "",
                    capacity: 100,
                    price: 0,
                    image: null,
                    status: "upcoming",
                  })
                  setEditingId(null)
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? "Cancel" : "Add Event"}
            </Button>
          </div>

          {isAdding && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Event" : "Create New Event"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      type="number"
                      placeholder="Capacity"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacity: Number.parseInt(e.target.value),
                        })
                      }
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number.parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                    <Select
                      value={formData.status}
                      onValueChange={(value: EventStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files?.[0] || null,
                      })
                    }
                  />
                  <Button type="submit" className="w-full">
                    {editingId ? "Update Event" : "Create Event"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {event.date} at {event.time}
                      </p>
                      <p className="text-sm mt-2">{event.description}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>Capacity: {event.capacity}</span>
                        <span>Price: ${event.price}</span>
                      </div>
                      {event.image_url && (
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-32 h-32 object-cover mt-2 rounded"
                        />
                      )}
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                          event.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : event.status === "ongoing"
                              ? "bg-green-100 text-green-800"
                              : event.status === "completed"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}