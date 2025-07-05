"use client"

import { useState } from "react"
import { Plus, Search, Heart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useClipboard } from "@/contexts/clipboard-context"
import { ClipboardItem } from "./clipboard-item"

export function ClipboardDashboard() {
  const { items, addItem, loading } = useClipboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newTags, setNewTags] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredItems = items.filter(
    (item) =>
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const favoriteItems = filteredItems.filter((item) => item.isFavorite)
  const recentItems = filteredItems.slice(0, 20)

  const handleAddItem = async () => {
    if (!newContent.trim()) return

    const tags = newTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    await addItem(newContent, tags)
    setNewContent("")
    setNewTags("")
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading clipboard history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clipboard Manager</h1>
          <p className="text-muted-foreground">Manage your copied content history</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Clipboard Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter content to save..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="work, important, url..."
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search clipboard history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent ({recentItems.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Favorites ({favoriteItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6">
          {recentItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>No clipboard items found.</p>
                  <p className="text-sm mt-1">Start copying content or add items manually.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentItems.map((item) => (
                <ClipboardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favoriteItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>No favorite items yet.</p>
                  <p className="text-sm mt-1">Mark items as favorites to see them here.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {favoriteItems.map((item) => (
                <ClipboardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
