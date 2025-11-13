import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-pretty text-4xl md:text-5xl font-semibold">
                Plan unforgettable journeys with confidence
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Build day-by-day itineraries in seconds. Compare flights and hotels, and keep everything organized in
                one place.
              </p>

              {/* Big CTA to the itinerary generator at "/" */}
              <div className="mt-2">
                <Button asChild size="lg" className="h-12 px-8 text-base md:text-lg">
                  <Link href="/itinerary">Start Planning</Link>
                </Button>
              </div>

              {/* Secondary links */}
              <div className="mt-4 flex gap-3">
                
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden border">
              {/* Using the built-in placeholder image pattern per guidelines */}
              <img
                src="/mountain-sunrise-scenic-travel-landscape.jpg"
                alt="Scenic travel landscape of mountains at sunrise"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="container mx-auto max-w-6xl px-4 pb-12 md:pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Smart Itineraries"
              body="Get a clear daily schedule with activities, costs, and notes."
            />
            <FeatureCard title="Best Flight Options" body="Quickly compare flight choices that match your budget." />
            <FeatureCard
              title="Comfortable Stays"
              body="Discover hotels near your activities with the right amenities."
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border p-5 bg-card">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground mt-1">{body}</p>
    </div>
  )
}
