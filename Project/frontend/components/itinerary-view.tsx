"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { ItineraryResponse, FormState, ItineraryDay, ItinerarySlot } from "./itinerary-form"

export const countryToAirport: Record<string, string> = {
  India: "DEL",
  UAE: "DXB",
  USA: "JFK",
  Japan: "NRT",
  UK: "LHR",
  France: "CDG",
  Germany: "FRA",
  Australia: "SYD",
  Canada: "YYZ",
  Singapore: "SIN",
}

export function ItineraryView() {
  const [data, setData] = useState<ItineraryResponse | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Load saved itinerary & form on mount
  useEffect(() => {
    const savedData = localStorage.getItem("itineraryData")
    const savedForm = localStorage.getItem("itineraryForm")
    if (savedData) setData(JSON.parse(savedData))
    if (savedForm) setForm(JSON.parse(savedForm))
  }, [])

  // ✅ Save itinerary (with form data included)
  async function handleSaveOnly() {
    if (!data || !form) {
      alert("No itinerary or form data to save!")
      return 0
    }

    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("authToken")

    if (!userId || !token) {
      alert("You must be logged in to save itineraries.")
      return 0
    }

    try {
      setIsLoading(true)

      // ✅ Combine itinerary + metadata from form
      const payload = {
        itinerary: data.itinerary,
        destination: form.country,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget,
      }

      console.log("📦 Payload sent to backend:", payload)

      const res = await fetch(`http://localhost:8090/api/destination/save/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`Failed to save itinerary: ${res.status}`)

      const text = await res.text()
      let responseData: any = {}
      if (text) {
        try {
          responseData = JSON.parse(text)
        } catch {
          console.warn("Non-JSON response:", text)
        }
      }

      if (responseData?.id) {
        localStorage.setItem("destinationId", responseData.id.toString())
      }

      alert("✅ Itinerary saved successfully!")
      return 1
    } catch (err: any) {
      console.error("❌ Save itinerary failed:", err)
      alert("Failed to save itinerary.")
      return 0
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Save & proceed to Flights
  async function handleSaveAndProceed() {
    try {
      const success = await handleSaveOnly()
      if (success) {
        const url = `/flights?departureId=${encodeURIComponent(
          countryToAirport[form?.country || "UAE"]
        )}&arrivalId=DEL&departureDate=${encodeURIComponent(
          form?.startDate || ""
        )}&returnDate=${encodeURIComponent(form?.endDate || "")}`

        window.location.href = url
      } else {
        alert("Saving itinerary failed. Please try again.")
      }
    } catch (error) {
      console.error("Error proceeding to flights:", error)
      alert("Something went wrong while saving itinerary.")
    }
  }

  // ✅ Fallback view if no data
  if (!data?.itinerary?.length) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Your itinerary will appear here</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Generate a plan to see your personalized trip itinerary.
        </CardContent>
      </Card>
    )
  }

  const days = data.itinerary

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link
              href={`/flights?departureId=${countryToAirport[form?.country || "UAE"]}&arrivalId=DEL&departureDate=${form?.startDate}&returnDate=${form?.endDate}`}
            >
              Flights
            </Link>
          </Button>

          <Button variant="secondary" asChild disabled={!form}>
            <Link
              href={
                form
                  ? `/hotels?country=${encodeURIComponent(
                      form.country
                    )}&checkInDate=${form.startDate}&checkOutDate=${form.endDate}&numberOfGuests=${form.members}`
                  : "#"
              }
            >
              Hotels
            </Link>
          </Button>
        </div>

        {/* Accordion for daily itinerary */}
        <Accordion type="single" collapsible className="w-full">
          {days.map((d: ItineraryDay, idx: number) => (
            <AccordionItem key={idx} value={`day-${idx + 1}`}>
              <AccordionTrigger className="text-left hover:bg-accent/10">
                {`Day ${idx+1}`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {["morning", "afternoon", "evening"].map((slotKey) => (
                    <Card key={slotKey} className="border-t-2 border-accent">
                      <CardHeader>
                        <CardTitle className="text-base capitalize">{slotKey}</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-2">
                        <Slot
                          label="Session"
                          slot={d[slotKey as keyof ItineraryDay] as ItinerarySlot}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 flex gap-4">
          <Button onClick={handleSaveOnly} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Itinerary"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleSaveAndProceed}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save & Continue to Booking"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Slot({ label, slot }: { label: string; slot: ItinerarySlot }) {
  return (
    <div className="grid gap-1">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm text-muted-foreground">{slot.time || "—"}</div>
      <div className="text-sm">{slot.description}</div>
      <div className="text-sm">
        <span className="text-muted-foreground">Estimated cost:</span>{" "}
        <span>
          {typeof slot.estimated_cost === "number"
            ? `$${slot.estimated_cost}`
            : slot.estimated_cost}
        </span>
      </div>
      {slot.notes && (
        <div className="text-xs text-muted-foreground">{slot.notes}</div>
      )}
    </div>
  )
}
