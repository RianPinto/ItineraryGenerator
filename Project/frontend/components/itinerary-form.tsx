"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import useSWRMutation from "swr/mutation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/app/lib/api"

export type ItinerarySlot = { time: string | null; description: string; estimated_cost: number | string; notes: string }
export type ItineraryDay = { day: string; date?: string; morning: ItinerarySlot; afternoon: ItinerarySlot; evening: ItinerarySlot }
export type ItineraryResponse = { itinerary: ItineraryDay[] }

export type FormState = {
  country: string
  startDate: string
  endDate: string
  budget: number
  members: number
  type: "couple" | "friends" | "family" | "solo"
}

// Helper to POST itinerary
async function postItinerary(url: string, { arg }: { arg: FormState }) {
  return apiFetch<ItineraryResponse>(url, {
    method: "POST",
    body: JSON.stringify(arg),
  })
}

export function ItineraryForm({
  onComplete,
  className,
}: {
  onComplete: (data: ItineraryResponse, form: FormState) => void
  className?: string
}) {
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), [])
  const [form, setForm] = useState<FormState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("itineraryForm")
      if (saved) return JSON.parse(saved)
    }
    return { country: "", startDate: today, endDate: today, budget: 2000, members: 2, type: "couple" }
  })

  const { trigger, isMutating, error } = useSWRMutation(
    "http://localhost:8090/api/destination/generate",
    postItinerary
  )

  // Persist form
  useEffect(() => {
    localStorage.setItem("itineraryForm", JSON.stringify(form))
  }, [form])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const data = await trigger(form) // API call
      onComplete(data, form) // update parent instantly
    } catch (err) {
      console.error("❌ Failed to generate itinerary:", err)
    }
  }

  return (
    <Card className={cn("border bg-secondary ring-1 ring-primary/10", className)}>
      <CardHeader>
        <CardTitle className="text-pretty">Trip details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field id="country" label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <Field id="startDate" label="Start date" type="date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} />
            <Field id="endDate" label="End date" type="date" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field id="budget" label="Budget" type="number" value={String(form.budget)} onChange={(v) => setForm({ ...form, budget: Number(v) })} />
            <Field id="members" label="Members" type="number" value={String(form.members)} onChange={(v) => setForm({ ...form, members: Number(v) })} />
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val as FormState["type"] })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="solo">Solo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isMutating}>
              {isMutating ? "Generating..." : "Generate itinerary"}
            </Button>
            {error && <p className="text-sm text-destructive">Please login</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  )
}
