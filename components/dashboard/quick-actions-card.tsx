"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Plus, FileText } from "lucide-react"

interface QuickActionsCardProps {
  handleQuickAction: (tab: string, action: string) => void
}

export function QuickActionsCard({
  handleQuickAction,
}: QuickActionsCardProps) {
  return (
    <Card className="bg-black/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => handleQuickAction("bookings", "add")}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          New Booking
        </Button>
        <Button
          variant="outline"
          className="w-full border-white text-white hover:bg-gold rounded-xl bg-transparent"
          onClick={() => handleQuickAction("clients", "add")}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Add Client
        </Button>
        <Button
          variant="outline"
          className="w-full border-white text-white hover:bg-gold rounded-xl bg-transparent"
          onClick={() => handleQuickAction("services", "add")}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Add Service
        </Button>
        <Button
          variant="outline"
          className="w-full border-white text-white hover:bg-gold rounded-xl bg-transparent"
          onClick={() => handleQuickAction("invoices", "add")}
        >
          <FileText className="h-4 w-4 mr-2" strokeWidth={2} />
          Create Invoice
        </Button>
      </CardContent>
    </Card>
  )
}
