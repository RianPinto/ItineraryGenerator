'use client'

import Link from 'next/link'
import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function Navbar({ hasItinerary = false }: { hasItinerary?: boolean }) {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  // close menu on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="container mx-auto max-w-5xl px-4 h-16 md:h-20 flex items-center justify-between"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="inline-flex items-center">
          <span className="text-lg md:text-xl font-semibold text-inherit">TravelMate</span>
          <span className="sr-only">Home</span>
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex items-center gap-1 md:gap-2 relative">
        <Button asChild variant="ghost" className="hover:bg-primary/10">
          <Link href="/">Home</Link>
        </Button>

       

        

        {!isLoading && (
          <>
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  ref={buttonRef}
                  variant="secondary"
                  className="ml-1 md:ml-2"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  Profile
                </Button>

                {menuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-44 rounded-md border border-border bg-popover text-popover-foreground shadow-lg z-[9999]"
                  >
                    <div className="px-3 py-2 text-sm font-medium border-b border-border">Profile</div>

                    <Link
                      href="/profile/info"
                      className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      Info
                    </Link>

                    <div className="border-t border-border my-1" />

                    <button
                      onClick={() => {
                        logout()
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button asChild variant="secondary" className="ml-1 md:ml-2">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
