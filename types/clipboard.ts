export interface ClipboardItem {
  id: string
  content: string
  timestamp: number
  tags: string[]
  isFavorite: boolean
  userId: string
  type: "text" | "url" | "email"
}

export interface ClipboardContextType {
  items: ClipboardItem[]
  addItem: (content: string, tags?: string[]) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  copyToClipboard: (content: string) => Promise<void>
  loading: boolean
}
