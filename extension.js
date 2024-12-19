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
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';


let entryRow1 = "";  let entryRow2 = ""; 
let entryRow12 = ""; let entryRow22 = "";
let entryRow13 = ""; let entryRow23 = "";
let entryRow14 = ""; let entryRow24 = "";
let entryRow15 = ""; let entryRow25 = "";
let entryRow16 = ""; let entryRow26 = "";

let toggleState1 = false; let toggleState2 = false; let toggleState3 = false;
let toggleState4 = false; let toggleState5 = false; let toggleState6 = false;

let initialState1 = 2; let initialState2 = 2; let initialState3 = 2;
let initialState4 = 2; let initialState5 = 2; let initialState6 = 2;

let buttonClick1 = 2; let buttonClick2 = 2; let buttonClick3 = 2;
let buttonClick4 = 2; let buttonClick5 = 2; let buttonClick6 = 2;

let shortcutId1; let shortcutId2; let shortcutId3; 
let shortcutId4; let shortcutId5; let shortcutId6;

const QuickToggle1 = GObject.registerClass(
class QuickToggle1 extends QuickToggle {
    constructor(title, icon) {
        super({
            title: _(title),
            iconName: icon,
            toggleMode: true,
        });
    }
});
const QuickToggle2 = GObject.registerClass(
class QuickToggle2 extends QuickToggle {
    constructor(title, icon) {
        super({
            title: _(title),
            iconName: icon,
            toggleMode: true,
        });
    }
});
const QuickToggle3 = GObject.registerClass(
class QuickToggle3 extends QuickToggle {
    constructor(title, icon) {
        super({
            title: _(title),
            iconName: icon,
            toggleMode: true,
        });
    }
});
const QuickToggle4 = GObject.registerClass(
class QuickToggle4 extends QuickToggle {
    constructor(title, icon) {
        super({
            title: _(title),
            iconName: icon,
            toggleMode: true,
        });
    }
    });
const QuickToggle5 = GObject.registerClass(
class QuickToggle5 extends QuickToggle {
    constructor(title, icon) {
        super({
            title: _(title),
            iconName: icon,
            toggleMode: true,
        });
    }
});
const QuickToggle6 = GObject.registerClass(
class QuickToggle6 extends QuickToggle {
    constructor(title, icon) {
        super({
            title: _(title),
            iconName: icon,
            toggleMode: true,
        });
    }
});

const MyIndicator1 = GObject.registerClass(
class MyIndicator1 extends SystemIndicator {
    constructor(settings) {
        super();

        let title1 = settings.get_string('entryrow3-setting');
        let icon1 = settings.get_string('entryrow4-setting').trim();
        let showIndicator1 = settings.get_boolean('showindicator1-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = icon1;

        this.toggle1 = new QuickToggle1(title1, icon1);
        this.toggle1.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle1);
        this.toggle1.checked = toggleState1;

        this.toggle1.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu1-setting')) {Main.panel.closeQuickSettings();}
            switch (buttonClick1) {
                case 0: if (this.toggle1.checked)  {executeCommand(this.toggle1.checked, entryRow1, entryRow2);} this.toggle1.checked = true; break; 
                case 1: if (!this.toggle1.checked) {executeCommand(this.toggle1.checked, entryRow1, entryRow2);} this.toggle1.checked = false; break; 
                case 2: {executeCommand(this.toggle1.checked, entryRow1, entryRow2);} break; 
            }
            toggleState1 = this.toggle1.checked;
            settings.set_boolean('togglestate1-setting', toggleState1);
            if (!showIndicator1) {this._indicator.visible = false;}
        });
        if (!showIndicator1) {this._indicator.visible = false;}
    }
});

const MyIndicator2 = GObject.registerClass(
class MyIndicator2 extends SystemIndicator {
    constructor(settings) {
        super();

        let title2 = settings.get_string('entryrow32-setting');
        let icon2 = settings.get_string('entryrow42-setting').trim();
        let showIndicator2 = settings.get_boolean('showindicator2-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = icon2;

        this.toggle2 = new QuickToggle2(title2, icon2);
        this.toggle2.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle2);
        this.toggle2.checked = toggleState2;

        this.toggle2.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu2-setting')) {Main.panel.closeQuickSettings();}
            switch (buttonClick2) {
                case 0: if (this.toggle2.checked)  {executeCommand(this.toggle2.checked, entryRow12, entryRow22);} this.toggle2.checked = true; break; 
                case 1: if (!this.toggle2.checked) {executeCommand(this.toggle2.checked, entryRow12, entryRow22);} this.toggle2.checked = false; break; 
                case 2: {executeCommand(this.toggle2.checked, entryRow12, entryRow22);} break; 
            }
            toggleState2 = this.toggle2.checked;
            settings.set_boolean('togglestate2-setting', toggleState2);
            if (!showIndicator2) {this._indicator.visible = false;}
        });
        if (!showIndicator2) {this._indicator.visible = false;}
    }
});

