/* jslint jasmine: true */
/*global wpOrt:false wp_ort_settings:false*/
(function(){
    "use strict";

    describe("wpOrt", function() {
        describe("addFormatButton()", function() {
            beforeEach(function() {
                window.mw = {loader: {using: jasmine.createSpy('loaderUsing')}};
            });
            afterEach(function() {
                delete window.mw;
                delete window.toolbarGadget;
            });
            it("registers a callback that creates the button", function() {
                window.toolbarGadget = {addButton: jasmine.createSpy('addButton')};
                wpOrt.addFormatButton();
                window.mw.loader.using.calls.mostRecent().args[1]();
                var addButtonParams = window.toolbarGadget.addButton.calls.mostRecent().args[0];
                expect(addButtonParams.onclick).toBeDefined();
            });
        });
        describe("fixText", function() {
            var rootElement;
            var textarea;
            beforeEach(function() {
                rootElement = document.createElement('div');
                textarea = document.createElement('textarea');
                textarea.setAttribute('id', 'wpTextbox1');
                textarea.textContent = '5-tego maja';
                rootElement.appendChild(textarea);
                document.body.appendChild(rootElement);
            });
            afterEach(function() {
                document.body.removeChild(rootElement);
            });
            it("sets fixed text in the input", function() {
                wpOrt.fixText();
                expect(textarea.value).toEqual('5 maja');
            });
            it("returns true if text was changed", function() {
                expect(wpOrt.fixText()).toBeTruthy();
            });
            it("returns false if text was not changed", function() {
                textarea.textContent = 'everything all right';
                expect(wpOrt.fixText()).toBeFalsy();
            });
        });
        describe("migrateSettings()", function() {
            beforeEach(function() {
                delete window.wp_ort_settings;
                delete wpOrt.settings;
            });
            describe("with no settings defined", function() {
                it("creates empty settings", function() {
                    wpOrt.migrateSettings();
                    expect(wpOrt.settings).toEqual({});
                });
            });
            describe("with some old settings defined", function() {
                it("copies only those settings", function() {
                    window.wp_ort_settings = {"kropki": 0, "typogr": 1};
                    wpOrt.migrateSettings();
                    expect(wpOrt.settings).toEqual({"fixAmericanNumbers": 0, "typography": 1});
                });
            });
            describe("with all old settings to true", function() {
                it("creates settings with all true", function() {
                    window.wp_ort_settings = {"interp": 1, "typogr": 1, "br": 1, "kropki": 1, "ryzykowne": 1};
                    wpOrt.migrateSettings();
                    expect(wpOrt.settings).toEqual({"interpunction": 1, "typography": 1, "fixBrs": 1, "fixAmericanNumbers": 1,
                        "risky": 1});
                });
            });
            describe("with all old settings to false", function() {
                it("creates settings with all false", function() {
                    window.wp_ort_settings = {"interp": 0, "typogr": 0, "br": 0, "kropki": 0, "ryzykowne": 0};
                    wpOrt.migrateSettings();
                    expect(wpOrt.settings).toEqual({"interpunction": 0, "typography": 0, "fixBrs": 0, "fixAmericanNumbers": 0,
                        "risky": 0});
                });
            });
            describe("with new settings", function() {
                it("leaves them untouched", function() {
                    window.wp_ort_settings = {"fixAmericanNumbers": 0, "typography": 1};
                    wpOrt.migrateSettings();
                    expect(wpOrt.settings).toEqual({"fixAmericanNumbers": 0, "typography": 1});
                });
            });
        });
        describe("updateSettingsFromPrompt()", function() {
            var originalSettings;
            beforeEach(function() {
                originalSettings = {risky: 0};
                wpOrt.settings = originalSettings;
            });
            afterEach(function() {
                wpOrt.settings = {};
            });
            it("sets settings to parsed user input", function() {
                wpOrt.updateSettingsFromPrompt('{"fixAmericanNumbers": 0, "typography": 1}');
                expect(wpOrt.settings).toEqual({"fixAmericanNumbers": 0, "typography": 1});
            });
            it("leaves old settings if user input is invalid", function() {
                wpOrt.updateSettingsFromPrompt("window.hacked = 'why do you use eval()?'");
                expect(window.hacked).not.toBeDefined();
                expect(wpOrt.settings).toEqual(originalSettings);
            });
        });
    });
})();
