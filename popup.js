/* Securiffy */

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*';

const DEFAULT = [UPPERCASE, LOWERCASE, NUMBERS, SPECIAL];


class PasswordGeneratorModel {
    constructor(controller) {
        this._controller = controller;
        this.setDefaultOptions();
        this._loadOptionsFromStorage();
    }

    setDefaultOptions() {
        this.options = {
            length: 16,
            lowercase: true,
            uppercase: true,
            numbers: true,
            special: true,
            exclude_similar: false,
            mask: false,
            custom: ''
        };
    }

    _loadOptionsFromStorage() {
        chrome.storage.sync.get('options', (storedOptions) => {
            if (storedOptions.hasOwnProperty('options')) {
                this._setOptionsFromObject(storedOptions.options);
            }
            this._controller.renderOptions();
        });
    }

    updateOptions(optionsList) {
        for (var opt of optionsList) {
            this.options[opt.name] = opt.value;
        }
        this._saveOptionsToStorage();
    }

    _saveOptionsToStorage() {
        chrome.storage.sync.set({options: this.options}, () => {
            console.log("Saved options successfully");
        });
    }

    _setOptionsFromObject(options) {
        Object.keys(options).forEach((key) => {
            this.options[key] = options[key];
        });
    }

    generatePassword() {
        let charSet = this._getCharset();
        let password = '';
        
        for (var i = 0; i < this.options.length; i++) {
            let randomPos = Math.floor(Math.random() * charSet.length);
            password += charSet.substring(randomPos, randomPos+1);
        }
        return password;
    }

    _getCharset() {
        let charSet = '';
        if (this.options.lowercase) charSet += LOWERCASE;
        if (this.options.uppercase) charSet += UPPERCASE;
        if (this.options.numbers) charSet += NUMBERS;
        if (this.options.special) charSet += SPECIAL;
        return charSet;
    }

}

class PasswordGeneratorView {
    
    constructor() {

    }

    // Commonly used elements
    getOptionsForm() { return $('#options'); }
    getPasswordText() { return $('#pwd'); }
    getPasswordContainer() {return $('#pwd-container'); }

    renderOptions(options) {
        Object.keys(options).forEach((key) => {
            console.log(key, options[key])
            $(`[type="checkbox"][name="${key}"]`).prop('checked', options[key]=='on');
            $(`[type="number"][name="${key}"]`).val(options[key]);
            $(`[type="text"][name="${key}"]`).val(options[key]);
        });

        this.getOptionsForm().removeClass('loading');
    }

}


class PasswordGeneratorController {

    constructor() {
        this.model = new PasswordGeneratorModel(this);
        this.view = new PasswordGeneratorView();

        this.bindEvents();
    }


    // Commonly used elements
    getOptionsForm() { return $('#options'); }
    getPasswordText() { return $('#pwd'); }
    getPasswordContainer() {return $('#pwd-container'); }


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

    renderOptions() {
        this.view.renderOptions(this.model.options);
    }

    // Load saved options into the form
    loadOptions(result) {       
        let options = this.model.options;
        for (var opt of options) {
            $(`[type="checkbox"][name="${options[opt].name}"]`).prop('checked', true);
            $(`[type="number"][name="${options[opt].name}"]`).val(options[opt].value);
            $(`[type="text"][name="${options[opt].name}"]`).val(options[opt].value);
        }
        this.getOptionsForm().removeClass('loading');
    }

    // Save the password options to chrome storage
    saveOptions() {
        let options = this.getOptionsForm().serializeArray();
        this.model.updateOptions(options);
    }

    // Menu item clicked, update UI
    updateMenu(target) {
        if (target.data('tab') === undefined) return;
        $('.menu .item, .content-tab').removeClass('active');
        $(`[data-tab="${target.data('tab')}"]`).addClass('active');
    }

    // Generate password and display in span
    generatePassword() {
        let password = this.model.generatePassword();
        this.getPasswordText().val(password);
        this.getPasswordContainer().show();
    }

    // Copy generated password to clipboard
    copyPassword() {
        this.getPasswordText().select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            // Display message
        } catch (err) {
            // Display error message
        }
    }
}

$(document).ready(function() {
    new PasswordGeneratorController();
});