const MyIndicator3 = GObject.registerClass(
class MyIndicator3 extends SystemIndicator {
    constructor(settings) {
        super();
        
        let title3 = settings.get_string('entryrow33-setting');
        let icon3 = settings.get_string('entryrow43-setting').trim();
        let showIndicator3 = settings.get_boolean('showindicator3-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = icon3;

        this.toggle3 = new QuickToggle3(title3, icon3);
        this.toggle3.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle3);
        this.toggle3.checked = toggleState3;

        this.toggle3.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu3-setting')) {Main.panel.closeQuickSettings();}
            switch (buttonClick3) {
                case 0: if (this.toggle3.checked)  {executeCommand(this.toggle3.checked, entryRow13, entryRow23);} this.toggle3.checked = true; break; 
                case 1: if (!this.toggle3.checked) {executeCommand(this.toggle3.checked, entryRow13, entryRow23);} this.toggle3.checked = false; break; 
                case 2: {executeCommand(this.toggle3.checked, entryRow13, entryRow23);} break; 
            }
            toggleState3 = this.toggle3.checked;
            settings.set_boolean('togglestate3-setting', toggleState3);
            if (!showIndicator3) {this._indicator.visible = false;}
        });
        if (!showIndicator3) {this._indicator.visible = false;}
    }
});

const MyIndicator4 = GObject.registerClass(
class MyIndicator4 extends SystemIndicator {
    constructor(settings) {
        super();

        let title4 = settings.get_string('entryrow34-setting');
        let icon4 = settings.get_string('entryrow44-setting').trim();
        let showIndicator4 = settings.get_boolean('showindicator4-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = icon4;

        this.toggle4 = new QuickToggle4(title4, icon4);
        this.toggle4.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle4);
        this.toggle4.checked = toggleState4;

        this.toggle4.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu4-setting')) {Main.panel.closeQuickSettings();}
            switch (buttonClick4) {
                case 0: if (this.toggle4.checked)  {executeCommand(this.toggle4.checked, entryRow14, entryRow24);} this.toggle4.checked = true; break; 
                case 1: if (!this.toggle4.checked) {executeCommand(this.toggle4.checked, entryRow14, entryRow24);} this.toggle4.checked = false; break; 
                case 2: {executeCommand(this.toggle4.checked, entryRow14, entryRow24);} break; 
            }
            toggleState4 = this.toggle4.checked;
            settings.set_boolean('togglestate4-setting', toggleState4);
            if (!showIndicator4) {this._indicator.visible = false;}
        });
        if (!showIndicator4) {this._indicator.visible = false;}
    }
});

const MyIndicator5 = GObject.registerClass(
class MyIndicator5 extends SystemIndicator {
    constructor(settings) {
        super();

        let title5 = settings.get_string('entryrow35-setting');
        let icon5 = settings.get_string('entryrow45-setting').trim();
        let showIndicator5 = settings.get_boolean('showindicator5-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = icon5;

        this.toggle5 = new QuickToggle5(title5, icon5);
        this.toggle5.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle5);
        this.toggle5.checked = toggleState5;

        this.toggle5.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu5-setting')) {Main.panel.closeQuickSettings();}
            switch (buttonClick5) {
                case 0: if (this.toggle5.checked)  {executeCommand(this.toggle5.checked, entryRow15, entryRow25);} this.toggle5.checked = true; break; 
                case 1: if (!this.toggle5.checked) {executeCommand(this.toggle5.checked, entryRow15, entryRow25);} this.toggle5.checked = false; break; 
                case 2: {executeCommand(this.toggle5.checked, entryRow15, entryRow25);} break; 
            }
            toggleState5 = this.toggle5.checked;
            settings.set_boolean('togglestate5-setting', toggleState5);
            if (!showIndicator5) {this._indicator.visible = false;}
        });
        if (!showIndicator5) {this._indicator.visible = false;}
    }
});

const MyIndicator6 = GObject.registerClass(
class MyIndicator6 extends SystemIndicator {
    constructor(settings) {
        super();

        let title6 = settings.get_string('entryrow36-setting');
        let icon6 = settings.get_string('entryrow46-setting').trim();
        let showIndicator6 = settings.get_boolean('showindicator6-setting');

        this._indicator = this._addIndicator();
        this._indicator.iconName = icon6;

        this.toggle6 = new QuickToggle6(title6, icon6);
        this.toggle6.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(this.toggle6);
        this.toggle6.checked = toggleState6;

        this.toggle6.connect('notify::checked', () => {
            if (settings.get_boolean('closemenu6-setting')) {Main.panel.closeQuickSettings();}
            switch (buttonClick6) {
                case 0: if (this.toggle6.checked)  {executeCommand(this.toggle6.checked, entryRow16, entryRow26);} this.toggle6.checked = true; break; 
                case 1: if (!this.toggle6.checked) {executeCommand(this.toggle6.checked, entryRow16, entryRow26);} this.toggle6.checked = false; break; 
                case 2: {executeCommand(this.toggle6.checked, entryRow16, entryRow26);} break; 
            }
            toggleState6 = this.toggle6.checked;
            settings.set_boolean('togglestate6-setting', toggleState6);
            if (!showIndicator6) {this._indicator.visible = false;}
        });
        if (!showIndicator6) {this._indicator.visible = false;}
    }
});

