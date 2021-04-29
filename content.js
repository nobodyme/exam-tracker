function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function finished() {
  console.log('finished');
  chrome.storage.sync.set({ email: undefined });
}

function getEmail(email) {
  console.log('email', email);
  chrome.storage.sync.set({ email });
}

const bodyObserver = new MutationObserver(() => {
  const loginFrom = getElementByXpath('//*[@id="classmarker_body_div"]/div[1]/form');
  const emailInput = getElementByXpath('//*[@id="e_m"]');
  if (loginFrom !== null) {
    loginFrom.addEventListener('submit', () => getEmail(emailInput.value));
  }

  const finishButton = getElementByXpath('//*[@id="qfinish_confirm"]');
  if (finishButton !== null) {
    finishButton.addEventListener('click', finished);
  }
});

bodyObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});