
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*';

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
            automatic: false,
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
        // serializeArray removes keys with a False val,
        // so we need to init things to False here to that
        // they'll actually save in Chrome's storage. True
        // vals will be set in the loop below.
        let reset = {
            lowercase: false,
            uppercase: false,
            numbers: false,
            special: false,
            automatic: false,
        };

        for (var opt of optionsList) {
            reset[opt.name] = opt.value;
        }
        this._setOptionsFromObject(reset);
    }

    _setOptionsFromObject(options) {
        Object.keys(options).forEach((key) => {
            this.options[key] = options[key];
        });
        this._saveOptionsToStorage();
    }

    _saveOptionsToStorage() {
        chrome.storage.sync.set({options: this.options}, () => {
            console.log("Saved options successfully");
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
    
    constructor(pwdInputAvailable) {
        if (!pwdInputAvailable) {
            $('#use-pwd').hide();
        }
    }

    // Commonly used elements
    getOptionsForm() { return $('#options'); }
    getPasswordText() { return $('#pwd'); }
    getPasswordContainer() {return $('#pwd-container'); }

    renderOptions(options) {
        Object.keys(options).forEach((key) => {
            $(`[type="checkbox"][name="${key}"]`).prop('checked', options[key]);
            $(`[type="number"][name="${key}"]`).val(options[key]);
            $(`[type="text"][name="${key}"]`).val(options[key]);
        });

        this.getOptionsForm().removeClass('loading');
    }

    updateMenu(target) {
        if (target.data('tab') === undefined) return;
        $('.menu .item, .content-tab').removeClass('active');
        $(`[data-tab="${target.data('tab')}"]`).addClass('active');
    }

    displayPassword(password) {
        this.getPasswordText().val(password);
        this.getPasswordContainer().show();
    }

    copyPassword() {
        this.getPasswordText().select();
        let success = undefined;

        try {
            success = document.execCommand('copy');
        } catch (err) {
            success = false;
        }

        let msgElem = success ? 
            $('#copy-success-msg') : 
            $('#copy-error-msg');

        msgElem.transition('fade up');
        setTimeout(() => {
            msgElem.transition('fade up')
        }, 2000);
    }
    
    usePassword() {
        let msgElem = $('#use-pwd-msg');

        msgElem.transition('fade up');
        setTimeout(() => {
            msgElem.transition('fade up')
        }, 2000);        
    }
}


class PasswordGeneratorController {

    constructor(pwdInputAvailable) {
        this.model = new PasswordGeneratorModel(this);
        this.view = new PasswordGeneratorView(pwdInputAvailable);
        this.bindEvents();
        this.password = '';
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

        $('#use-pwd').on('click', () => {
            this.usePassword();
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

    saveOptions() {
        let options = this.getOptionsForm().serializeArray();
        this.model.updateOptions(options);
    }

    updateMenu(target) {
        this.view.updateMenu(target);
    }

    generatePassword() {
        this.password = this.model.generatePassword();

        if (this.model.options.automatic) {
            this.usePassword();
        } else {
            this.view.displayPassword(this.password);
        }
    }

    copyPassword() {
        this.view.copyPassword();
    }

    usePassword() {
        let options = {
            active: true,
            currentWindow: true
        };

        let message = {
            from: 'popup', 
            subject: 'use-pwd', 
            password: this.password
        };

        chrome.tabs.query(options, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, message,
                (response) => {}
            );
        });

        this.view.usePassword();
    }
}
