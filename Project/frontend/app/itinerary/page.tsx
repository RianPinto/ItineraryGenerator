"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ItineraryForm, type ItineraryResponse, type FormState } from "@/components/itinerary-form"
import { ItineraryView } from "@/components/itinerary-view"

export default function Page() {
  const [data, setData] = useState<ItineraryResponse | null>(null)
  const [form, setForm] = useState<FormState | null>(null)

  // ✅ Load saved data when page opens
  useEffect(() => {
    const savedItinerary = localStorage.getItem("itineraryData")
    const savedForm = localStorage.getItem("itineraryForm")
    if (savedItinerary) setData(JSON.parse(savedItinerary))
    if (savedForm) setForm(JSON.parse(savedForm))
  }, [])

  // ✅ When user clicks “Generate”, update instantly + save to localStorage
  function handleComplete(itineraryData: ItineraryResponse, formData: FormState) {
    setData(itineraryData)
    setForm(formData)
    localStorage.setItem("itineraryData", JSON.stringify(itineraryData))
    localStorage.setItem("itineraryForm", JSON.stringify(formData))
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <Navbar hasItinerary={Boolean(data)} />
      </header>

      <main className="flex-1">
        <section className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
          <div className="grid gap-8 md:gap-10">
            <div className="text-center">
              <h1 className="text-pretty text-3xl md:text-4xl font-semibold">
                Plan your next <span className="text-accent">adventure</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Choose dates, budget, and travel type. We&apos;ll generate a daily itinerary.
              </p>
            </div>

            {/* ✅ Form instantly triggers backend + updates itinerary */}
            <ItineraryForm
              onComplete={handleComplete}
              onFormChange={(currentForm) => setForm(currentForm)}
            />

            {/* ✅ Itinerary instantly updates once form completes */}
            <ItineraryView data={data} form={form ?? undefined} />
          </div>
        </section>
      </main>
    </div>
  )
}
