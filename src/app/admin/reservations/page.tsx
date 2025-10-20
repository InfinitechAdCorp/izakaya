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

interface Reservation {
  id: number
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  special_requests?: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

type ReservationStatus = "pending" | "confirmed" | "cancelled"

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
    special_requests: "",
    status: "pending" as ReservationStatus,
  })

  useEffect(() => {
    fetchReservations()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const url = editingId ? `/api/reservations/${editingId}` : "/api/reservations"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Success",
        description: editingId ? "Reservation updated successfully" : "Reservation created successfully",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 1,
        special_requests: "",
        status: "pending",
      })
      setEditingId(null)
      setIsAdding(false)
      fetchReservations()
    } catch (error) {
      console.error("Error saving reservation:", error)
      toast({
        title: "Error",
        description: "Failed to save reservation",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      })

      fetchReservations()
    } catch (error) {
      console.error("Error deleting reservation:", error)
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive",
      })
    }
  }

  function handleEdit(reservation: Reservation) {
    setFormData({
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      special_requests: reservation.special_requests || "",
      status: reservation.status,
    })
    setEditingId(reservation.id)
    setIsAdding(true)
  }

  async function fetchReservations() {
    try {
      setLoading(true)
      const response = await fetch("/api/reservations")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error("Error fetching reservations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <div className="flex-1">
        <div className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Reservations</h1>
        </div>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Reservations</h1>
            <Button
              onClick={() => {
                setIsAdding(!isAdding)
                if (isAdding) {
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    date: "",
                    time: "",
                    guests: 1,
                    special_requests: "",
                    status: "pending",
                  })
                  setEditingId(null)
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? "Cancel" : "Add Reservation"}
            </Button>
          </div>

          {isAdding && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Reservation" : "Create New Reservation"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-3 gap-4">
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
                    <Input
                      type="number"
                      placeholder="Guests"
                      min="1"
                      max="20"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guests: Number.parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <Textarea
                    placeholder="Special Requests"
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                    rows={3}
                  />
                  <Select
                    value={formData.status}
                    onValueChange={(value: ReservationStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="w-full">
                    {editingId ? "Update Reservation" : "Create Reservation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{reservation.name}</h3>
                      <p className="text-sm text-gray-600">{reservation.email}</p>
                      <p className="text-sm text-gray-600">{reservation.phone}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>
                          {reservation.date} at {reservation.time}
                        </span>
                        <span>Guests: {reservation.guests}</span>
                      </div>
                      {reservation.special_requests && (
                        <p className="text-sm mt-2">Requests: {reservation.special_requests}</p>
                      )}
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(reservation)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(reservation.id)}>
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