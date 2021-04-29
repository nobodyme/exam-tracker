const constants = {
  URL: {
    EXAM: 'https://www.classmarker.com/',
    NEW_TAB: 'chrome://newtab/',
    API: 'https://oacbghzia2.execute-api.us-east-1.amazonaws.com/dev/v1/log'
  },
  TYPES: {
    COMPLETED: 'completed',
    NEW_TAB: 'newTab',
    WINDOW_CHANGE: 'windowChanged',
    STARTED: 'started'
  }
};

async function postData(data = {}) {
  const response = await fetch(constants.URL.API, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

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
    chrome.storage.sync.get("email", ({ email }) => {
      if (email !== undefined) {
        console.log(`${email} not focused`);
        postData({ email, type: constants.TYPES.WINDOW_CHANGE})
          .then(data => {
            console.log(data);
        });
      }
    });
  }
});

/**
 * On tab switch
 */
chrome.tabs.onActivated.addListener(async function() {
  const { url } = await getCurrentTab();
  if (!url.startsWith(constants.URL.EXAM)) {
    chrome.storage.sync.get("email", ({ email }) => {
      if (email !== undefined) {
        console.log(`${email} tab changed ${url}`);
        postData({ email, type: constants.TYPES.NEW_TAB, url})
          .then(data => {
            console.log(data);
        });
      }
    });
  }
});

/**
 * On tab update,
 * triggered when a new tab is opened and something is searched
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, {url}) {
  if (!url.startsWith(constants.URL.EXAM) && url !== constants.URL.NEW_TAB) {
    chrome.storage.sync.get("email", ({ email }) => {
      if (email !== undefined) {
        console.log(`${email} tab updated ${url}`);
        postData({ email, type: constants.TYPES.NEW_TAB, url})
          .then(data => {
            console.log(data);
        });
      }
    });
  }
});