export function SiteFooter() {
  return (
    <footer className="footer-bar mt-8">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-pretty">© {new Date().getFullYear()} TravelMate. All rights reserved.</p>
        <nav className="flex gap-4">
          <a className="underline-offset-4 hover:underline" href="/hotels">
            Hotels
          </a>
          <a className="underline-offset-4 hover:underline" href="/flights">
            Flights
          </a>
          <a className="underline-offset-4 hover:underline" href="/">
            Home
          </a>
        </nav>
      </div>
    </footer>
  )
}
