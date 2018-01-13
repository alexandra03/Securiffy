const PWD_INPUT_AVAILABLE = $(':password').length;

const STYLES = {
    'background-color': '#21BA45',
    'color': 'white'
};

// Send message to background.js
if (PWD_INPUT_AVAILABLE) {
    chrome.runtime.sendMessage({
        from:    'content',
        subject: 'pwdInputAvailable'
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(
    function (msg, sender, response) {
        if (msg.from !== 'popup') return;
        
        let responseContent = {};

        if (msg.subject === 'use-pwd') {
            $(':password').val(msg.password).css(STYLES);
        } 
        else if (msg.subject === 'isPwdInputAvailable') {
            responseContent = {
                pwdInputAvailable: PWD_INPUT_AVAILABLE
            };
        }

        response(responseContent);
    }
);