function executeCommand(toggleChecked, commandChecked, commandUnchecked) {
    let command = toggleChecked ? commandChecked : commandUnchecked;
    console.log(`Custom Command Toggle extension attempting to execute command:\n${command}`);
    let [success, pid] = GLib.spawn_async(null, ["/bin/bash", "-c", command], null, GLib.SpawnFlags.SEARCH_PATH, null);
    if (!success) {
        console.log(`Error running command:\n${command}`);
    }
}

export default class CustomQuickToggleExtension extends Extension {
    enable() {
        
        this._settings = this.getSettings();
        const numToggleButtons = this._settings.get_int('numbuttons-setting');

        this._indicator1 = new MyIndicator1(this.getSettings());
        if (numToggleButtons >= 2) { this._indicator2 = new MyIndicator2(this.getSettings()); }
        if (numToggleButtons >= 3) { this._indicator3 = new MyIndicator3(this.getSettings()); }
        if (numToggleButtons >= 4) { this._indicator4 = new MyIndicator4(this.getSettings()); }
        if (numToggleButtons >= 5) { this._indicator5 = new MyIndicator5(this.getSettings()); }
        if (numToggleButtons >= 6) { this._indicator6 = new MyIndicator6(this.getSettings()); }

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
        
        // Watch for changes to text entry fields:
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

        this._settings.connect('changed::entryrow52-setting', (settings, key) => {
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

        this._settings.connect('changed::showindicator1-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::showindicator2-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::showindicator3-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::showindicator4-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::showindicator5-setting', (settings, key) => {
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::showindicator6-setting', (settings, key) => {
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::buttonclick1-setting', (settings, key) => {
            buttonClick1 = this._settings.get_int('buttonclick1-setting');
            if (buttonClick1 === 0) { toggleState1 = true; }
            if (buttonClick1 === 1) { toggleState1 = false; }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick2-setting', (settings, key) => {
            buttonClick2 = this._settings.get_int('buttonclick2-setting');
            if (buttonClick2 === 0) { toggleState2 = true; }
            if (buttonClick2 === 1) { toggleState2 = false; }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick3-setting', (settings, key) => {
            buttonClick3 = this._settings.get_int('buttonclick3-setting');
            if (buttonClick3 === 0) { toggleState3 = true; }
            if (buttonClick3 === 1) { toggleState3 = false; }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick4-setting', (settings, key) => {
            buttonClick4 = this._settings.get_int('buttonclick4-setting');
            if (buttonClick4 === 0) { toggleState4 = true; }
            if (buttonClick4 === 1) { toggleState4 = false; }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick5-setting', (settings, key) => {
            buttonClick5 = this._settings.get_int('buttonclick5-setting');
            if (buttonClick5 === 0) { toggleState5 = true; }
            if (buttonClick5 === 1) { toggleState5 = false; }
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::buttonclick6-setting', (settings, key) => {
            buttonClick6 = this._settings.get_int('buttonclick6-setting');
            if (buttonClick6 === 0) { toggleState6 = true; }
            if (buttonClick6 === 1) { toggleState6 = false; }
            refreshIndicator.call(this);
        });

        // Initial setup
        
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

        function checkDynamicState(command, callback) {
          try {
            let [success, pid] = GLib.spawn_async(
              null,
              ["/bin/bash", "-c", command],
              null,
              GLib.SpawnFlags.SEARCH_PATH |
                GLib.SpawnFlags.DO_NOT_REAP_CHILD |
                GLib.SpawnFlags.STDOUT_TO_DEV_NULL,
              null,
            );

            if (success) {
              GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status) => {
                try {
                  let result = status === 0; // Assuming exit code 0 means true
                  callback(result);
                } catch (e) {
                  console.log(`Error in dynamic state callback: ${e}`);
                  callback(false);
                }
              });
            } else {
              console.log("Failed to spawn command");
              callback(false);
            }
          } catch (e) {
            console.log(`Error checking dynamic state: ${e}`);
            callback(false);
          }
        }

        switch (initialState1) {
          case 0:
            toggleState1 = true;
            break;
          case 1:
            toggleState1 = false;
            break;
          case 2:
            toggleState1 = this._settings.get_boolean("togglestate1-setting");
            break;
          case 3:
            let cmd = this._settings.get_string("checkcommand1-setting");
            checkDynamicState(cmd, (result) => {
              toggleState1 = result;
              this._indicator1.toggle1.checked = result;
            });
            break;
        }

        switch (initialState2) {
          case 0:
            toggleState2 = true;
            this._settings.set_boolean("togglestate2-setting", true);
            break;
          case 1:
            toggleState2 = false;
            this._settings.set_boolean("togglestate2-setting", false);
            break;
          case 2:
            toggleState2 = this._settings.get_boolean("togglestate2-setting");
            break;
          case 3:
            let cmd = this._settings.get_string("checkcommand2-setting");
            checkDynamicState(cmd, (result) => {
              toggleState2 = result;
              this._indicator2.toggle1.checked = result;
            });
            break;
        }
        switch (initialState3) {
          case 0:
            toggleState3 = true;
            this._settings.set_boolean("togglestate3-setting", true);
            break;
          case 1:
            toggleState3 = false;
            this._settings.set_boolean("togglestate3-setting", false);
            break;
          case 2:
            toggleState3 = this._settings.get_boolean("togglestate3-setting");
            break;
          case 3:
            let cmd = this._settings.get_string("checkcommand3-setting");
            checkDynamicState(cmd, (result) => {
              toggleState3 = result;
              this._indicator3.toggle1.checked = result;
            });
            break;
        }
        switch (initialState4) {
          case 0:
            toggleState4 = true;
            this._settings.set_boolean("togglestate4-setting", true);
            break;
          case 1:
            toggleState4 = false;
            this._settings.set_boolean("togglestate4-setting", false);
            break;
          case 2:
            toggleState4 = this._settings.get_boolean("togglestate4-setting");
            break;
          case 3:
            let cmd = this._settings.get_string("checkcommand4-setting");
            checkDynamicState(cmd, (result) => {
              toggleState4 = result;
              this._indicator4.toggle1.checked = result;
            });
            break;
        }
        switch (initialState5) {
          case 0:
            toggleState5 = true;
            this._settings.set_boolean("togglestate5-setting", true);
            break;
          case 1:
            toggleState5 = false;
            this._settings.set_boolean("togglestate5-setting", false);
            break;
          case 2:
            toggleState5 = this._settings.get_boolean("togglestate5-setting");
            break;
          case 3:
            let cmd = this._settings.get_string("checkcommand5-setting");
            checkDynamicState(cmd, (result) => {
              toggleState5 = result;
              this._indicator5.toggle1.checked = result;
            });
            break;
        }
        switch (initialState6) {
          case 0:
            toggleState6 = true;
            this._settings.set_boolean("togglestate6-setting", true);
            break;
          case 1:
            toggleState6 = false;
            this._settings.set_boolean("togglestate6-setting", false);
            break;
          case 2:
            toggleState6 = this._settings.get_boolean("togglestate6-setting");
            break;
          case 3:
            let cmd = this._settings.get_string("checkcommand6-setting");
            checkDynamicState(cmd, (result) => {
              toggleState6 = result;
              this._indicator6.toggle1.checked = result;
            });
            break;
        }

        refreshIndicator.call(this);


        // Run commands at boot
        let toggleStates = [ toggleState1, toggleState2, toggleState3, toggleState4, toggleState5, toggleState6 ];
        for (let i = 1; i <= numToggleButtons; i++) {
            const runAtBootSetting = this._settings.get_boolean(`runcommandatboot${i}-setting`);
            const delayTime = this._settings.get_int(`delaytime${i}-setting`);
            const toggleState = toggleStates[i-1];
            let command = "";
            if (runAtBootSetting) {
                if (i===1) {command = `sleep ${delayTime} && ${toggleState ? entryRow1 : entryRow2}`;}
                if (i===2) {command = `sleep ${delayTime} && ${toggleState ? entryRow12 : entryRow22}`;}
                if (i===3) {command = `sleep ${delayTime} && ${toggleState ? entryRow13 : entryRow23}`;}
                if (i===4) {command = `sleep ${delayTime} && ${toggleState ? entryRow14 : entryRow24}`;}
                if (i===5) {command = `sleep ${delayTime} && ${toggleState ? entryRow15 : entryRow25}`;}
                if (i===6) {command = `sleep ${delayTime} && ${toggleState ? entryRow16 : entryRow26}`;}
                executeCommand(toggleState, command, command);
            }
        }
        
        // Refresh indicator after initial setup and if any text entry fields have changed
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

        this._timeOut = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3, () => {
            refreshIndicator.call(this);
            return GLib.SOURCE_REMOVE;
        });
    }

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
            GLib.Source.remove(this._timeOut);
            this._timeOut = null;
        }

        this._settings = null;
    }
}
