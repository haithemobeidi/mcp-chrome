// Sidebar handler for MCP Chrome Extension
// This script handles opening the sidebar when the extension icon is clicked

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Open the side panel for the current window
    await chrome.sidePanel.open({
      windowId: tab.windowId
    });
  } catch (error) {
    console.log('Failed to open side panel:', error);
    // Fallback: try to open as popup if sidebar fails
    chrome.action.setPopup({popup: 'popup.html'});
  }
});

// Enable side panel on all tabs
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });