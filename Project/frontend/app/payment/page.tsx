"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const router = useRouter()

  const [paymentData, setPaymentData] = useState<any>(null)
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("paymentData")
    if (!data) {
      router.push("/confirm")
      return
    }
    setPaymentData(JSON.parse(data))
  }, [router])

  async function handlePayment() {
    if (!paymentData) return

    try {
      setStatus("processing")
      setMessage("Processing your payment...")

      // -------------------------------------------
      // 💳 MOCK PAYMENT ENGINE (Frontend Only)
      // -------------------------------------------
      const fakePayment = await new Promise((resolve) =>
  setTimeout(() => {
    const success = Math.random() < 0.8; // 80% chance
    resolve({
      paymentId: Math.floor(Math.random() * 90000) + 10000,
      status: success ? "SUCCESS" : "FAILED",
    })
  }, 1500)
)

const paymentResult = fakePayment as any;

if (paymentResult.status !== "SUCCESS") {
  throw new Error("Payment failed ")
}

const paymentId = paymentResult.paymentId;

      // -------------------------------------------
      // BUILD FINAL PAYLOAD FOR ITINERARY DB
      // -------------------------------------------
      const finalPayload = {
        userId: paymentData.userId,
        destinationId: paymentData.destinationId,
        hotel: paymentData.hotel,
        flight: paymentData.flight,
        hotelAmount: paymentData.hotelAmount,
        flightAmount: paymentData.flightAmount,

        // Required by DB schema
        hotelstatus: "Success",
        flightstatus: "Success",
        hotelPaymentId: paymentId,
        flightPaymentId: paymentId,
      }

      console.log("🚀 Saving itinerary with payload:", finalPayload)

      // -------------------------------------------
      // SAVE TO DB
      // -------------------------------------------
      const token = localStorage.getItem("authToken")

      const res = await fetch("http://localhost:8090/api/itinerary/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(finalPayload),
      })

      if (!res.ok) throw new Error("Failed to confirm itinerary")

      setStatus("success")
      setMessage("🎉 Payment successful! Trip confirmed.")

      // clear temp storage
      localStorage.removeItem("paymentData")

    } catch (err) {
      console.error("Payment error:", err)
      setStatus("failed")
      setMessage("❌ Payment failed. Please try again.")
    }
  }

  if (!paymentData) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-muted-foreground">
        Loading payment info...
      </div>
    )
  }

  const total = paymentData.hotelAmount + paymentData.flightAmount

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Payment Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p><strong>Flight:</strong> {paymentData.flight}</p>
            <p><strong>Hotel:</strong> {paymentData.hotel}</p>
            <p><strong>Flight Cost:</strong> ${paymentData.flightAmount}</p>
            <p><strong>Hotel Cost:</strong> ${paymentData.hotelAmount}</p>

            <hr />

            <p className="text-lg font-semibold">
              Total: <span className="text-primary">${total}</span>
            </p>

            {/* BUTTON STATES */}
            {status === "idle" && (
              <Button onClick={handlePayment} className="w-full text-lg">
                Pay Now 💳
              </Button>
            )}

            {status === "processing" && (
              <p className="text-blue-600 font-medium text-center">{message}</p>
            )}

            {status === "success" && (
              <div className="text-center">
                <p className="text-green-600 font-medium">{message}</p>
                <Button className="mt-4" onClick={() => router.push("/profile/info")}>
                  View Bookings
                </Button>
              </div>
            )}

            {status === "failed" && (
              <div className="text-center">
                <p className="text-destructive font-medium">{message}</p>
                <Button className="mt-3" onClick={handlePayment}>
                  Retry Payment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
