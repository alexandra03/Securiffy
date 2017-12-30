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

// Set up events
$(document).ready(function() {
    $('#generate-pwd').on('click', () => {
        $('#pwd').val(randomString(16, DEFAULT));
    });

    $('#copy-pwd').on('click', () => {
        copyPassword();
    });
});
