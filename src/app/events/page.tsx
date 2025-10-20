"use client"

import { useEffect, useState } from "react"
import EventCard from "@/components/event-card"
import EventBookingForm from "@/components/event-booking-form"
import { Button } from "@/components/ui/button"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  capacity: number
  price: number
  image_url: string
  status: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/events`)

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()
      setEvents(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Restaurant Events</h1>
              <p className="mt-2 text-muted-foreground">Book your table for our exclusive dining experiences</p>
            </div>
            {selectedEvent && (
              <Button onClick={() => setSelectedEvent(null)} variant="outline" className="hidden sm:inline-flex">
                View All Events
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {selectedEvent ? (
          // Booking Form View
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EventBookingForm
                event={selectedEvent}
                onSuccess={() => {
                  setSelectedEvent(null)
                  fetchEvents()
                }}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Event Summary</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Event</p>
                    <p className="font-medium text-foreground">{selectedEvent.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price per Person</p>
                    <p className="text-2xl font-bold text-primary">${selectedEvent.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Capacity</p>
                    <p className="font-medium text-foreground">{selectedEvent.capacity} seats</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Events Listing View
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
                  <p className="mt-4 text-muted-foreground">Loading events...</p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                <p className="text-destructive font-medium">{error}</p>
                <Button onClick={fetchEvents} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <p className="text-lg text-muted-foreground">No events available at the moment</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} onBook={() => setSelectedEvent(event)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
