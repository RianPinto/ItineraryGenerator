"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentMethodSelector, type PaymentMethod } from "./payment-method-selector"

interface PaymentFormProps {
  onSuccess: (status: "success" | "failed") => void
  amount?: number
}

export function PaymentForm({ onSuccess, amount = 5000 }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing with 90% success rate
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const isSuccess = Math.random() < 0.9
    onSuccess(isSuccess ? "success" : "failed")
    setIsProcessing(false)
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Amount Display */}
          <div className="p-4 bg-accent/10 rounded-lg border border-accent">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold text-accent">₹{amount.toLocaleString()}</p>
          </div>

          {/* Payment Method Selection */}
          <PaymentMethodSelector selectedMethod={selectedMethod} onMethodChange={setSelectedMethod} />

          {/* Contact Information */}
          <div className="grid gap-4">
            <Label className="text-lg font-semibold">Contact Information</Label>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((f) => ({ ...f, phoneNumber: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isProcessing} className="w-full py-6 text-lg font-semibold">
            {isProcessing ? "Processing Payment..." : "Pay Now"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your payment information is secure and encrypted. This is a demo gateway with simulated results.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
