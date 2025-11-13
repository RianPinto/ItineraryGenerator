"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PaymentResultProps {
  status: "success" | "failed"
  amount: number
  onRetry: () => void
}

export function PaymentResult({ status, amount, onRetry }: PaymentResultProps) {
  const isSuccess = status === "success"

  return (
    <Card className={`bg-card border-2 ${isSuccess ? "border-green-500" : "border-destructive"}`}>
      <CardHeader>
        <CardTitle className={isSuccess ? "text-green-600" : "text-destructive"}>
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="text-center">
          <p className="text-4xl mb-4">{isSuccess ? "✓" : "✕"}</p>
          <p className={`text-lg font-semibold ${isSuccess ? "text-green-600" : "text-destructive"}`}>
            {isSuccess ? "Your payment has been processed successfully" : "Your payment could not be processed"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Amount: ₹{amount.toLocaleString()}</p>
        </div>

        <div className="grid gap-3">
          {!isSuccess && (
            <Button onClick={onRetry} className="w-full">
              Retry Payment
            </Button>
          )}
          <Button asChild variant="secondary" className="w-full">
            <Link href="/itinerary">Back to Itinerary</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
