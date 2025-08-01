"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Plus, FileText } from "lucide-react"

interface QuickActionsCardProps {
  setIsAddBookingOpen: (isOpen: boolean) => void
  setIsAddClientOpen: (isOpen: boolean) => void
  setIsAddServiceOpen: (isOpen: boolean) => void
  setIsCreateInvoiceOpen: (isOpen: boolean) => void
}

export function QuickActionsCard({
  setIsAddBookingOpen,
  setIsAddClientOpen,
  setIsAddServiceOpen,
  setIsCreateInvoiceOpen,
}: QuickActionsCardProps) {
  return (
    <Card className="bg-black/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-roseDark-DEFAULT">
          <TrendingUp className="w-5 h-5 text-roseDark-DEFAULT" strokeWidth={2} />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full bg-gradient-to-r from-[#f5d76e] to-[#d4af37] hover:from-[#e6c14c] hover:to-[#bfa235] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200
"
          onClick={() => setIsAddBookingOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          New Booking
        </Button>
        <Button
          variant="outline"
          className="w-full border-roseLight-DEFAULT text-roseDark-DEFAULT hover:bg-roseLight-DEFAULT/30 rounded-xl bg-transparent"
          onClick={() => setIsAddClientOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Add Client
        </Button>
        <Button
          variant="outline"
          className="w-full border-roseLight-DEFAULT text-roseDark-DEFAULT hover:bg-roseLight-DEFAULT/30 rounded-xl bg-transparent"
          onClick={() => setIsAddServiceOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Add Service
        </Button>
        <Button
          variant="outline"
          className="w-full border-roseLight-DEFAULT text-roseDark-DEFAULT hover:bg-roseLight-DEFAULT/30 rounded-xl bg-transparent"
          onClick={() => setIsCreateInvoiceOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" strokeWidth={2} />
          Create Invoice
        </Button>
      </CardContent>
    </Card>
  )
}
