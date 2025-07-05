"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Copy, Heart, Trash2, Tag, ExternalLink, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useClipboard } from "@/contexts/clipboard-context"
import type { ClipboardItem as ClipboardItemType } from "@/types/clipboard"

interface ClipboardItemProps {
  item: ClipboardItemType
}

export function ClipboardItem({ item }: ClipboardItemProps) {
  const { deleteItem, toggleFavorite, copyToClipboard } = useClipboard()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(item.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTypeIcon = () => {
    switch (item.type) {
      case "url":
        return <ExternalLink className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const truncateContent = (content: string, maxLength = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="flex items-start gap-2 mb-2">
          {getTypeIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-mono break-all">{truncateContent(item.content)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
        </div>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 bg-transparent">
            <Copy className="w-3 h-3 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleFavorite(item.id)}
            className={`h-8 ${item.isFavorite ? "text-red-500" : ""}`}
          >
            <Heart className={`w-3 h-3 ${item.isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => deleteItem(item.id)}
          className="h-8 text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
