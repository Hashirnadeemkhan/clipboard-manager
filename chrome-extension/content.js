// Declare the chrome variable
const chrome = window.chrome

// Listen for copy events on the page
document.addEventListener("copy", (event) => {
  const selectedText = window.getSelection().toString()
  if (selectedText) {
    chrome.runtime.sendMessage({
      type: "CLIPBOARD_COPY",
      content: selectedText,
    })
  }
})

// Also listen for keyboard shortcuts
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "c") {
    setTimeout(() => {
      const selectedText = window.getSelection().toString()
      if (selectedText) {
        chrome.runtime.sendMessage({
          type: "CLIPBOARD_COPY",
          content: selectedText,
        })
      }
    }, 100)
  }
})
