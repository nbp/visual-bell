async function instrumentActiveTab() {
    // When toggled on, load a script in the active tab, to enable drawing on
    // the page. This returns a promise which succeed if the script is loaded.
    await browser.tabs.insertCSS({file: "/content/draw.css"});
    await browser.tabs.executeScript({file: "/content/draw.js"});
}

browser.browserAction.onClicked.addListener(instrumentActiveTab);
