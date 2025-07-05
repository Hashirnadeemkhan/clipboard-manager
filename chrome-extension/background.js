// Firebase configuration for Chrome extension
const firebaseConfig = {
  apiKey: "AIzaSyBmaksGfmaPuqfsy7mHgpRVIuwHRPD1nyc",
  authDomain: "multi-clipboard-ba1ec.firebaseapp.com",
  projectId: "multi-clipboard-ba1ec",
  storageBucket: "multi-clipboard-ba1ec.firebasestorage.app",
  messagingSenderId: "513448961883",
  appId: "1:513448961883:web:aff66986847701e5b99c7e",
  measurementId: "G-4CH69WNPMV"
};

// Initialize Firebase (you'll need to include Firebase SDK)
// This is a simplified version - you'll need to properly import Firebase

let clipboardHistory = []
const chrome = window.chrome // Declare the chrome variable

// Listen for clipboard events
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CLIPBOARD_COPY") {
    saveClipboardItem(message.content)
  } else if (message.type === "GET_CLIPBOARD_HISTORY") {
    sendResponse({ history: clipboardHistory })
  } else if (message.type === "COPY_TO_CLIPBOARD") {
    copyToClipboard(message.content)
  }
})

async function saveClipboardItem(content) {
  if (!content || content.trim() === "") return

  const item = {
    id: Date.now().toString(),
    content: content,
    timestamp: Date.now(),
    type: detectContentType(content),
  }

  // Save to local storage first
  clipboardHistory.unshift(item)
  if (clipboardHistory.length > 100) {
    clipboardHistory = clipboardHistory.slice(0, 100)
  }

  chrome.storage.local.set({ clipboardHistory })

  // TODO: Save to Firebase
  // You'll need to implement Firebase authentication and saving here
}

function detectContentType(content) {
  const urlRegex = /^https?:\/\/.+/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (urlRegex.test(content)) return "url"
  if (emailRegex.test(content)) return "email"
  return "text"
}

async function copyToClipboard(content) {
  try {
    await chrome.action.openPopup()
    // The actual copying will be handled by the popup
  } catch (error) {
    console.error("Error copying to clipboard:", error)
  }
}

// Load clipboard history on startup
chrome.storage.local.get(["clipboardHistory"], (result) => {
  if (result.clipboardHistory) {
    clipboardHistory = result.clipboardHistory
  }
})
