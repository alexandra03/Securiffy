/* Securiffy */

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*';

const DEFAULT = [UPPERCASE, LOWERCASE, NUMBERS, SPECIAL];

/* 
    Class to control the popup UI, password
    generation, and storage/retrieval of options
*/
class PasswordGenerator {

    constructor() {
        this.bindEvents();
        this.retrieveSavedOptions();
    }

    // Commonly used elements
    getOptionsForm() { return $('#options'); }
    getPasswordSpan() { return $('#pwd'); }

    // Set up event handlers
    bindEvents() {
        $('#generate-pwd').on('click', () => {
           this.generatePassword();
        });
    
        $('#copy-pwd').on('click', () => {
            this.copyPassword();
        });
    
        $('.menu .item').on('click', (e) => {
            this.updateMenu($(e.currentTarget));
        });
    
        this.getOptionsForm().on('change', (e) => {
            this.saveOptions();
        });
    }

    // Get saved options from chrome storage, send
    // to loadOptions to render results
    retrieveSavedOptions() {
        chrome.storage.sync.get('options', (result) => {
            this.options = result.hasOwnProperty('options') ? result.options : []; 
            this.loadOptions();
        });
    }

    // Load saved options into the form
    loadOptions() {
        for (var elem of this.options) {
            $(`[type="checkbox"][name="${elem.name}"]`).prop('checked', true);
            $(`[type="number"][name="${elem.name}"]`).val(elem.value);
            $(`[type="text"][name="${elem.name}"]`).val(elem.value);
        }
        this.getOptionsForm().removeClass('loading');
    }

    // Save the password options to chrome storage
    saveOptions() {
        let options = this.getOptionsForm().serializeArray();
        chrome.storage.sync.set({options}, () => {
            console.log("Saved options successfully");
        });
    }

    // Menu item clicked, update UI
    updateMenu(target) {
        $('.menu .item, .content-tab').removeClass('active');
        $(`[data-tab="${target.data('tab')}"]`).addClass('active');
    }

    // Generate password and display in span
    generatePassword() {
        let password = this.randomString(16, DEFAULT);
        this.getPasswordSpan().val(password);
    }

    // Copy generated password to clipboard
    copyPassword() {
        this.getPasswordSpan().select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            // Display message
        } catch (err) {
            // Display error message
        }
    }

    // Generate a random password based on reqs
    randomString(len, charSets) {
        let charSet = charSets.join('');
        let randomString = '';

        for (var i = 0; i < len; i++) {
            let randomPos = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPos, randomPos+1);
        }
        return randomString;
    }
}

$(document).ready(function() {
    new PasswordGenerator();
});
