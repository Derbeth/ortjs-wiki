(function(attachToWindow) {
    "use strict";
    var wpOrt = {};
    wpOrt.ver = '0.4.0';

    wpOrt.OLD_ICON = '//upload.wikimedia.org/wikipedia/commons/9/9a/Button_wiktionary.png';
    wpOrt.NEW_ICON = '//commons.wikimedia.org/w/thumb.php?f=Veckans_samarbete.svg&width=22px';
    wpOrt.BUTTON_ID = 'wpOrtButton';

    wpOrt.start = function() {
        wpOrt.migrateSettings();
        jQuery(document).ready(function() {
            if (mw.config.get('wgAction') !== 'submit' && mw.config.get('wgAction') !== 'edit') {
                return;
            }

            wpOrt.addFormatButton();
        });
    };

    wpOrt.addFormatButton = function() {
        mw.loader.using("ext.gadget.lib-toolbar", function() {
            if (toolbarGadget.wikieditor) {
                wpOrt.icon = wpOrt.NEW_ICON;
            } else {
                wpOrt.icon = wpOrt.OLD_ICON;
            }
            toolbarGadget.addButton({
                title: 'Poprawianie pisowni ' + wpOrt.ver + ' (kliknij trzymając Shift by wywołać z innymi opcjami)',
                alt: 'Ort',
                id: wpOrt.BUTTON_ID,
                oldIcon: wpOrt.OLD_ICON,
                newIcon: wpOrt.NEW_ICON,
                onclick: function(evt) {
                    wpOrt.runOrt(evt.shiftKey);
                }
            });
        });
    };

    wpOrt.runOrt = function(askForOptions) {
        if (askForOptions) {
            wpOrt.updateSettingsFromPrompt(prompt("Parametry poprawiania ortografii", JSON.stringify(wpOrt.settings)));
        }
        if (wpOrt.fixText()) {
            console.log('Fixed spelling');
            wpOrt.putSummary();
            document.getElementById('wpSummary').scrollIntoView();
            document.getElementById('wpDiff').focus();
        } else {
            console.log('Spelling ok');
        }
    };

    wpOrt.updateSettingsFromPrompt = function(userSettings) {
        try {
            var newSettings = JSON.parse(userSettings);
            if (newSettings) {
                wpOrt.settings = newSettings;
            }
        } catch(e) {
            console.log('Invalid input', e.message);
        }
    };

    wpOrt.fixText = function() {
        var textarea = document.getElementById('wpTextbox1');
        var oldText = textarea.value;
        var newText = new Ort(wpOrt.settings).fix(oldText);
        textarea.value = newText;
        return oldText !== newText;
    };

    wpOrt.putSummary = function() {
        var sumText = '[[User:Derbeth/ort|automat. popr. pisowni]]';
        var el=document.getElementById('wpSummary');
        if (!el.value) {
            document.getElementById('wpMinoredit').checked = true;
        }
        if (el.value.indexOf(sumText) === -1) {
            if (el.value!=='') {
                el.value+=', ';
            }
            el.value += sumText;
        }
    };

    wpOrt.migrateSettings = function() {
        var oldSettings = window.wp_ort_settings;
        if (!oldSettings) {
            oldSettings = {};
        }
        var mapping = {
            "br": "fixBrs",
            "interp": "interpunction",
            "kropki": "fixAmericanNumbers",
            "ryzykowne": "risky",
            "typogr": "typography"
        };
        Object.keys(mapping).forEach(function(key) {
            if (oldSettings.hasOwnProperty(key)) {
                oldSettings[mapping[key]] = oldSettings[key];
                delete oldSettings[key];
            }
        });
        wpOrt.settings = oldSettings;
    };

    if (attachToWindow) {
        window.wpOrt = wpOrt;
    }
    if (window.mw !== undefined) {
        wpOrt.start();
    }
}(window.jasmine !== undefined));
