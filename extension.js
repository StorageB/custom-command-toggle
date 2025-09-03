/* extension.js
 *
 * This file is part of the Custom Command Toggle GNOME Shell extension
 * https://github.com/StorageB/custom-command-toggle
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from 'gi://GObject';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import {QuickToggle, SystemIndicator} from 'resource:///org/gnome/shell/ui/quickSettings.js';

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';


let entryRow1 = "";  let entryRow2 = ""; 
let entryRow12 = ""; let entryRow22 = "";
let entryRow13 = ""; let entryRow23 = "";
let entryRow14 = ""; let entryRow24 = "";
let entryRow15 = ""; let entryRow25 = "";
let entryRow16 = ""; let entryRow26 = "";

let toggleStates = [false, false, false, false, false, false];

let initialState1 = 2; let initialState2 = 2; let initialState3 = 2;
let initialState4 = 2; let initialState5 = 2; let initialState6 = 2;

let buttonClick1 = 2; let buttonClick2 = 2; let buttonClick3 = 2;
let buttonClick4 = 2; let buttonClick5 = 2; let buttonClick6 = 2;

let shortcutId1; let shortcutId2; let shortcutId3; 
let shortcutId4; let shortcutId5; let shortcutId6;

let checkIntervals = [];
let isRunning = [];
let debug = false;


const myQuickToggle = GObject.registerClass(
class myQuickToggle extends QuickToggle {
    constructor(title, icon) {
        super({
            title: _(title),
            iconName: icon,
            toggleMode: true,
        });
    }
});


//#region Create Indicators
const MyIndicator1 = GObject.registerClass(
class MyIndicator1 extends SystemIndicator {
    constructor(settings) {
        super();

        let title1 = settings.get_string('entryrow3-setting');
        let iconSetting1 = settings.get_string('entryrow4-setting').trim();
        let [icon1on, icon1off] = iconSetting1.split(',').map(s => s.trim());
        if (!icon1off) icon1off = icon1on;
        let showIndicator1 = settings.get_boolean('showindicator1-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = toggleStates[0] ? icon1on : icon1off;

        this.toggle1 = new myQuickToggle(title1, toggleStates[0] ? icon1on : icon1off);
        this.toggle1.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle1);
        this.toggle1.checked = toggleStates[0];

        this.toggle1ConnectSignal = this.toggle1.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu1-setting')) {Main.panel.closeQuickSettings();}
            if (settings.get_int('buttonclick1-setting') === 2 && settings.get_boolean('checkexitcode1-setting')) {
                checkCommandExitCode(1, this.toggle1.checked, entryRow1, entryRow2, (exitCodeResult) => {
                    if (debug) console.log(`[Custom Command Toggle] Toggle 1 | Exit code status check: ${exitCodeResult ? 'passed' : 'failed'}${exitCodeResult ? '' : ' (toggle state not changed)'}`);              
                    if (!exitCodeResult) {
                        GObject.signal_handler_block(this.toggle1, this.toggle1ConnectSignal);
                        this.toggle1.checked = !this.toggle1.checked;
                        toggleStates[0] = this.toggle1.checked;
                        settings.set_boolean('togglestate1-setting', toggleStates[0]);
                        this._indicator.iconName = this.toggle1.checked ? icon1on : icon1off;
                        this.toggle1.iconName = this.toggle1.checked ? icon1on : icon1off;                        
                        if (!showIndicator1) {this._indicator.visible = false;}
                        GObject.signal_handler_unblock(this.toggle1, this.toggle1ConnectSignal);
                    }
                });
            } else {
                switch (buttonClick1) {
                    case 0: if (this.toggle1.checked)  {executeCommand(1, this.toggle1.checked, entryRow1, entryRow2);} this.toggle1.checked = true; break; 
                    case 1: if (!this.toggle1.checked) {executeCommand(1, this.toggle1.checked, entryRow1, entryRow2);} this.toggle1.checked = false; break; 
                    case 2: {executeCommand(1, this.toggle1.checked, entryRow1, entryRow2);} break; 
                }
            }
            toggleStates[0] = this.toggle1.checked;
            settings.set_boolean('togglestate1-setting', toggleStates[0]);
            if (!showIndicator1) this._indicator.visible = false;
            this._indicator.iconName = this.toggle1.checked ? icon1on : icon1off;
            this.toggle1.iconName = this.toggle1.checked ? icon1on : icon1off;
        });
        if (!showIndicator1) this._indicator.visible = false;
    }
});

const MyIndicator2 = GObject.registerClass(
class MyIndicator2 extends SystemIndicator {
    constructor(settings) {
        super();

        let title2 = settings.get_string('entryrow32-setting');
        let iconSetting2 = settings.get_string('entryrow42-setting').trim();
        let [icon2on, icon2off] = iconSetting2.split(',').map(s => s.trim());
        if (!icon2off) icon2off = icon2on;
        let showIndicator2 = settings.get_boolean('showindicator2-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = toggleStates[1] ? icon2on : icon2off;

        this.toggle2 = new myQuickToggle(title2, toggleStates[1] ? icon2on : icon2off);
        this.toggle2.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle2);
        this.toggle2.checked = toggleStates[1];

        this.toggle2ConnectSignal = this.toggle2.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu2-setting')) {Main.panel.closeQuickSettings();}
            if (settings.get_int('buttonclick2-setting') === 2 && settings.get_boolean('checkexitcode2-setting')) {
                checkCommandExitCode(2, this.toggle2.checked, entryRow12, entryRow22, (exitCodeResult) => {
                    if (debug) console.log(`[Custom Command Toggle] Toggle 2 | Exit code check: ${exitCodeResult ? 'passed' : 'failed'}${exitCodeResult ? '' : ' (toggle state not changed)'}`);                    
                    if (!exitCodeResult) {
                        GObject.signal_handler_block(this.toggle2, this.toggle2ConnectSignal);
                        this.toggle2.checked = !this.toggle2.checked;
                        toggleStates[1] = this.toggle2.checked;
                        settings.set_boolean('togglestate2-setting', toggleStates[1]);
                        this._indicator.iconName = this.toggle2.checked ? icon2on : icon2off;
                        this.toggle2.iconName = this.toggle2.checked ? icon2on : icon2off;                        
                        if (!showIndicator2) {this._indicator.visible = false;}                        
                        GObject.signal_handler_unblock(this.toggle2, this.toggle2ConnectSignal);
                    }
                });
            } else {
                switch (buttonClick2) {
                    case 0: if (this.toggle2.checked)  {executeCommand(2, this.toggle2.checked, entryRow12, entryRow22);} this.toggle2.checked = true; break; 
                    case 1: if (!this.toggle2.checked) {executeCommand(2, this.toggle2.checked, entryRow12, entryRow22);} this.toggle2.checked = false; break; 
                    case 2: {executeCommand(2, this.toggle2.checked, entryRow12, entryRow22);} break; 
                }
            }
            toggleStates[1] = this.toggle2.checked;
            settings.set_boolean('togglestate2-setting', toggleStates[1]);
            if (!showIndicator2) this._indicator.visible = false;
            this._indicator.iconName = this.toggle2.checked ? icon2on : icon2off;
            this.toggle2.iconName = this.toggle2.checked ? icon2on : icon2off;            
        });
        if (!showIndicator2) this._indicator.visible = false;
    }
});

const MyIndicator3 = GObject.registerClass(
class MyIndicator3 extends SystemIndicator {
    constructor(settings) {
        super();
        
        let title3 = settings.get_string('entryrow33-setting');
        let iconSetting3 = settings.get_string('entryrow43-setting').trim();
        let [icon3on, icon3off] = iconSetting3.split(',').map(s => s.trim());
        if (!icon3off) icon3off = icon3on;
        let showIndicator3 = settings.get_boolean('showindicator3-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = toggleStates[2] ? icon3on : icon3off;

        this.toggle3 = new myQuickToggle(title3, toggleStates[2] ? icon3on : icon3off);
        this.toggle3.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle3);
        this.toggle3.checked = toggleStates[2];

        this.toggle3ConnectSignal = this.toggle3.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu3-setting')) {Main.panel.closeQuickSettings();}
            if (settings.get_int('buttonclick3-setting') === 2 && settings.get_boolean('checkexitcode3-setting')) {
                checkCommandExitCode(3, this.toggle3.checked, entryRow13, entryRow23, (exitCodeResult) => {
                    if (debug) console.log(`[Custom Command Toggle] Toggle 3 | Exit code check: ${exitCodeResult ? 'passed' : 'failed'}${exitCodeResult ? '' : ' (toggle state not changed)'}`);
                    if (!exitCodeResult) {
                        GObject.signal_handler_block(this.toggle3, this.toggle3ConnectSignal);
                        this.toggle3.checked = !this.toggle3.checked;
                        toggleStates[2] = this.toggle3.checked;
                        settings.set_boolean('togglestate3-setting', toggleStates[2]);
                        this._indicator.iconName = this.toggle3.checked ? icon3on : icon3off;
                        this.toggle3.iconName = this.toggle3.checked ? icon3on : icon3off;                        
                        if (!showIndicator3) {this._indicator.visible = false;}                        
                        GObject.signal_handler_unblock(this.toggle3, this.toggle3ConnectSignal);
                    }
                });
            } else {
                switch (buttonClick3) {
                    case 0: if (this.toggle3.checked)  {executeCommand(3, this.toggle3.checked, entryRow13, entryRow23);} this.toggle3.checked = true; break; 
                    case 1: if (!this.toggle3.checked) {executeCommand(3, this.toggle3.checked, entryRow13, entryRow23);} this.toggle3.checked = false; break; 
                    case 2: {executeCommand(3, this.toggle3.checked, entryRow13, entryRow23);} break; 
                }
            }
            toggleStates[2] = this.toggle3.checked;
            settings.set_boolean('togglestate3-setting', toggleStates[2]);
            if (!showIndicator3) this._indicator.visible = false;
            this._indicator.iconName = this.toggle3.checked ? icon3on : icon3off;
            this.toggle3.iconName = this.toggle3.checked ? icon3on : icon3off;
        });
        if (!showIndicator3) this._indicator.visible = false;
    }
});

const MyIndicator4 = GObject.registerClass(
class MyIndicator4 extends SystemIndicator {
    constructor(settings) {
        super();

        let title4 = settings.get_string('entryrow34-setting');
        let iconSetting4 = settings.get_string('entryrow44-setting').trim();
        let [icon4on, icon4off] = iconSetting4.split(',').map(s => s.trim());
        if (!icon4off) icon4off = icon4on;
        let showIndicator4 = settings.get_boolean('showindicator4-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = toggleStates[3] ? icon4on : icon4off;

        this.toggle4 = new myQuickToggle(title4, toggleStates[3] ? icon4on : icon4off);
        this.toggle4.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle4);
        this.toggle4.checked = toggleStates[3];

        this.toggle4ConnectSignal = this.toggle4.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu4-setting')) {Main.panel.closeQuickSettings();}
            if (settings.get_int('buttonclick4-setting') === 2 && settings.get_boolean('checkexitcode4-setting')) {
                checkCommandExitCode(4, this.toggle4.checked, entryRow14, entryRow24, (exitCodeResult) => {
                    if (debug) console.log(`[Custom Command Toggle] Toggle 4 | Exit code check: ${exitCodeResult ? 'passed' : 'failed'}${exitCodeResult ? '' : ' (toggle state not changed)'}`);
                    if (!exitCodeResult) {
                        GObject.signal_handler_block(this.toggle4, this.toggle4ConnectSignal);
                        this.toggle4.checked = !this.toggle4.checked;
                        toggleStates[3] = this.toggle4.checked;
                        settings.set_boolean('togglestate4-setting', toggleStates[3]);
                        this._indicator.iconName = this.toggle4.checked ? icon4on : icon4off;
                        this.toggle4.iconName = this.toggle4.checked ? icon4on : icon4off;                        
                        if (!showIndicator4) {this._indicator.visible = false;}                        
                        GObject.signal_handler_unblock(this.toggle4, this.toggle4ConnectSignal);
                    }
                });
            } else {
                switch (buttonClick4) {
                    case 0: if (this.toggle4.checked)  {executeCommand(4, this.toggle4.checked, entryRow14, entryRow24);} this.toggle4.checked = true; break; 
                    case 1: if (!this.toggle4.checked) {executeCommand(4, this.toggle4.checked, entryRow14, entryRow24);} this.toggle4.checked = false; break; 
                    case 2: {executeCommand(4, this.toggle4.checked, entryRow14, entryRow24);} break; 
                }
            }
            toggleStates[3] = this.toggle4.checked;
            settings.set_boolean('togglestate4-setting', toggleStates[3]);
            if (!showIndicator4) this._indicator.visible = false;
            this._indicator.iconName = this.toggle4.checked ? icon4on : icon4off;
            this.toggle4.iconName = this.toggle4.checked ? icon4on : icon4off;
        });
        if (!showIndicator4) this._indicator.visible = false;
    }
});

const MyIndicator5 = GObject.registerClass(
class MyIndicator5 extends SystemIndicator {
    constructor(settings) {
        super();

        let title5 = settings.get_string('entryrow35-setting');
        let iconSetting5 = settings.get_string('entryrow45-setting').trim();
        let [icon5on, icon5off] = iconSetting5.split(',').map(s => s.trim());
        if (!icon5off) icon5off = icon5on;
        let showIndicator5 = settings.get_boolean('showindicator5-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = toggleStates[4] ? icon5on : icon5off;

        this.toggle5 = new myQuickToggle(title5, toggleStates[4] ? icon5on : icon5off);
        this.toggle5.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle5);
        this.toggle5.checked = toggleStates[4];

        this.toggle5ConnectSignal = this.toggle5.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu5-setting')) {Main.panel.closeQuickSettings();}
            if (settings.get_int('buttonclick5-setting') === 2 && settings.get_boolean('checkexitcode5-setting')) {
                checkCommandExitCode(5, this.toggle5.checked, entryRow15, entryRow25, (exitCodeResult) => {
                    if (debug) console.log(`[Custom Command Toggle] Toggle 5 | Exit code check: ${exitCodeResult ? 'passed' : 'failed'}${exitCodeResult ? '' : ' (toggle state not changed)'}`);
                    if (!exitCodeResult) {
                        GObject.signal_handler_block(this.toggle5, this.toggle5ConnectSignal);
                        this.toggle5.checked = !this.toggle5.checked;
                        toggleStates[4] = this.toggle5.checked;
                        settings.set_boolean('togglestate5-setting', toggleStates[4]);
                        this._indicator.iconName = this.toggle5.checked ? icon5on : icon5off;
                        this.toggle5.iconName = this.toggle5.checked ? icon5on : icon5off;                        
                        if (!showIndicator5) {this._indicator.visible = false;}                        
                        GObject.signal_handler_unblock(this.toggle5, this.toggle5ConnectSignal);
                    }
                });
            } else {
                switch (buttonClick5) {
                    case 0: if (this.toggle5.checked)  {executeCommand(5, this.toggle5.checked, entryRow15, entryRow25);} this.toggle5.checked = true; break; 
                    case 1: if (!this.toggle5.checked) {executeCommand(5, this.toggle5.checked, entryRow15, entryRow25);} this.toggle5.checked = false; break; 
                    case 2: {executeCommand(5, this.toggle5.checked, entryRow15, entryRow25);} break; 
                }
            }
            toggleStates[4] = this.toggle5.checked;
            settings.set_boolean('togglestate5-setting', toggleStates[4]);
            if (!showIndicator5) this._indicator.visible = false;
            this._indicator.iconName = this.toggle5.checked ? icon5on : icon5off;
            this.toggle5.iconName = this.toggle5.checked ? icon5on : icon5off;            
        });
        if (!showIndicator5) this._indicator.visible = false;
    }
});

const MyIndicator6 = GObject.registerClass(
class MyIndicator6 extends SystemIndicator {
    constructor(settings) {
        super();

        let title6 = settings.get_string('entryrow36-setting');
        let iconSetting6 = settings.get_string('entryrow46-setting').trim();
        let [icon6on, icon6off] = iconSetting6.split(',').map(s => s.trim());
        if (!icon6off) icon6off = icon6on;
        let showIndicator6 = settings.get_boolean('showindicator6-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = toggleStates[5] ? icon6on : icon6off;

        this.toggle6 = new myQuickToggle(title6, toggleStates[5] ? icon6on : icon6off);
        this.toggle6.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle6);
        this.toggle6.checked = toggleStates[5];

        this.toggle6ConnectSignal = this.toggle6.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu6-setting')) {Main.panel.closeQuickSettings();}
            if (settings.get_int('buttonclick6-setting') === 2 && settings.get_boolean('checkexitcode6-setting')) {
                checkCommandExitCode(6, this.toggle6.checked, entryRow16, entryRow26, (exitCodeResult) => {
                    if (debug) console.log(`[Custom Command Toggle] Toggle 6 | Exit code check: ${exitCodeResult ? 'passed' : 'failed'}${exitCodeResult ? '' : ' (toggle state not changed)'}`);
                    if (!exitCodeResult) {
                        GObject.signal_handler_block(this.toggle6, this.toggle6ConnectSignal);
                        this.toggle6.checked = !this.toggle6.checked;
                        toggleStates[5] = this.toggle6.checked;
                        settings.set_boolean('togglestate6-setting', toggleStates[5]);
                        this._indicator.iconName = this.toggle6.checked ? icon6on : icon6off;
                        this.toggle6.iconName = this.toggle6.checked ? icon6on : icon6off;
                        if (!showIndicator6) {this._indicator.visible = false;}                        
                        GObject.signal_handler_unblock(this.toggle6, this.toggle6ConnectSignal);
                    }
                });
            } else {
                switch (buttonClick6) {
                    case 0: if (this.toggle6.checked)  {executeCommand(6, this.toggle6.checked, entryRow16, entryRow26);} this.toggle6.checked = true; break; 
                    case 1: if (!this.toggle6.checked) {executeCommand(6, this.toggle6.checked, entryRow16, entryRow26);} this.toggle6.checked = false; break; 
                    case 2: {executeCommand(6, this.toggle6.checked, entryRow16, entryRow26);} break; 
                }
            }
            toggleStates[5] = this.toggle6.checked;
            settings.set_boolean('togglestate6-setting', toggleStates[5]);
            if (!showIndicator6) this._indicator.visible = false;
            this._indicator.iconName = this.toggle6.checked ? icon6on : icon6off;
            this.toggle6.iconName = this.toggle6.checked ? icon6on : icon6off;            
        });
        if (!showIndicator6) this._indicator.visible = false;
    }
});
//#endregion Create Indicators


//#region Execute Command
function executeCommand(toggleNumber, toggleChecked, commandChecked, commandUnchecked) {
    let command = toggleChecked ? commandChecked : commandUnchecked;
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Attempting to execute toggle command:`);
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | ${command.trim() === '' ? '(no command provided)' : command}`);
    if (command.trim() === "") return;

    let [success, pid] = GLib.spawn_async(null, ["/usr/bin/env", "bash", "-c", command], null, GLib.SpawnFlags.SEARCH_PATH, null);
    if (!success && debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Failed to spawn command`);
}
//#endregion Execute Command


//#region Check Exit Code
function checkCommandExitCode(toggleNumber, toggleChecked, commandChecked, commandUnchecked, exitCodeCallback) {
    let command = toggleChecked ? commandChecked : commandUnchecked;
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Attempting to execute toggle command with exit code status check:`);
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | ${command.trim() === '' ? '(no command provided)' : command}`);
    if (command.trim() === "") return;

    try {
        let [success, pid] = GLib.spawn_async(null, ["/usr/bin/env", "bash", "-c", command], null, GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD | GLib.SpawnFlags.STDOUT_TO_DEV_NULL, null);  
        if (success) {
            GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status) => {
                try {
                    let exitStatus = GLib.spawn_check_exit_status(status); 
                    exitCodeCallback(exitStatus);
                } catch (e) {
                    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Exit code check: ${e}`);
                    exitCodeCallback(false);
                }
            });
        } else {
            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Failed to spawn command`);
            exitCodeCallback(false);
        }
    } catch (e) {
        if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error checking command exit status: ${e}`);
        exitCodeCallback(false);
    }
}//#endregion Check Exit Code


export default class CustomQuickToggleExtension extends Extension {
    //#region Enable
    enable() {
        
        this._settings = this.getSettings();
        debug = this._settings.get_boolean(`debug-setting`);
        const numToggleButtons = this._settings.get_int('numbuttons-setting');
        if (debug) console.log(`[Custom Command Toggle] `);
        console.log(`[Custom Command Toggle] Extension enabled | Toggles created: ${numToggleButtons} | Detailed logging: ${debug}`);

        this._indicator1 = new MyIndicator1(this.getSettings());
        if (numToggleButtons >= 2) { this._indicator2 = new MyIndicator2(this.getSettings()); }
        if (numToggleButtons >= 3) { this._indicator3 = new MyIndicator3(this.getSettings()); }
        if (numToggleButtons >= 4) { this._indicator4 = new MyIndicator4(this.getSettings()); }
        if (numToggleButtons >= 5) { this._indicator5 = new MyIndicator5(this.getSettings()); }
        if (numToggleButtons >= 6) { this._indicator6 = new MyIndicator6(this.getSettings()); }


        //#region Keybindings
        shortcutId1 = Main.wm.addKeybinding(
            'keybinding1-setting', this._settings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.ALL,
            () => this._indicator1.toggle1.checked = !this._indicator1.toggle1.checked
        );
        shortcutId2 = Main.wm.addKeybinding(
            'keybinding2-setting', this._settings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.ALL,
            () => this._indicator2.toggle2.checked = !this._indicator2.toggle2.checked
        );
        shortcutId3 = Main.wm.addKeybinding(
            'keybinding3-setting', this._settings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.ALL,
            () => this._indicator3.toggle3.checked = !this._indicator3.toggle3.checked
        );
        shortcutId4 = Main.wm.addKeybinding(
            'keybinding4-setting', this._settings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.ALL,
            () => this._indicator4.toggle4.checked = !this._indicator4.toggle4.checked
        );
        shortcutId5 = Main.wm.addKeybinding(
            'keybinding5-setting', this._settings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.ALL,
            () => this._indicator5.toggle5.checked = !this._indicator5.toggle5.checked
        );
        shortcutId6 = Main.wm.addKeybinding(
            'keybinding6-setting', this._settings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.ALL,
            () => this._indicator6.toggle6.checked = !this._indicator6.toggle6.checked
        );
        //#endregion Keybindings

        
        //#region Settings Connections
        this._settings.connect('changed::entryrow1-setting', (settings, key) => {
            entryRow1 = this._settings.get_string('entryrow1-setting');
        });
        this._settings.connect('changed::entryrow2-setting', (settings, key) => {
            entryRow2 = this._settings.get_string('entryrow2-setting');
        });
        this._settings.connect('changed::entryrow3-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow4-setting', (settings, key) => {
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow12-setting', (settings, key) => {
            entryRow12 = this._settings.get_string('entryrow12-setting');
        });
        this._settings.connect('changed::entryrow22-setting', (settings, key) => {
            entryRow22 = this._settings.get_string('entryrow22-setting');
        });
        this._settings.connect('changed::entryrow32-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow42-setting', (settings, key) => {
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow13-setting', (settings, key) => {
            entryRow13 = this._settings.get_string('entryrow13-setting');
        });
        this._settings.connect('changed::entryrow23-setting', (settings, key) => {
            entryRow23 = this._settings.get_string('entryrow23-setting');
        });
        this._settings.connect('changed::entryrow33-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow43-setting', (settings, key) => {
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow14-setting', (settings, key) => {
            entryRow14 = this._settings.get_string('entryrow14-setting');
        });
        this._settings.connect('changed::entryrow24-setting', (settings, key) => {
            entryRow24 = this._settings.get_string('entryrow24-setting');
        });
        this._settings.connect('changed::entryrow34-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow44-setting', (settings, key) => {
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow15-setting', (settings, key) => {
            entryRow15 = this._settings.get_string('entryrow15-setting');
        });
        this._settings.connect('changed::entryrow25-setting', (settings, key) => {
            entryRow25 = this._settings.get_string('entryrow25-setting');
        });
        this._settings.connect('changed::entryrow35-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow45-setting', (settings, key) => {
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow16-setting', (settings, key) => {
            entryRow16 = this._settings.get_string('entryrow16-setting');
        });
        this._settings.connect('changed::entryrow26-setting', (settings, key) => {
            entryRow26 = this._settings.get_string('entryrow26-setting');
        });
        this._settings.connect('changed::entryrow36-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow46-setting', (settings, key) => {
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::buttonclick1-setting', (settings, key) => {
            buttonClick1 = this._settings.get_int('buttonclick1-setting');
            if (buttonClick1 === 0) { toggleStates[0] = true;  settings.set_boolean('togglestate1-setting', toggleStates[0]); }
            if (buttonClick1 === 1) { toggleStates[0] = false; settings.set_boolean('togglestate1-setting', toggleStates[0]); }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick2-setting', (settings, key) => {
            buttonClick2 = this._settings.get_int('buttonclick2-setting');
            if (buttonClick2 === 0) { toggleStates[1] = true;  settings.set_boolean('togglestate2-setting', toggleStates[1]); }
            if (buttonClick2 === 1) { toggleStates[1] = false; settings.set_boolean('togglestate2-setting', toggleStates[1]); }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick3-setting', (settings, key) => {
            buttonClick3 = this._settings.get_int('buttonclick3-setting');
            if (buttonClick3 === 0) { toggleStates[2] = true;  settings.set_boolean('togglestate3-setting', toggleStates[2]); }
            if (buttonClick3 === 1) { toggleStates[2] = false; settings.set_boolean('togglestate3-setting', toggleStates[2]); }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick4-setting', (settings, key) => {
            buttonClick4 = this._settings.get_int('buttonclick4-setting');
            if (buttonClick4 === 0) { toggleStates[3] = true;  settings.set_boolean('togglestate4-setting', toggleStates[3]); }
            if (buttonClick4 === 1) { toggleStates[3] = false; settings.set_boolean('togglestate4-setting', toggleStates[3]); }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick5-setting', (settings, key) => {
            buttonClick5 = this._settings.get_int('buttonclick5-setting');
            if (buttonClick5 === 0) { toggleStates[4] = true;  settings.set_boolean('togglestate5-setting', toggleStates[4]); }
            if (buttonClick5 === 1) { toggleStates[4] = false; settings.set_boolean('togglestate5-setting', toggleStates[4]); }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick6-setting', (settings, key) => {
            buttonClick6 = this._settings.get_int('buttonclick6-setting');
            if (buttonClick6 === 0) { toggleStates[5] = true;  settings.set_boolean('togglestate6-setting', toggleStates[5]); }
            if (buttonClick6 === 1) { toggleStates[5] = false; settings.set_boolean('togglestate6-setting', toggleStates[5]); }
            refreshIndicator.call(this);
        });

        let debounceIds = {};

        function debounce(i, func, delay = 500) {
            if (debounceIds[i]) GLib.source_remove(debounceIds[i]);
            debounceIds[i] = GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
                func();
                debounceIds[i] = null;
                return GLib.SOURCE_REMOVE;
            });
        }

        for (let i = 1; i <= numToggleButtons; i++) {
            this._settings.connect(`changed::initialtogglestate${i}-setting`,   () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::checkregex${i}-setting`,           () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::checkcommand${i}-setting`,         () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::checkcommandinterval${i}-setting`, () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::checkcommandsync${i}-setting`,     () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::showindicator${i}-setting`,        () => refreshIndicator.call(this));
        }

        this._settings.connect('changed::debug-setting', () => {
            debug = this._settings.get_boolean('debug-setting');
        });
        //#endregion Settings connections


        //#region Initial Setup
        entryRow1 = this._settings.get_string('entryrow1-setting');
        entryRow2 = this._settings.get_string('entryrow2-setting');
        entryRow12 = this._settings.get_string('entryrow12-setting');
        entryRow22 = this._settings.get_string('entryrow22-setting');
        entryRow13 = this._settings.get_string('entryrow13-setting');
        entryRow23 = this._settings.get_string('entryrow23-setting');
        entryRow14 = this._settings.get_string('entryrow14-setting');
        entryRow24 = this._settings.get_string('entryrow24-setting');
        entryRow15 = this._settings.get_string('entryrow15-setting');
        entryRow25 = this._settings.get_string('entryrow25-setting');
        entryRow16 = this._settings.get_string('entryrow16-setting');
        entryRow26 = this._settings.get_string('entryrow26-setting');

        initialState1 = this._settings.get_int('initialtogglestate1-setting');
        initialState2 = this._settings.get_int('initialtogglestate2-setting');
        initialState3 = this._settings.get_int('initialtogglestate3-setting');
        initialState4 = this._settings.get_int('initialtogglestate4-setting');
        initialState5 = this._settings.get_int('initialtogglestate5-setting');
        initialState6 = this._settings.get_int('initialtogglestate6-setting');

        buttonClick1 = this._settings.get_int('buttonclick1-setting');
        buttonClick2 = this._settings.get_int('buttonclick2-setting');
        buttonClick3 = this._settings.get_int('buttonclick3-setting');
        buttonClick4 = this._settings.get_int('buttonclick4-setting');
        buttonClick5 = this._settings.get_int('buttonclick5-setting');
        buttonClick6 = this._settings.get_int('buttonclick6-setting');
        
        const initialStates = [initialState1, initialState2, initialState3, initialState4, initialState5, initialState6];

        for (let i = 1; i <= numToggleButtons; i++) {
            let initialState = initialStates[i - 1];
            let toggleStateKey = `togglestate${i}-setting`;
        
            switch (initialState) {
                case 0:
                    toggleStates[i - 1] = true; 
                    this._settings.set_boolean(toggleStateKey, true); 
                    break;
                case 1:
                    toggleStates[i - 1] = false; 
                    this._settings.set_boolean(toggleStateKey, false);
                    break;
                case 2:
                    toggleStates[i - 1] = this._settings.get_boolean(toggleStateKey);
                    break;
                case 3:
                    setupCheckSync.call(this, i, { startup: true });
                    break;
            }

            if (initialState !== 3 && this._settings.get_boolean(`checkcommandsync${i}-setting`)) {
                setupCheckSync.call(this, i);
            }
        }
        //#endregion Initial Setup


        refreshIndicator.call(this);


        //#region Run at Boot
        for (let i = 1; i <= numToggleButtons; i++) {
            let runAtBootSetting = this._settings.get_boolean(`runcommandatboot${i}-setting`);
            if (this._settings.get_int(`initialtogglestate${i}-setting`)===3){runAtBootSetting = false;}
            const delayTime = this._settings.get_int(`delaytime${i}-setting`);
            const toggleState = toggleStates[i-1];
            let command = "";
            if (runAtBootSetting) {
                if (i===1) {command = `sleep ${delayTime} && (${toggleState ? entryRow1 : entryRow2})`;}
                if (i===2) {command = `sleep ${delayTime} && (${toggleState ? entryRow12 : entryRow22})`;}
                if (i===3) {command = `sleep ${delayTime} && (${toggleState ? entryRow13 : entryRow23})`;}
                if (i===4) {command = `sleep ${delayTime} && (${toggleState ? entryRow14 : entryRow24})`;}
                if (i===5) {command = `sleep ${delayTime} && (${toggleState ? entryRow15 : entryRow25})`;}
                if (i===6) {command = `sleep ${delayTime} && (${toggleState ? entryRow16 : entryRow26})`;}
                executeCommand(i, toggleState, command, command);
            }
        }
        //#endregion Run at Boot


        //#region Setup Check Sync
        function setupCheckSync(i, { startup = false } = {}) {
            isRunning[i - 1] = false;
            let toggleStateKey = `togglestate${i}-setting`;
            let key = this._settings.get_string(`checkregex${i}-setting`);
            let checkCommandDelayTime = this._settings.get_int(`checkcommanddelaytime${i}-setting`);
            let cmd = this._settings.get_string(`checkcommand${i}-setting`);
            let startupCmd = `sleep ${checkCommandDelayTime} && ( ${cmd} )`;

            if (checkIntervals[i - 1]) {
                GLib.source_remove(checkIntervals[i - 1]);
                checkIntervals[i - 1] = 0;
            }

            if (startup) {
                checkCommandOutput(i, startupCmd, key, (result) => {
                    toggleStates[i - 1] = result; 
                    this._settings.set_boolean(toggleStateKey, result);                 
                    refreshIndicator.call(this);
                });
            }     

            if (this._settings.get_boolean(`checkcommandsync${i}-setting`)) {
                let interval = Math.max(1, this._settings.get_int(`checkcommandinterval${i}-setting`));
                checkCommandOutput(i, cmd, key, (result) => {
                    if (toggleStates[i - 1] !== result) {
                        toggleStates[i - 1] = result;
                        this._settings.set_boolean(toggleStateKey, result);
                        refreshIndicator.call(this);
                    }
                });

                checkIntervals[i - 1] = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, interval, () => {
                    if (isRunning[i - 1]) {
                        if (debug) console.log(`[Custom Command Toggle] Toggle ${i} | Skipping command to avoid overlap`);
                        return GLib.SOURCE_CONTINUE;
                    }

                    isRunning[i - 1] = true;
                    checkCommandOutput(i, cmd, key, (result) => {
                        isRunning[i - 1] = false;
                        if (toggleStates[i - 1] !== result) {
                            toggleStates[i - 1] = result;
                            this._settings.set_boolean(toggleStateKey, result);
                            refreshIndicator.call(this);
                        }
                    });
                    return GLib.SOURCE_CONTINUE;
                });
            }
        }
        //#endregion Check Sync


        //#region Check Output
        function checkCommandOutput(toggleNumber, checkCommand, checkRegex, callback) {

            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Attempting to execute command with output check:`);
            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | ${checkCommand.trim() === '' ? '(no command provided)' : checkCommand}`);

            try {
                let [success, pid, stdinFd, stdoutFd, stderrFd] = GLib.spawn_async_with_pipes(
                    null,
                    ["/usr/bin/env", "bash", "-c", checkCommand],
                    null,
                    GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                    null
                );

                try { if (stdinFd !== -1) GLib.close(stdinFd); } catch (e) {}
                try { if (stderrFd !== -1) GLib.close(stderrFd); } catch (e) {}

                if (!success) {
                    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Failed to spawn command`);
                    callback(false);
                    return;
                }

                const baseStream = new Gio.UnixInputStream({ fd: stdoutFd, close_fd: true });
                const dataStream = new Gio.DataInputStream({ base_stream: baseStream });

                let didFinish = false;

                const timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
                    if (!didFinish) {
                        const isStartupCmd = checkCommand.trim().startsWith('sleep ');
                        if (debug && !isStartupCmd) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Timeout waiting for command response`);
                        cleanup();
                        if (!isStartupCmd) callback(false);
                    }
                    return GLib.SOURCE_REMOVE;
                });

                function cleanup() {
                    didFinish = true;
                    try { dataStream.close_async(GLib.PRIORITY_DEFAULT, null, () => {}); } catch (_) {}
                    try { baseStream.close_async(GLib.PRIORITY_DEFAULT, null, () => {}); } catch (_) {}
                }

                let chunks = [];

                function readNext() {
                    dataStream.read_bytes_async(4096, GLib.PRIORITY_DEFAULT, null, (stream, res) => {
                        try {
                            const bytes = stream.read_bytes_finish(res);
                            if (bytes.get_size() === 0) {
                                GLib.source_remove(timeoutId);
                                const output = new TextDecoder().decode(Uint8Array.from(chunks.flat())).trim();

                                if (debug) {
                                    console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Command output:`);
                                    if (output === '') {
                                        console.log(`[Custom Command Toggle] Toggle ${toggleNumber} |   (no output)`);
                                    } else {
                                        output.split('\n').forEach(line => {
                                            console.log(`[Custom Command Toggle] Toggle ${toggleNumber} |   ${line}`);
                                        });
                                    }
                                    console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Search term: ${checkRegex}`);
                                    console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Search term found in command output: ${output.includes(checkRegex)} ` +
                                                `(toggle set to ${output.includes(checkRegex) ? 'ON' : 'OFF'})`);

                                }
                                cleanup();
                                callback(output.includes(checkRegex));
                                return;
                            }

                            chunks.push([...bytes.get_data()]);
                            readNext();
                        } catch (e) {
                            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error reading output: ${e}`);
                            cleanup();
                            callback(false);
                        }
                    });
                }
                readNext();

                GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, () => {
                    try {
                        GLib.spawn_close_pid(pid);
                    } catch (e) {
                        if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error closing process: ${e}`);
                    }
                });

            } catch (e) {
                if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error running command: ${e}`);
                callback(false);
            }
        }//#endregion Check Output
        
        
        //#region Refresh indicator
        function refreshIndicator() {
            
            this._indicator1.quickSettingsItems.forEach(item => item.destroy());
            this._indicator1.destroy();
            this._indicator1 = new MyIndicator1(this.getSettings());
            Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator1);
            
            if (numToggleButtons >=2) {
                this._indicator2.quickSettingsItems.forEach(item => item.destroy());
                this._indicator2.destroy();
                this._indicator2 = new MyIndicator2(this.getSettings());
                Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator2);
            }
            if (numToggleButtons >=3) {
                this._indicator3.quickSettingsItems.forEach(item => item.destroy());
                this._indicator3.destroy();
                this._indicator3 = new MyIndicator3(this.getSettings());
                Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator3);
            }
            if (numToggleButtons >=4) {
                this._indicator4.quickSettingsItems.forEach(item => item.destroy());
                this._indicator4.destroy();
                this._indicator4 = new MyIndicator4(this.getSettings());
                Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator4);
            }
            if (numToggleButtons >=5) {
                this._indicator5.quickSettingsItems.forEach(item => item.destroy());
                this._indicator5.destroy();
                this._indicator5 = new MyIndicator5(this.getSettings());
                Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator5);
            }
            if (numToggleButtons >=6) {
                this._indicator6.quickSettingsItems.forEach(item => item.destroy());
                this._indicator6.destroy();
                this._indicator6 = new MyIndicator6(this.getSettings());
                Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator6);
            }
        }
        //#endregion Refresh Indicator

        this._timeOut = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3, () => {
            refreshIndicator.call(this);
            return GLib.SOURCE_REMOVE;
        });
    }
    //endregion Enable

    //#region Disable
    disable() {
        this._indicator1.quickSettingsItems.forEach(item => item.destroy());
        this._indicator1.destroy();
        this._indicator1 = null;

        if (this._indicator2) {
            this._indicator2.quickSettingsItems.forEach(item => item.destroy());
            this._indicator2.destroy();
            this._indicator2 = null;
        }
        if (this._indicator3) {
            this._indicator3.quickSettingsItems.forEach(item => item.destroy());
            this._indicator3.destroy();
            this._indicator3 = null;
        }
        if (this._indicator4) {
            this._indicator4.quickSettingsItems.forEach(item => item.destroy());
            this._indicator4.destroy();
            this._indicator4 = null;
        }
        if (this._indicator5) {
            this._indicator5.quickSettingsItems.forEach(item => item.destroy());
            this._indicator5.destroy();
            this._indicator5 = null;
        }
        if (this._indicator6) {
            this._indicator6.quickSettingsItems.forEach(item => item.destroy());
            this._indicator6.destroy();
            this._indicator6 = null;
        }

        if (shortcutId1) {
            Main.wm.removeKeybinding('keybinding1-setting');
            shortcutId1 = null;
        }
        if (shortcutId2) {
            Main.wm.removeKeybinding('keybinding2-setting');
            shortcutId2 = null;
        }
        if (shortcutId3) {
            Main.wm.removeKeybinding('keybinding3-setting');
            shortcutId3 = null;
        }
        if (shortcutId4) {
            Main.wm.removeKeybinding('keybinding4-setting');
            shortcutId4 = null;
        }
        if (shortcutId5) {
            Main.wm.removeKeybinding('keybinding5-setting');
            shortcutId5 = null;
        }
        if (shortcutId6) {
            Main.wm.removeKeybinding('keybinding6-setting');
            shortcutId6 = null;
        }

        if (this._timeOut) {
            GLib.source_remove(this._timeOut);
            this._timeOut = null;
        }

        if (this._debounceIds) {
            for (let id of Object.values(this._debounceIds)) {
                if (id) GLib.source_remove(id);
            }
            this._debounceIds = {};
        }        

        for (let id of checkIntervals) {
            if (id)
                GLib.source_remove(id);
        }
        checkIntervals = [];

        this._settings = null;

        console.log(`[Custom Command Toggle] Extension disabled`);
    }
    //#endregion Disable
}
