const examUrl = 'https://www.classmarker.com/';
const newTabUrl = 'chrome://newtab/';


async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * When chrome window is unfocused
 */
chrome.windows.onFocusChanged.addListener(async function(window) {
  if (window == chrome.windows.WINDOW_ID_NONE) {
    console.log('not focused');
  }
});

/**
 * On tab switch
 */
chrome.tabs.onActivated.addListener(async function() {
  const { url } = await getCurrentTab();
  if (!url.startsWith(examUrl)) {
    console.log('tab changed', url);
  }
});

/**
 * On tab update,
 * triggered when a new tab is opened and something is searched
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, {url}) {
  if (!url.startsWith(examUrl) && url !== newTabUrl) {
    console.log('tab updated', url);
  }
});