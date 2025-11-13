"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Booking = {
  id: number
  userId: number
  destinationId: number
  hotel: string
  hotelStatus: string
  hotelPaymentId: number
  flight: string
  flightStatus: string
  flightPaymentId: number
  createdAt: string
}

export function PreviousBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)

        const userId = localStorage.getItem("userId")
        const token = localStorage.getItem("authToken")

        if (!userId || !token) {
          setError("Please login to view bookings.")
          setLoading(false)
          return
        }

        // 🔥 Fetch from YOUR REAL backend
        const res = await fetch(`http://localhost:8090/api/itinerary/history/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to load bookings")

        const data = await res.json()
        setBookings(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) return <p className="text-center py-6">Loading bookings...</p>
  if (error) return <p className="text-center text-destructive py-6">{error}</p>

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Previous Bookings</h2>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No bookings found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <Card
              key={b.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedBooking(b)}
            >
              <CardHeader>
                <CardTitle>Booking #{b.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Hotel:</strong> {b.hotel}</p>
                <p><strong>Hotel Amount:</strong> ${b.hotelPaymentId}</p>
                <p><strong>Flight:</strong> {b.flight}</p>
                <p><strong>Flight Amount:</strong> ${b.flightPaymentId}</p>
                
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🔥 Popup with full details */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <p><strong>Hotel:</strong> {selectedBooking.hotel}</p>
                <p><strong>Hotel Status:</strong> {selectedBooking.hotelStatus}</p>
                <p>
                  <strong>Hotel Payment ID:</strong>{" "}
                  {selectedBooking.hotelPaymentId}
                </p>

                <hr />

                <p><strong>Flight:</strong> {selectedBooking.flight}</p>
                <p><strong>Flight Status:</strong> {selectedBooking.flightStatus}</p>
                <p>
                  <strong>Flight Payment ID:</strong>{" "}
                  {selectedBooking.flightPaymentId}
                </p>

                <hr />

                <p><strong>Destination ID:</strong> {selectedBooking.destinationId}</p>
                <p><strong>User ID:</strong> {selectedBooking.userId}</p>
               
              </div>

              <Button className="mt-4" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
