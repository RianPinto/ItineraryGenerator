"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { SavedItineraries, type SavedItinerary } from "@/components/saved-itineraries"
import { PreviousBookings, type FlightBooking, type HotelBooking } from "@/components/previous-bookings"

export default function ProfileInfoPage() {
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([])
  const [flights, setFlights] = useState<FlightBooking[]>([])
  const [hotels, setHotels] = useState<HotelBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Mock data - replace with actual API calls
        setSavedItineraries([
          {
            id: "1",
            destination: "Japan",
            startDate: "2025-01-15",
            endDate: "2025-01-25",
            budget: 3000,
            tripType: "couple",
            createdAt: "2025-01-01",
          },
          {
            id: "2",
            destination: "Italy",
            startDate: "2025-02-10",
            endDate: "2025-02-20",
            budget: 4000,
            tripType: "friends",
            createdAt: "2024-12-25",
          },
        ])

        setFlights([
          {
            id: "f1",
            flightNumber: "AA 100",
            airline: "American Airlines",
            departureDate: "2025-01-15",
            status: "success",
          },
          {
            id: "f2",
            flightNumber: "BA 250",
            airline: "British Airways",
            departureDate: "2025-02-10",
            status: "failed",
          },
        ])

        setHotels([
          {
            id: "h1",
            hotelName: "Sakura Grand Hotel",
            checkInDate: "2025-01-15",
            checkOutDate: "2025-01-25",
            status: "success",
          },
          {
            id: "h2",
            hotelName: "Colosseum View Hotel",
            checkInDate: "2025-02-10",
            checkOutDate: "2025-02-20",
            status: "failed",
          },
        ])
      } catch (error) {
        console.error("[v0] Error fetching profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col">
        <header className="bg-primary text-primary-foreground shadow-sm">
          <Navbar />
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your profile...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1">
        <section className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
          <div className="grid gap-12">
            <SavedItineraries  />
            <PreviousBookings flights={flights} hotels={hotels} />
          </div>
        </section>
      </main>

    </div>
  )
}
