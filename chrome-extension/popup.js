document.addEventListener("DOMContentLoaded", async () => {
  const searchBox = document.getElementById("searchBox")
  const clipboardList = document.getElementById("clipboardList")
  const openDashboardBtn = document.getElementById("openDashboard")

  let clipboardHistory = []

  // Load clipboard history
  const result = await window.chrome.storage.local.get(["clipboardHistory"])
  if (result.clipboardHistory) {
    clipboardHistory = result.clipboardHistory
  }

  function formatTimeAgo(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  function renderClipboardItems(items) {
    if (items.length === 0) {
      clipboardList.innerHTML = `
        <div class="empty-state">
          <p>No clipboard items found</p>
          <p style="font-size: 12px;">Start copying content to see it here</p>
        </div>
      `
      return
    }

    clipboardList.innerHTML = items
      .map(
        (item) => `
      <div class="clipboard-item" data-content="${encodeURIComponent(item.content)}">
        <div class="item-content">${item.content}</div>
        <div class="item-meta">
          <span>${formatTimeAgo(item.timestamp)}</span>
          <span class="item-type">${item.type}</span>
        </div>
      </div>
    `,
      )
      .join("")

    // Add click listeners to clipboard items
    document.querySelectorAll(".clipboard-item").forEach((item) => {
      item.addEventListener("click", async () => {
        const content = decodeURIComponent(item.dataset.content)
        try {
          await navigator.clipboard.writeText(content)
          // Visual feedback
          item.style.backgroundColor = "#dcfce7"
          setTimeout(() => {
            item.style.backgroundColor = ""
          }, 500)
        } catch (error) {
          console.error("Error copying to clipboard:", error)
        }
      })
    })
  }

  function filterItems(searchTerm) {
    const filtered = clipboardHistory.filter((item) => item.content.toLowerCase().includes(searchTerm.toLowerCase()))
    renderClipboardItems(filtered)
  }

  // Search functionality
  searchBox.addEventListener("input", (e) => {
    filterItems(e.target.value)
  })

  // Open dashboard button
  openDashboardBtn.addEventListener("click", () => {
    window.chrome.tabs.create({ url: "https://clipboard-manager-pi.vercel.app/" }) // Replace with your actual dashboard URL
  })

  // Initial render
  renderClipboardItems(clipboardHistory)
})
