chrome.runtime.onMessage.addListener(function (msg, sender) {
    if ((msg.from === 'content') && (msg.subject === 'pwdInputAvailable')) {
        chrome.browserAction.setBadgeText({
            text: "!", 
            tabId: sender.tab.id
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#198f35'
        });
    }
});
