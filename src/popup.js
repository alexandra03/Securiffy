/* Securiffy */

$(document).ready(function() {
    let options = {
        active: true,
        currentWindow: true
    };

    let message =  {
        from: 'popup', 
        subject: 'isPwdInputAvailable'
    };

    // Find out if there's a password input in the current
    // page, and start up the popup
    chrome.tabs.query(options, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message,
            (response) => {
                new PasswordGeneratorController(response.pwdInputAvailable);
            }
        );
    });
});
