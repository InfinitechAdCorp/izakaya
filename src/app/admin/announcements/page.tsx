"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus, Edit, Trash2, Calendar, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Announcement {
  id: number
  title: string
  content: string
  isActive: boolean
  createdAt: string
}

export default function AnnouncementsPage() {
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Holiday Special Menu",
      content: "Check out our special holiday menu available from December 20-31!",
      isActive: true,
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      title: "Delivery Time Update",
      content: "Due to high demand, delivery times may be extended by 15-20 minutes.",
      isActive: true,
      createdAt: "2025-01-08",
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isActive: true,
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleCreate = () => {
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      isActive: formData.isActive,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setAnnouncements([newAnnouncement, ...announcements])
    setIsDialogOpen(false)
    setFormData({ title: "", content: "", isActive: true })
    toast({
      title: "Announcement Created",
      description: "Your announcement has been created successfully.",
    })
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      isActive: announcement.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleUpdate = () => {
    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((a) =>
          a.id === editingAnnouncement.id
            ? { ...a, title: formData.title, content: formData.content, isActive: formData.isActive }
            : a,
        ),
      )
      setIsDialogOpen(false)
      setEditingAnnouncement(null)
      setFormData({ title: "", content: "", isActive: true })
      toast({
        title: "Announcement Updated",
        description: "Your announcement has been updated successfully.",
      })
    }
  }

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id))
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been deleted.",
    })
  }

  const toggleActive = (id: number) => {
    setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)))
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-orange-50 to-red-50">
        <AppSidebar />
        <div className={`flex-1 min-w-0 ${isMobile ? "ml-0" : "ml-72"}`}>
          {isMobile && (
            <div className="sticky top-0 z-50 flex h-12 items-center gap-2 border-b bg-white/90 backdrop-blur-sm px-4 md:hidden shadow-sm">
              <SidebarTrigger className="-ml-1" />
              <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Announcements
              </span>
            </div>
          )}
          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-4xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-orange-600" />
                    공지사항 Announcements
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage customer announcements</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingAnnouncement(null)
                        setFormData({ title: "", content: "", isActive: true })
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
                      <DialogDescription>
                        {editingAnnouncement
                          ? "Update your announcement details"
                          : "Create a new announcement for your customers"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter announcement title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Enter announcement content"
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isActive">Active</Label>
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={editingAnnouncement ? handleUpdate : handleCreate}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        {editingAnnouncement ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Announcements List */}
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="bg-white/70 backdrop-blur-sm shadow-lg border-orange-100">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <Badge variant={announcement.isActive ? "default" : "secondary"}>
                              {announcement.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleActive(announcement.id)}>
                            {announcement.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(announcement)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(announcement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
                {announcements.length === 0 && (
                  <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-orange-100">
                    <CardContent className="text-center py-12">
                      <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No announcements yet</p>
                      <p className="text-sm text-gray-500 mt-1">Create your first announcement to get started</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
