/**
 * When chrome window is focused and unfocused
 */
chrome.windows.onFocusChanged.addListener(async function(window) {
  if (window == chrome.windows.WINDOW_ID_NONE) {
    console.log('not focused');
  }
});

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * On tab switch
 */
chrome.tabs.onActivated.addListener(async function() {
  const { url } = await getCurrentTab();
  if (!url.startsWith('https://www.classmarker.com/')) {
    console.log('tab changed', url);
  }
});