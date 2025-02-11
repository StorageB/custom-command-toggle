/* backup.js
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
 
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';

import {gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

let fileName = 'toggles.ini';
let filePath = GLib.build_filenamev([GLib.get_home_dir(), fileName]);
const timestamp = new Date().toLocaleString();


export function exportConfiguration(numButtons, settings, window) {
    let keyFile = new GLib.KeyFile();

    //#region Header
    keyFile.set_comment(null, null,
        ` Custom Command Toggle \n` +
        ` Exported settings for the Custom Command Toggle extension \n` +
        ` File generated on ${timestamp} \n` +
        ` \n` +
        ` --- Settings Information ---\n` +
        ` button-name: <text> \n` +
        ` icon: <text> \n` +
        ` toggle-on-command: <command> \n` +
        ` toggle-off-command: <command> \n` +
        ` initial-state: 0, 1, 2, or 3 \n` +
        `     0 = On \n` +
        `     1 = Off \n` +
        `     2 = Previous state \n` +
        `     3 = Command output \n` +
        ` run-at-startup: true or false \n` +
        ` startup-delay-time: 0-10 (seconds) \n` +
        ` check-output-command: <command> \n` +
        ` search-term: <text> \n` +
        ` check-output-delay-time: 0-10 (seconds) \n` + 
        ` button-click-action: 0, 1, or 2 \n` +
        `     0 = Always on \n` +
        `     1 = Always off \n` +
        `     2 = Toggle \n` +
        ` check-exit-code: true or false \n` +
        ` show-indicator: true or false \n` +
        ` close-menu: true or false \n` +
        ` keyboard-shortcut: shortcut combination \n` +
        ` \n`
    );
    //#endregion Header


    //#region Export Settings
    for (let i = 1; i <= numButtons; i++) {
        
        let j = i === 1 ? '' : i;

        keyFile.set_string(`Toggle ${i}`, 'button-name', settings.get_string(`entryrow3${j}-setting`));
        keyFile.set_string(`Toggle ${i}`, 'icon', settings.get_string(`entryrow4${j}-setting`));
        keyFile.set_string(`Toggle ${i}`, 'toggle-on-command', settings.get_string(`entryrow1${j}-setting`));
        keyFile.set_string(`Toggle ${i}`, 'toggle-off-command', settings.get_string(`entryrow2${j}-setting`));
        keyFile.set_string(`Toggle ${i}`, 'initial-state', `${settings.get_int(`initialtogglestate${i}-setting`)}`);
        keyFile.set_string(`Toggle ${i}`, 'run-at-startup', `${settings.get_boolean(`runcommandatboot${i}-setting`)}`);
        keyFile.set_string(`Toggle ${i}`, 'startup-delay-time', `${settings.get_int(`delaytime${i}-setting`)}`);
        keyFile.set_string(`Toggle ${i}`, 'check-output-command', settings.get_string(`checkcommand${i}-setting`));
        keyFile.set_string(`Toggle ${i}`, 'search-term', settings.get_string(`checkregex${i}-setting`));
        keyFile.set_string(`Toggle ${i}`, 'check-output-delay-time', `${settings.get_int(`checkcommanddelaytime${i}-setting`)}`);
        keyFile.set_string(`Toggle ${i}`, 'button-click-action', `${settings.get_int(`buttonclick${i}-setting`)}`);
        keyFile.set_string(`Toggle ${i}`, 'check-exit-code', `${settings.get_boolean(`checkexitcode${i}-setting`)}`);
        keyFile.set_string(`Toggle ${i}`, 'show-indicator', `${settings.get_boolean(`showindicator${i}-setting`)}`);
        keyFile.set_string(`Toggle ${i}`, 'close-menu', `${settings.get_boolean(`closemenu${i}-setting`)}`); 
        const keybindings = settings.get_value(`keybinding${i}-setting`).deep_unpack();
        keyFile.set_string(`Toggle ${i}`, 'keyboard-shortcut', keybindings[0]);
    }
    //#endregion Export Settings


    //#region Save File
    try {
        keyFile.save_to_file(filePath);
        console.log(`[Custom Command Toggle] Toggle button settings exported to ${filePath}`);
        const toast = Adw.Toast.new(_(`Settings exported to: ${filePath}`));
        toast.set_timeout(3);
        toast.set_button_label(_('Open'));
        toast.connect('button-clicked', () => {
            // Determine if there is a default text editor available and open the saved file
            let appInfo = Gio.AppInfo.get_default_for_type('text/plain', false);
            if (appInfo) {
                appInfo.launch_uris([`file://${filePath}`], null);
            } else {
                const noAppDialog = new Gtk.MessageDialog({
                    transient_for: window,
                    modal: true,
                    text: _('Application Not Found'),
                    secondary_text: _
                        ('No default application found to open .ini files.\n\n' +
                            'The toggles.ini file can be opened and modified in any text editor. ' +
                            'To open the file, it may first be required to manually associate the .ini file ' +
                            'with the default text editor by doing the following:\n\n' +
                            '1. Open the home directory and locate the toggles.ini file\n' +
                            '2. Right-click on the file and select "Open with..."\n' +
                            '3. Choose a default text editor, and select the option "Always use for this file type"'
                        ),
                    buttons: Gtk.ButtonsType.CLOSE,
                });
                noAppDialog.connect('response', () => noAppDialog.destroy());
                noAppDialog.show();
            }
        });
        window.add_toast(toast);
    } catch (e) {
        console.log(`[Custom Command Toggle] Failed to export settings\n${e}`);
        const toast = Adw.Toast.new(_(`Export Error`));
        toast.set_timeout(3);
        toast.set_button_label(_('Details'));
        toast.connect('button-clicked', () => {
            let errorDialog = new Adw.MessageDialog({
                transient_for: window,
                modal: true,
                heading: _('Export Error'),
                body: _(`Failed to export settings\n\n${e}`),
            });
            errorDialog.add_response('ok', _('OK'));
            errorDialog.connect('response', () => errorDialog.destroy());
            errorDialog.show();
        });
        window.add_toast(toast);
    }
    //#endregion Save File
}
        