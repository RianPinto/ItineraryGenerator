"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export type PaymentMethod = "upi" | "credit-card" | "debit-card" | "net-banking" | "wallet"

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  const methods: Array<{ id: PaymentMethod; label: string; description: string }> = [
    { id: "upi", label: "UPI", description: "Google Pay, PhonePe, Paytm" },
    { id: "credit-card", label: "Credit Card", description: "Visa, Mastercard, Amex" },
    { id: "debit-card", label: "Debit Card", description: "Visa, Mastercard" },
    { id: "net-banking", label: "Net Banking", description: "All major banks" },
    { id: "wallet", label: "Digital Wallet", description: "PayPal, Skrill" },
  ]

  return (
    <div className="grid gap-4">
      <Label className="text-lg font-semibold">Select Payment Method</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <Card
            key={method.id}
            className={`p-4 cursor-pointer transition-all border-2 ${
              selectedMethod === method.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment-method"
                id={method.id}
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onMethodChange(method.id)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                  {method.label}
                </Label>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
