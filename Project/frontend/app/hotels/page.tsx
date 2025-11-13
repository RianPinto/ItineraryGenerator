"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

type Hotel = {
  id: string
  name: string
  thumbnailUrl: string
  rating: number
  pricePerNight: string
  amenities: string[]
}

type HotelsRequest = {
  country: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: string
}

type HotelsResponse = {
  hotels: Hotel[]
}

type HotelsPageProps = {
  searchParams: {
    country?: string
    checkInDate?: string
    checkOutDate?: string
    numberOfGuests?: string
  }
}

export default function HotelsPage({ searchParams }: HotelsPageProps) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedHotelName, setSelectedHotelName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Defaults
  const country = searchParams.country || "India"
  const checkInDate = searchParams.checkInDate || "2025-11-05"
  const checkOutDate = searchParams.checkOutDate || "2025-11-07"
  const numberOfGuests = searchParams.numberOfGuests || "2"

  // ✅ Fetch Hotels
  useEffect(() => {
    async function fetchHotels() {
      try {
        setLoading(true)
        setError(null)
        setSelectedHotelName(null) // reset selection on each search

        const token = localStorage.getItem("authToken")
        const res = await fetch("http://localhost:8090/api/hotel/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ country, checkInDate, checkOutDate, numberOfGuests } as HotelsRequest),
        })

        if (!res.ok) throw new Error(`Failed to fetch hotels: ${res.status}`)
        const data = (await res.json()) as HotelsResponse
        setHotels(data.hotels || [])
      } catch (err: any) {
        console.error("Hotels fetch failed:", err.message)
        setError(err.message)

        // fallback sample data for local testing
        setHotels([
          {
            id: "1",
            name: "Sakura Grand",
            thumbnailUrl: "/hotel-room-photo.jpg",
            rating: 4.6,
            pricePerNight: "$160/night",
            amenities: ["Wi-Fi", "Breakfast", "Gym"],
          },
          {
            id: "2",
            name: "Harbor View Inn",
            thumbnailUrl: "/harbor-hotel-view.jpg",
            rating: 4.3,
            pricePerNight: "$120/night",
            amenities: ["Wi-Fi", "Pool", "Parking"],
          },
          {
            id: "3",
            name: "City Light Suites",
            thumbnailUrl: "/modern-hotel-suite.png",
            rating: 4.8,
            pricePerNight: "$220/night",
            amenities: ["Wi-Fi", "Spa", "Bar"],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [country, checkInDate, checkOutDate, numberOfGuests])

  // ✅ Select Hotel by Name (No Backend Call)
  function handleSelectHotel(hotel: Hotel) {
    setSelectedHotelName(hotel.name)
    localStorage.setItem("selectedHotel", JSON.stringify(hotel))
    console.log("🏨 Selected hotel:", hotel.name)
  }

  // ✅ Continue to Confirmation
  function handleContinue() {
    if (!selectedHotelName) {
      alert("Please select a hotel first.")
      return
    }
    window.location.href = "/confirm"
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold">Hotels</h1>
            <p className="opacity-80">Select a hotel to continue your booking.</p>
          </header>

          {/* Loading */}
          {loading && <p className="text-muted-foreground">Loading hotels...</p>}

          {/* Error */}
          {error && !loading && (
            <p className="text-destructive">Failed to load hotels: {error}</p>
          )}

          {/* ✅ Hotels Grid */}
          {!loading && !error && (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.map((h) => {
                const isSelected = selectedHotelName === h.name
                return (
                  <li
                    key={h.name}
                    className={`border rounded-lg overflow-hidden transition hover:shadow-md ${
                      isSelected ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <img
                      src={h.thumbnailUrl || "/placeholder.svg"}
                      alt={h.name}
                      className="w-full h-[180px] object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{h.name}</h2>
                      <p className="text-sm mt-1">Rating: {h.rating}</p>
                      <p className="mt-1 font-medium">{h.pricePerNight}</p>

                      <div className="mt-2">
                        <span className="text-sm font-medium">Amenities:</span>
                        <ul className="mt-1 flex flex-wrap gap-2">
                          {h.amenities.map((a, i) => (
                            <li
                              key={i}
                              className="text-sm bg-muted rounded-full px-2 py-1 text-muted-foreground"
                            >
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        <Button
                          className={`w-full ${isSelected ? "bg-primary" : "bg-secondary"}`}
                          onClick={() => handleSelectHotel(h)}
                        >
                          {isSelected ? "Selected" : "Select Hotel"}
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {/* ✅ Continue Button */}
          <div className="mt-8 flex justify-between items-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedHotelName}
              className="px-6"
            >
              Continue to Confirmation
            </Button>

            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
