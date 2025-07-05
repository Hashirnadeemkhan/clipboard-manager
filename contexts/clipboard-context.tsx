"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth } from "@/lib/firebase"
import type { ClipboardItem, ClipboardContextType } from "@/types/clipboard"

const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined)

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ClipboardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth)

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "clipboard-items"), where("userId", "==", user.uid), orderBy("timestamp", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clipboardItems: ClipboardItem[] = []
      snapshot.forEach((doc) => {
        clipboardItems.push({ id: doc.id, ...doc.data() } as ClipboardItem)
      })
      setItems(clipboardItems)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const detectContentType = (content: string): "text" | "url" | "email" => {
    const urlRegex = /^https?:\/\/.+/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (urlRegex.test(content)) return "url"
    if (emailRegex.test(content)) return "email"
    return "text"
  }

  const addItem = async (content: string, tags: string[] = []) => {
    if (!user) return

    try {
      await addDoc(collection(db, "clipboard-items"), {
        content,
        timestamp: Date.now(),
        tags,
        isFavorite: false,
        userId: user.uid,
        type: detectContentType(content),
      })
    } catch (error) {
      console.error("Error adding clipboard item:", error)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "clipboard-items", id))
    } catch (error) {
      console.error("Error deleting clipboard item:", error)
    }
  }

  const toggleFavorite = async (id: string) => {
    const item = items.find((item) => item.id === id)
    if (!item) return

    try {
      await updateDoc(doc(db, "clipboard-items", id), {
        isFavorite: !item.isFavorite,
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  return (
    <ClipboardContext.Provider
      value={{
        items,
        addItem,
        deleteItem,
        toggleFavorite,
        copyToClipboard,
        loading,
      }}
    >
      {children}
    </ClipboardContext.Provider>
  )
}

export function useClipboard() {
  const context = useContext(ClipboardContext)
  if (context === undefined) {
    throw new Error("useClipboard must be used within a ClipboardProvider")
  }
  return context
}
