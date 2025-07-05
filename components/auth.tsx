"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"

export function Auth() {
  const [user, loading] = useAuthState(auth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut(auth)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Welcome,</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Sign Up" : "Sign In"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
