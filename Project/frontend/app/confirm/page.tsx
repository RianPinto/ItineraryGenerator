"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"

export default function ConfirmPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<number | null>(null)
  const [destinationId, setDestinationId] = useState<number | null>(null)
  const [hotel, setHotel] = useState<any>(null)
  const [flight, setFlight] = useState<any>(null)
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [flightAmount, setFlightAmount] = useState<number>(0)
  const [hotelAmount, setHotelAmount] = useState<number>(0)

  useEffect(() => {
    try {
      const user = localStorage.getItem("userId")
      const dest = localStorage.getItem("destinationId")
      const savedHotel = localStorage.getItem("selectedHotel")
      const savedFlight = localStorage.getItem("selectedFlight")
      const savedItinerary = localStorage.getItem("itineraryData")

      setUserId(user ? Number(user) : null)
      setDestinationId(dest ? Number(dest) : null)
      setHotel(savedHotel ? JSON.parse(savedHotel) : null)
      setFlight(savedFlight ? JSON.parse(savedFlight) : null)
      setItinerary(savedItinerary ? JSON.parse(savedItinerary) : null)
    } catch (err) {
      console.error("Error loading confirmation data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Calculate estimated prices
  useEffect(() => {
    if (hotel)
      setHotelAmount(parseInt(hotel.pricePerNight?.replace(/\D/g, "")) || 0)
    if (flight)
      setFlightAmount(
        flight.price
          ? parseInt(flight.price?.replace(/\D/g, ""))
          : Math.floor(Math.random() * 300) + 150
      )
  }, [hotel, flight])

  const total = flightAmount + hotelAmount

  const handleConfirm = () => {
    if (!userId || !destinationId || !hotel || !flight) {
      alert("Missing booking details! Please go back and complete selections.")
      return
    }

    const payload = {
      userId,
      destinationId,
      hotel: hotel.name || "Unknown Hotel",
      flight: flight.flightNumber || "Unknown Flight",
      hotelAmount,
      flightAmount,
    }

    // ✅ Save to localStorage for Payment page to pick up
    localStorage.setItem("paymentData", JSON.stringify(payload))

    // ✅ Redirect to payment page
    router.push("/payment")
  }

  if (loading)
    return (
      <div className="min-h-dvh flex items-center justify-center text-muted-foreground">
        Loading trip details...
      </div>
    )

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold mb-8 text-center">Confirm Your Trip</h1>

        <div className="grid gap-8">
          {/* Itinerary */}
          {itinerary && (
            <Card>
              <CardHeader>
                <CardTitle>Itinerary Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Destination:</strong> {itinerary.destination || "Unknown"}
                </p>
                <p>
                  <strong>Days:</strong> {itinerary.itinerary?.length || 0}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Flight */}
          {flight && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Flight</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Airline:</strong> {flight.airline}</p>
                <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                <p><strong>Class:</strong> {flight.travelClass}</p>
                <p><strong>Price:</strong> ${flightAmount}</p>
              </CardContent>
            </Card>
          )}

          {/* Hotel */}
          {hotel && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Hotel</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Name:</strong> {hotel.name}</p>
                <p><strong>Rating:</strong> {hotel.rating}</p>
                <p><strong>Price:</strong> ${hotelAmount}</p>
              </CardContent>
            </Card>
          )}

          {/* Total */}
          <Card>
            <CardHeader>
              <CardTitle>Total Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Hotel:</strong> ${hotelAmount}</p>
              <p><strong>Flight:</strong> ${flightAmount}</p>
              <hr className="my-3" />
              <p className="text-lg font-semibold">
                <strong>Total:</strong>{" "}
                <span className="text-primary">${total}</span>
              </p>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button onClick={handleConfirm} className="px-8 py-2 text-lg">
              Confirm & Proceed to Payment 💳
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
