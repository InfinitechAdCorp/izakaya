"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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

interface EventBookingFormProps {
  event: Event
  onSuccess: () => void
}

export default function EventBookingForm({ event, onSuccess }: EventBookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    specialRequests: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      const bookingData = {
        event_id: event.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        number_of_guests: formData.guests,
        special_requests: formData.specialRequests,
        total_price: event.price * formData.guests,
      }

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create booking")
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: 1,
        specialRequests: "",
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Booking error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-border p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Book Your Spot</h2>
        <p className="text-muted-foreground">Complete the form below to reserve your table</p>
      </div>

      {success ? (
        <div className="rounded-lg border border-primary/50 bg-primary/10 p-6 text-center">
          <div className="text-4xl mb-3">✓</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground">A confirmation email has been sent to {formData.email}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-foreground mb-2">
              Number of Guests *
            </label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Array.from({ length: event.capacity }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-foreground mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Any dietary restrictions, allergies, or special occasions?"
            />
          </div>

          {/* Price Summary */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Price per person:</span>
              <span className="font-medium text-foreground">${event.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Number of guests:</span>
              <span className="font-medium text-foreground">{formData.guests}</span>
            </div>
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total:</span>
              <span className="text-2xl font-bold text-primary">${(event.price * formData.guests).toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
          >
            {loading ? "Processing..." : "Complete Booking"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">By booking, you agree to our terms and conditions</p>
        </form>
      )}
    </Card>
  )
}
