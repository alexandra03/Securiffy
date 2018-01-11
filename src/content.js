// Send message to background.js
if ($('#password').length) {
    chrome.runtime.sendMessage({
        from:    'content',
        subject: 'pwdInputAvailable'
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        response({});
    }
});