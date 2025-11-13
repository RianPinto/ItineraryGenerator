"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Navbar } from "@/components/navbar"

export type ItinerarySlot = { time?: string; description?: string; estimated_cost?: number; notes?: string }
export type ItineraryDay = {
  day: string
  date?: string
  morning: ItinerarySlot
  afternoon: ItinerarySlot
  evening: ItinerarySlot
}
export type SavedItinerary = {
  id: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  tripType: "couple" | "friends" | "family" | "solo"
  createdAt: string
  itinerary?: ItineraryDay[]
}

export function SavedItineraries() {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<SavedItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItineraries() {
      try {
        setLoading(true)
        const token = localStorage.getItem("authToken")
        const userId = localStorage.getItem("userId")

        if (!token || !userId) {
          setError("You must log in to view saved itineraries.")
          setLoading(false)
          return
        }

        const res = await fetch(`http://localhost:8090/api/destination/get/${userId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        const data = await res.json()

        const formatted = (Array.isArray(data) ? data : data.destinations || []).map((d: any) => ({
          id: d.id?.toString() || Math.random().toString(),
          destination: d.destination || "Unknown",
          startDate: d.startDate || "—",
          endDate: d.endDate || "—",
          budget: d.budget || 0,
          tripType: d.tripType || "couple",
          createdAt: d.createdAt || new Date().toISOString(),
          itinerary: d.itinerary || [],
        }))
        setItineraries(formatted)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchItineraries()
  }, [])

  if (loading) return <p className="text-center py-10">Loading itineraries...</p>
  if (error) return <p className="text-center text-destructive py-10">{error}</p>

  // 🔹 Function to handle booking
  function handleBookTrip(itinerary: SavedItinerary) {
    // Save itinerary to localStorage for continuity
    localStorage.setItem("itineraryData", JSON.stringify(itinerary))
    localStorage.setItem(
      "itineraryForm",
      JSON.stringify({
        country: itinerary.destination,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        budget: itinerary.budget,
        members: 2,
        type: itinerary.tripType,
      })
    )

    // Redirect to flights page
    const query = new URLSearchParams({
      departureId: "DXB", // fallback
      arrivalId: "DEL",
      departureDate: itinerary.startDate,
      returnDate: itinerary.endDate,
    }).toString()

    window.location.href = `/flights?${query}`
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">Saved Itineraries</h1>

        {itineraries.length === 0 ? (
          <p className="text-muted-foreground">No saved itineraries found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itineraries.map((itinerary) => (
              <Card
                key={itinerary.id}
                className="hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedItinerary(itinerary)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{itinerary.destination}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Start:</span> {itinerary.startDate}
                  </p>
                  <p>
                    <span className="text-muted-foreground">End:</span> {itinerary.endDate}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Budget:</span> ${itinerary.budget}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* 🔹 Itinerary Detail Dialog */}
      <Dialog open={!!selectedItinerary} onOpenChange={() => setSelectedItinerary(null)}>
        <DialogContent className="w-[95vw] max-w-[1600px] max-h-[92vh] overflow-y-auto p-8 rounded-2xl shadow-2xl">
          {selectedItinerary && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  {selectedItinerary.destination}
                </DialogTitle>
                <p className="text-base text-muted-foreground mt-1">
                  {selectedItinerary.startDate} → {selectedItinerary.endDate} ·{" "}
                  <span className="font-medium">${selectedItinerary.budget}</span> ·{" "}
                  {selectedItinerary.tripType}
                </p>
              </DialogHeader>

              {selectedItinerary.itinerary?.length ? (
                <Accordion type="single" collapsible className="mt-8 w-full">
                  {selectedItinerary.itinerary.map((d: ItineraryDay, idx: number) => (
                    <AccordionItem key={idx} value={`day-${idx + 1}`}>
                      <AccordionTrigger className="text-left text-lg font-semibold hover:bg-accent/10 py-4">
                        {`Day ${d.day}${d.date ? ` — ${d.date}` : ""}`}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-6 md:grid-cols-3">
                          {["morning", "afternoon", "evening"].map((slotKey) => (
                            <Card
                              key={slotKey}
                              className="border-t-2 border-accent bg-card/50 backdrop-blur-sm"
                            >
                              <CardHeader>
                                <CardTitle className="text-base capitalize">{slotKey}</CardTitle>
                              </CardHeader>
                              <CardContent className="grid gap-2">
                                <Slot
                                  label="Session"
                                  slot={d[slotKey as keyof ItineraryDay]}
                                />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground mt-6 text-center text-sm">
                  No detailed itinerary available.
                </p>
              )}

              {/* 🔹 Buttons */}
              <div className="mt-10 flex justify-end gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 text-base"
                  onClick={() => setSelectedItinerary(null)}
                >
                  Close
                </Button>
                <Button
                  size="lg"
                  className="px-8 text-base"
                  onClick={() => handleBookTrip(selectedItinerary)}
                >
                  Book this Trip ✈️
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 🔹 Helper component for session display
function Slot({ label, slot }: { label: string; slot: ItinerarySlot }) {
  return (
    <div className="grid gap-1 text-sm">
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground">{slot?.time || "—"}</div>
      <div>{slot?.description || "No details"}</div>
      <div>
        <span className="text-muted-foreground">Cost:</span>{" "}
        {slot?.estimated_cost ? `$${slot.estimated_cost}` : "—"}
      </div>
      {slot?.notes && <div className="text-xs text-muted-foreground">{slot.notes}</div>}
    </div>
  )
}
