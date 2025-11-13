"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

type Flight = {
  airline: string
  airplane: string
  airlineLogo: string
  travelClass: string
  duration: string
  flightNumber: string
}

type FlightsResponse = {
  flights: Flight[]
}

function formatDuration(minutesStr: string) {
  const total = Number(minutesStr) || 0
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

type FlightsRequest = {
  departureId: string
  arrivalId: string
  departureDate: string
  returnDate: string
}

type FlightsPageProps = {
  searchParams: {
    departureId?: string
    arrivalId?: string
    departureDate?: string
    returnDate?: string
  }
}

export default function FlightsPage({ searchParams }: FlightsPageProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const departureId = searchParams.departureId || "DXB"
  const arrivalId = searchParams.arrivalId || "DEL"
  const departureDate = searchParams.departureDate || "2025-11-05"
  const returnDate = searchParams.returnDate || "2025-11-07"

  useEffect(() => {
    async function fetchFlights() {
      try {
        setLoading(true)
        const token = localStorage.getItem("authToken")
        const apiUrl = "http://localhost:8090/api/flight/search"

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            departureId,
            arrivalId,
            departureDate,
            returnDate,
          } as FlightsRequest),
        })

        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        const data = (await res.json()) as FlightsResponse
        setFlights(data.flights || [])
      } catch (err: any) {
        console.error("Flights fetch failed:", err)
        setError(err.message)
        // fallback data
        setFlights([
          {
            airline: "Gulf Air",
            airplane: "Airbus A321neo",
            airlineLogo: "https://www.gstatic.com/flights/airline_logos/70px/GF.png",
            travelClass: "Economy",
            duration: "84",
            flightNumber: "GF 513",
          },
          {
            airline: "Gulf Air",
            airplane: "Hello A321neo",
            airlineLogo: "https://www.gstatic.com/flights/airline_logos/70px/GF.png",
            travelClass: "Economy",
            duration: "230",
            flightNumber: "GF 134",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [departureId, arrivalId, departureDate, returnDate])

  // ✅ Handle flight selection and save
  // ✅ handleSelectFlight — now local only
function handleSelectFlight(flight: Flight) {
  setSelectedFlight(flight);
  localStorage.setItem("selectedFlight", JSON.stringify(flight)); // persist locally
  console.log("✈️ Selected flight saved locally:", flight);
}


  function handleContinue() {
  if (!selectedFlight) {
    alert("Please select a flight first.");
    return;
  }

  // Save locally before moving ahead
  localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight));

  const itineraryForm = localStorage.getItem("itineraryForm");
  if (!itineraryForm) {
    alert("Itinerary data missing! Please generate an itinerary first.");
    return;
  }

  const form = JSON.parse(itineraryForm);
  if (!form.country || !form.startDate || !form.endDate || !form.members) {
    alert("Incomplete itinerary data.");
    return;
  }

  const query = new URLSearchParams({
    country: form.country,
    checkInDate: form.startDate,
    checkOutDate: form.endDate,
    numberOfGuests: form.members.toString(),
  }).toString();

  window.location.href = `/hotels?${query}`;
}


  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold">Flights</h1>
            <p className="opacity-80">Select your preferred flight for the trip.</p>
          </header>

          {loading && <p className="text-muted-foreground">Loading flights...</p>}

          {error && !loading && <p className="text-destructive">Error: {error}</p>}

          {!loading && flights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flights.map((f, idx) => {
                const isSelected =
                  selectedFlight?.flightNumber === f.flightNumber && selectedFlight.airline === f.airline
                return (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 flex gap-4 items-start cursor-pointer transition hover:shadow-md ${isSelected ? "border-primary bg-primary/10" : "border-muted"
                      }`}
                    onClick={() => handleSelectFlight(f)}
                  >
                    <img
                      src={f.airlineLogo}
                      alt={`${f.airline} logo`}
                      width={50}
                      height={50}
                      className="rounded-sm"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">
                          {f.airline} · {f.flightNumber}
                        </h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                          {f.travelClass}
                        </span>
                      </div>
                      <p className="text-sm opacity-80">{f.airplane}</p>
                      <p className="text-sm mt-1">
                        Duration: <span className="font-medium">{formatDuration(f.duration)}</span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedFlight || saving}
              className="px-6"
            >
              {saving ? "Saving..." : "Continue to Hotels"}
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
