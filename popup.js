/* Main js file to control popup */

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*';

const DEFAULT = [UPPERCASE, LOWERCASE, NUMBERS, SPECIAL];

// Generate a random password based on reqs
let randomString = (len, charSets) => {
    let charSet = charSets.join('');
    let randomString = '';

    for (var i = 0; i < len; i++) {
        let randomPos = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPos, randomPos+1);
    }
    
    return randomString;
};

// Copy generated password to clipboard
let copyPassword = () => {
    $('#pwd').select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        // Display message
    } catch (err) {
        // Display error message
    }
};

// Menu item clicked, update UI
let updateMenu = (target) => {
    $('.menu .item, .content-tab').removeClass('active');
    $(`[data-tab="${target.data('tab')}"]`).addClass('active');
};

// Save the password options
let saveOptions = () => {
    let options = $('#options').serializeArray();
    chrome.storage.sync.set({options}, () => {
        console.log({options});
    });
};

// Load saved options into the form
let loadOptions = (options) => {
    for (var elem of options) {
        $(`[type="checkbox"][name="${elem.name}"]`).prop('checked', true);
        $(`[type="text"][name="${elem.name}"]`).val(elem.value);
    }

    $('#options').removeClass('loading');
};

// Set up events
$(document).ready(function() {
    $('#generate-pwd').on('click', () => {
        $('#pwd').val(randomString(16, DEFAULT));
    });

    $('#copy-pwd').on('click', () => {
        copyPassword();
    });

    $('.menu .item').on('click', (e) => {
        updateMenu($(e.currentTarget));
    });

    $('#options').on('change', (e) => {
        saveOptions();
    });

    chrome.storage.sync.get('options', (result) => {
        let options = result.hasOwnProperty('options') ? result.options : []; 
        loadOptions(options);
    });
});
