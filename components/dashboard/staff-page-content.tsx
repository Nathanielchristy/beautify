"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Eye, Trash2, Plus } from "lucide-react"
import type { Staff } from "@/types"
import { useDebounce } from "@/hooks/use-debounce"

interface StaffPageContentProps {
  staff: Staff[]
  setIsAddStaffOpen: (isOpen: boolean) => void
  setSelectedItem: (item: any) => void
  setIsViewDetailsOpen: (isOpen: boolean) => void
  openDeleteConfirm: (type: string, id: string, name: string) => void
}

export function StaffPageContent({
  staff,
  setIsAddStaffOpen,
  setSelectedItem,
  setIsViewDetailsOpen,
  openDeleteConfirm,
}: StaffPageContentProps) {
  const [staffSearch, setStaffSearch] = useState("")
  const debouncedStaffSearch = useDebounce(staffSearch, 300)

  const filteredStaff = useMemo(() => {
    if (!debouncedStaffSearch.trim()) return staff

    const searchTerm = debouncedStaffSearch.toLowerCase().trim()
    return staff.filter((member) => {
      const searchableText = `${member.name} ${member.specialty} ${member.email}`.toLowerCase()
      return searchableText.includes(searchTerm)
    })
  }, [staff, debouncedStaffSearch])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Management</h2>
          <p className="text-gray-600">Manage your team members</p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#f5d76e] to-[#d4af37] hover:from-[#e6c14c] hover:to-[#bfa235] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200
"
          onClick={() => setIsAddStaffOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <Card
            key={member.id}
            className="bg-black/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group rounded-2xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-yellow-500 shadow-md">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-600 to-yellow-400 text-black font-bold text-lg">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-300 text-lg">{member.name}</h3>
                  <Badge className="bg-yellow-500 text-black font-medium shadow-sm">
                    {member.specialty}
                  </Badge>
                </div>
              </div>


              <div className="space-y-4 rounded-xl border border-yellow-500 bg-black p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-300">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" strokeWidth={2} />
                    <span className="font-medium text-white">{member.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-300">Revenue</span>
                  <span className="font-medium text-yellow-400">${member.totalRevenue}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-300">Availability</span>
                  <span className="text-sm font-medium text-white">{member.availability}</span>
                </div>
              </div>


              <div className="flex space-x-2 mt-4 pt-4 border-t border-roseLight-DEFAULT">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl bg-transparent border-roseLight-DEFAULT hover:bg-roseLight-DEFAULT/30"
                  onClick={() => {
                    setSelectedItem(member)
                    setIsViewDetailsOpen(true)
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" strokeWidth={2} />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-danger-DEFAULT border-danger-light hover:bg-danger-light/30 bg-transparent"
                  onClick={() => openDeleteConfirm("staff", member.id, member.name)}
                >
                  <Trash2 className="h-4 w-4 mr-1" strokeWidth={2} />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
