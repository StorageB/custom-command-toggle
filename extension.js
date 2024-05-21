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


const {GLib, St} = imports.gi;

let entryRow1 = "";
let entryRow2 = "";
let entryRow3 = "";
let entryRow4 = "";
let command = "";


const QuickToggle1 = GObject.registerClass(
class QuickToggle1 extends QuickToggle {
    constructor() {
        super({
            title: _(entryRow3),
            iconName: entryRow4,
            toggleMode: true,
        });
    }
});

const MyIndicator = GObject.registerClass(
class MyIndicator extends SystemIndicator {
    constructor() {
        super();

        this._indicator = this._addIndicator();
        this._indicator.iconName = entryRow4;

        const toggle = new QuickToggle1();
        toggle.bind_property('checked',
            this._indicator, 'visible',
            GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle);

        toggle.connect('notify::checked', () => {
            // run command when quick toggle is turned on
            if (toggle.checked) {
                command = entryRow1;
                console.log(`Custom Command Toggle extension attempting to execute command:\n${command}`);
                let [success, pid] = GLib.spawn_async(null, ["/bin/bash", "-c", command], null, GLib.SpawnFlags.SEARCH_PATH, null);
                if (!success) {
                    console.log(`Error running command:\n${command}`);
                }
            }
            // run command when quick toggle is turned off
            if (!toggle.checked) {
                command = entryRow2; 
                console.log(`Custom Command Toggle extension attempting to execute command:\n${command}`);
                let [success, pid] = GLib.spawn_async(null, ["/bin/bash", "-c", command], null, GLib.SpawnFlags.SEARCH_PATH, null);
                if (!success) {
                    console.log(`Error running command:\n${command}`);
                }
            }
        });
    }
});

export default class CustomQuickToggleExtension extends Extension {
    enable() {
        this._indicator = new MyIndicator();
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);

        // Create a new GSettings object
        this._settings = this.getSettings();
        
        // Watch for changes to text entry fields:
        // toggle on command
        this._settings.connect('changed::entryrow1-setting', (settings, key) => {
            entryRow1 = this._settings.get_string('entryrow1-setting');
        });
        // toggle off command
        this._settings.connect('changed::entryrow2-setting', (settings, key) => {
            entryRow2 = this._settings.get_string('entryrow2-setting');
        });
        // toggle button text
        this._settings.connect('changed::entryrow3-setting', (settings, key) => {
            entryRow3 = this._settings.get_string('entryrow3-setting');
            refreshIndicator.call(this);
        });
        // toggle button icon
        this._settings.connect('changed::entryrow4-setting', (settings, key) => {
            entryRow4 = this._settings.get_string('entryrow4-setting');
            refreshIndicator.call(this);
        });

        // Initial setup
        entryRow1 = this._settings.get_string('entryrow1-setting');     // toggle on command
        entryRow2 = this._settings.get_string('entryrow2-setting');     // toggle off command
        entryRow3 = this._settings.get_string('entryrow3-setting');     // button text label
        entryRow4 = this._settings.get_string('entryrow4-setting');     // button icon
        refreshIndicator.call(this);

        // Refresh indicator after initial setup and if any text entry fields have changed
        function refreshIndicator() {
            this._indicator.quickSettingsItems.forEach(item => item.destroy());
            this._indicator.destroy();
            this._indicator = new MyIndicator();
            Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
        }
    }

    disable() {
        this._indicator.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
    }
}
