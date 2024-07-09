/* extension.js */

/*
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


let entryRow1 = "";  let entryRow2 = "";  let entryRow3 = "";  let entryRow4 = "";
let entryRow12 = ""; let entryRow22 = ""; let entryRow32 = ""; let entryRow42 = "";
let entryRow13 = ""; let entryRow23 = ""; let entryRow33 = ""; let entryRow43 = "";
let entryRow14 = ""; let entryRow24 = ""; let entryRow34 = ""; let entryRow44 = "";
let entryRow15 = ""; let entryRow25 = ""; let entryRow35 = ""; let entryRow45 = "";
let entryRow16 = ""; let entryRow26 = ""; let entryRow36 = ""; let entryRow46 = "";

let toggleState1 = false; let toggleState2 = false; let toggleState3 = false;
let toggleState4 = false; let toggleState5 = false; let toggleState6 = false;

let initialState1 = 2; let initialState2 = 2; let initialState3 = 2;
let initialState4 = 2; let initialState5 = 2; let initialState6 = 2;


const QuickToggle1 = GObject.registerClass(
class QuickToggle1 extends QuickToggle {
    constructor() {
        super({
            title: _(entryRow3),
            iconName: entryRow4.trim(),
            toggleMode: true,
        });
    }
});
const QuickToggle2 = GObject.registerClass(
class QuickToggle2 extends QuickToggle {
    constructor() {
        super({
            title: _(entryRow32),
            iconName: entryRow42.trim(),
            toggleMode: true,
        });
    }
});
const QuickToggle3 = GObject.registerClass(
class QuickToggle3 extends QuickToggle {
    constructor() {
        super({
            title: _(entryRow33),
            iconName: entryRow43.trim(),
            toggleMode: true,
        });
    }
});
const QuickToggle4 = GObject.registerClass(
class QuickToggle4 extends QuickToggle {
    constructor() {
        super({
            title: _(entryRow34),
            iconName: entryRow44.trim(),
            toggleMode: true,
        });
    }
    });
const QuickToggle5 = GObject.registerClass(
class QuickToggle5 extends QuickToggle {
    constructor() {
        super({
            title: _(entryRow35),
            iconName: entryRow45.trim(),
            toggleMode: true,
        });
    }
});
const QuickToggle6 = GObject.registerClass(
class QuickToggle6 extends QuickToggle {
    constructor() {
        super({
            title: _(entryRow36),
            iconName: entryRow46.trim(),
            toggleMode: true,
        });
    }
});

const MyIndicator1 = GObject.registerClass(
class MyIndicator1 extends SystemIndicator {
    constructor(settings) {
        super();

        this._indicator = this._addIndicator();
        this._indicator.iconName = entryRow4.trim();

        const toggle1 = new QuickToggle1();
        toggle1.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle1);
        toggle1.checked = toggleState1;

        toggle1.connect('notify::checked', () => {
            toggleState1 = toggle1.checked;
            settings.set_boolean('togglestate1-setting', toggleState1);
            executeCommand(toggle1.checked, entryRow1, entryRow2);
        });
    }
});

const MyIndicator2 = GObject.registerClass(
class MyIndicator2 extends SystemIndicator {
    constructor(settings) {
        super();

        this._indicator = this._addIndicator();
        this._indicator.iconName = entryRow42.trim();

        const toggle2 = new QuickToggle2();
        toggle2.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle2);
        toggle2.checked = toggleState2;

        toggle2.connect('notify::checked', () => {
            toggleState2 = toggle2.checked;
            settings.set_boolean('togglestate2-setting', toggleState2);
            executeCommand(toggle2.checked, entryRow12, entryRow22);
        });
    }
});

const MyIndicator3 = GObject.registerClass(
class MyIndicator3 extends SystemIndicator {
    constructor(settings) {
        super();
        
        this._indicator = this._addIndicator();
        this._indicator.iconName = entryRow43.trim();

        const toggle3 = new QuickToggle3();
        toggle3.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle3);
        toggle3.checked = toggleState3;

        toggle3.connect('notify::checked', () => {
            toggleState3 = toggle3.checked;
            settings.set_boolean('togglestate3-setting', toggleState3);
            executeCommand(toggle3.checked, entryRow13, entryRow23);
        });
    }
});

const MyIndicator4 = GObject.registerClass(
class MyIndicator4 extends SystemIndicator {
    constructor(settings) {
        super();

        this._indicator = this._addIndicator();
        this._indicator.iconName = entryRow44.trim();

        const toggle4 = new QuickToggle4();
        toggle4.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle4);
        toggle4.checked = toggleState4;

        toggle4.connect('notify::checked', () => {
            toggleState4 = toggle4.checked;
            settings.set_boolean('togglestate4-setting', toggleState4);
            executeCommand(toggle4.checked, entryRow14, entryRow24);
        });
    }
});

const MyIndicator5 = GObject.registerClass(
class MyIndicator5 extends SystemIndicator {
    constructor(settings) {
        super();

        this._indicator = this._addIndicator();
        this._indicator.iconName = entryRow45.trim();

        const toggle5 = new QuickToggle5();
        toggle5.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle5);
        toggle5.checked = toggleState5;

        toggle5.connect('notify::checked', () => {
            toggleState5 = toggle5.checked;
            settings.set_boolean('togglestate5-setting', toggleState5);
            executeCommand(toggle5.checked, entryRow15, entryRow25);
        });
    }
});

const MyIndicator6 = GObject.registerClass(
class MyIndicator6 extends SystemIndicator {
    constructor(settings) {
        super();

        this._indicator = this._addIndicator();
        this._indicator.iconName = entryRow46.trim();

        const toggle6 = new QuickToggle6();
        toggle6.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle6);
        toggle6.checked = toggleState6;

        toggle6.connect('notify::checked', () => {
            toggleState6 = toggle6.checked;
            settings.set_boolean('togglestate6-setting', toggleState6);
            executeCommand(toggle6.checked, entryRow16, entryRow26);
        });
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

        this._indicator1 = new MyIndicator1();
        if (numToggleButtons >= 2) { this._indicator2 = new MyIndicator2(this.getSettings()); }
        if (numToggleButtons >= 3) { this._indicator3 = new MyIndicator3(this.getSettings()); }
        if (numToggleButtons >= 4) { this._indicator4 = new MyIndicator4(this.getSettings()); }
        if (numToggleButtons >= 5) { this._indicator5 = new MyIndicator5(this.getSettings()); }
        if (numToggleButtons >= 6) { this._indicator6 = new MyIndicator6(this.getSettings()); }
        
        // Watch for changes to text entry fields:
        this._settings.connect('changed::entryrow1-setting', (settings, key) => {
            entryRow1 = this._settings.get_string('entryrow1-setting');
        });
        this._settings.connect('changed::entryrow2-setting', (settings, key) => {
            entryRow2 = this._settings.get_string('entryrow2-setting');
        });
        this._settings.connect('changed::entryrow3-setting', (settings, key) => {
            entryRow3 = this._settings.get_string('entryrow3-setting');
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow4-setting', (settings, key) => {
            entryRow4 = this._settings.get_string('entryrow4-setting');
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow12-setting', (settings, key) => {
            entryRow12 = this._settings.get_string('entryrow12-setting');
        });
        this._settings.connect('changed::entryrow22-setting', (settings, key) => {
            entryRow22 = this._settings.get_string('entryrow22-setting');
        });
        this._settings.connect('changed::entryrow32-setting', (settings, key) => {
            entryRow32 = this._settings.get_string('entryrow32-setting');
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow42-setting', (settings, key) => {
            entryRow42 = this._settings.get_string('entryrow42-setting');
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow13-setting', (settings, key) => {
            entryRow13 = this._settings.get_string('entryrow13-setting');
        });
        this._settings.connect('changed::entryrow23-setting', (settings, key) => {
            entryRow23 = this._settings.get_string('entryrow23-setting');
        });
        this._settings.connect('changed::entryrow33-setting', (settings, key) => {
            entryRow33 = this._settings.get_string('entryrow33-setting');
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow43-setting', (settings, key) => {
            entryRow43 = this._settings.get_string('entryrow43-setting');
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow14-setting', (settings, key) => {
            entryRow14 = this._settings.get_string('entryrow14-setting');
        });
        this._settings.connect('changed::entryrow24-setting', (settings, key) => {
            entryRow24 = this._settings.get_string('entryrow24-setting');
        });
        this._settings.connect('changed::entryrow34-setting', (settings, key) => {
            entryRow34 = this._settings.get_string('entryrow34-setting');
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow44-setting', (settings, key) => {
            entryRow44 = this._settings.get_string('entryrow44-setting');
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow52-setting', (settings, key) => {
            entryRow15 = this._settings.get_string('entryrow15-setting');
        });
        this._settings.connect('changed::entryrow25-setting', (settings, key) => {
            entryRow25 = this._settings.get_string('entryrow25-setting');
        });
        this._settings.connect('changed::entryrow35-setting', (settings, key) => {
            entryRow35 = this._settings.get_string('entryrow35-setting');
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow45-setting', (settings, key) => {
            entryRow45 = this._settings.get_string('entryrow45-setting');
            refreshIndicator.call(this);
        });

        this._settings.connect('changed::entryrow16-setting', (settings, key) => {
            entryRow16 = this._settings.get_string('entryrow16-setting');
        });
        this._settings.connect('changed::entryrow26-setting', (settings, key) => {
            entryRow26 = this._settings.get_string('entryrow26-setting');
        });
        this._settings.connect('changed::entryrow36-setting', (settings, key) => {
            entryRow36 = this._settings.get_string('entryrow36-setting');
            refreshIndicator.call(this);
        });
        this._settings.connect('changed::entryrow46-setting', (settings, key) => {
            entryRow46 = this._settings.get_string('entryrow46-setting');
            refreshIndicator.call(this);
        });

        // Initial setup
        entryRow1 = this._settings.get_string('entryrow1-setting');     // toggle on command
        entryRow2 = this._settings.get_string('entryrow2-setting');     // toggle off command
        entryRow3 = this._settings.get_string('entryrow3-setting');     // button text label
        entryRow4 = this._settings.get_string('entryrow4-setting');     // button icon

        entryRow12 = this._settings.get_string('entryrow12-setting');
        entryRow22 = this._settings.get_string('entryrow22-setting');
        entryRow32 = this._settings.get_string('entryrow32-setting');
        entryRow42 = this._settings.get_string('entryrow42-setting');

        entryRow13 = this._settings.get_string('entryrow13-setting');
        entryRow23 = this._settings.get_string('entryrow23-setting');
        entryRow33 = this._settings.get_string('entryrow33-setting');
        entryRow43 = this._settings.get_string('entryrow43-setting');

        entryRow14 = this._settings.get_string('entryrow14-setting');
        entryRow24 = this._settings.get_string('entryrow24-setting');
        entryRow34 = this._settings.get_string('entryrow34-setting');
        entryRow44 = this._settings.get_string('entryrow44-setting');

        entryRow15 = this._settings.get_string('entryrow15-setting');
        entryRow25 = this._settings.get_string('entryrow25-setting');
        entryRow35 = this._settings.get_string('entryrow35-setting');
        entryRow45 = this._settings.get_string('entryrow45-setting');

        entryRow16 = this._settings.get_string('entryrow16-setting');
        entryRow26 = this._settings.get_string('entryrow26-setting');
        entryRow36 = this._settings.get_string('entryrow36-setting');
        entryRow46 = this._settings.get_string('entryrow46-setting');

        initialState1 = this._settings.get_int('initialtogglestate1-setting');
        initialState2 = this._settings.get_int('initialtogglestate2-setting');
        initialState3 = this._settings.get_int('initialtogglestate3-setting');
        initialState4 = this._settings.get_int('initialtogglestate4-setting');
        initialState5 = this._settings.get_int('initialtogglestate5-setting');
        initialState6 = this._settings.get_int('initialtogglestate6-setting');

        switch (initialState1) {
            case 0: toggleState1 = true;  this._settings.set_boolean('togglestate1-setting', true);  break;
            case 1: toggleState1 = false; this._settings.set_boolean('togglestate1-setting', false); break;
            case 2: toggleState1 = this._settings.get_boolean('togglestate1-setting');               break;
        }
        switch (initialState2) {
            case 0: toggleState2 = true;  this._settings.set_boolean('togglestate2-setting', true);  break;
            case 1: toggleState2 = false; this._settings.set_boolean('togglestate2-setting', false); break;
            case 2: toggleState2 = this._settings.get_boolean('togglestate2-setting');               break;
        }
        switch (initialState3) {
            case 0: toggleState3 = true;  this._settings.set_boolean('togglestate3-setting', true);  break;
            case 1: toggleState3 = false; this._settings.set_boolean('togglestate3-setting', false); break;
            case 2: toggleState3 = this._settings.get_boolean('togglestate3-setting');               break;
        }
        switch (initialState4) {
            case 0: toggleState4 = true;  this._settings.set_boolean('togglestate4-setting', true);  break;
            case 1: toggleState4 = false; this._settings.set_boolean('togglestate4-setting', false); break;
            case 2: toggleState4 = this._settings.get_boolean('togglestate4-setting');               break;
        }
        switch (initialState5) {
            case 0: toggleState5 = true;  this._settings.set_boolean('togglestate5-setting', true);  break;
            case 1: toggleState5 = false; this._settings.set_boolean('togglestate5-setting', false); break;
            case 2: toggleState5 = this._settings.get_boolean('togglestate5-setting');               break;
        }
        switch (initialState6) {
            case 0: toggleState6 = true;  this._settings.set_boolean('togglestate6-setting', true);  break;
            case 1: toggleState6 = false; this._settings.set_boolean('togglestate6-setting', false); break;
            case 2: toggleState6 = this._settings.get_boolean('togglestate6-setting');               break;
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

        if (this._timeOut) {
            GLib.Source.remove(this._timeOut);
            this._timeOut = null;
        }

        this._settings = null;
    }
}
