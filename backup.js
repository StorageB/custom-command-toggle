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

import {gettext as _, ngettext} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import {numberOfTogglesAllowed, SettingTypes, getSettingKey} from './settings-utils.js';

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
        ` check-status-command: <command> \n` +
        ` search-term: <text> \n` +
        ` initial-state: 0, 1, 2, or 3 \n` +
        `     0 = On \n` +
        `     1 = Off \n` +
        `     2 = Previous state \n` +
        `     3 = Command output \n` +
        ` run-at-startup: true or false \n` +
        ` startup-delay-time: 0-10 (seconds) \n` +
        ` check-status-delay-time: 0-10 (seconds) \n` +
        ` button-click-action: 0, 1, or 2 \n` +
        `     0 = Always on \n` +
        `     1 = Always off \n` +
        `     2 = Toggle \n` +
        ` check-exit-code: true or false \n` +
        ` show-indicator: true or false \n` +
        ` close-menu: true or false \n` +
        ` command-sync: true or false \n` +
        ` polling-frequency: 2-900 (seconds) \n` +
        ` keyboard-shortcut: <shortcut> \n` +
        ` enabled: true or false \n` +
        ` \n`
    );
    //#endregion Header


    //#region Export Settings
    for (let i = 1; i <= numButtons; i++) {
        keyFile.set_string(`Toggle ${i}`, 'button-name', settings.get_string(getSettingKey(i, SettingTypes.TITLE)));
        keyFile.set_string(`Toggle ${i}`, 'icon', settings.get_string(getSettingKey(i, SettingTypes.ICONS)));
        keyFile.set_string(`Toggle ${i}`, 'toggle-on-command', settings.get_string(getSettingKey(i, SettingTypes.COMMAND_ON)));
        keyFile.set_string(`Toggle ${i}`, 'toggle-off-command', settings.get_string(getSettingKey(i, SettingTypes.COMMAND_OFF)));
        keyFile.set_string(`Toggle ${i}`, 'check-status-command', settings.get_string(getSettingKey(i, SettingTypes.CHECK_COMMAND)));
        keyFile.set_string(`Toggle ${i}`, 'search-term', settings.get_string(getSettingKey(i, SettingTypes.CHECK_REGEX)));
        keyFile.set_string(`Toggle ${i}`, 'initial-state', `${settings.get_int(getSettingKey(i, SettingTypes.INITIAL_STATE))}`);
        keyFile.set_string(`Toggle ${i}`, 'run-at-startup', `${settings.get_boolean(getSettingKey(i, SettingTypes.RUN_COMMAND_AT_BOOT))}`);
        keyFile.set_string(`Toggle ${i}`, 'startup-delay-time', `${settings.get_int(getSettingKey(i, SettingTypes.DELAY_TIME))}`);
        keyFile.set_string(`Toggle ${i}`, 'check-status-delay-time', `${settings.get_int(getSettingKey(i, SettingTypes.CHECK_COMMAND_DELAY_TIME))}`);
        keyFile.set_string(`Toggle ${i}`, 'button-click-action', `${settings.get_int(getSettingKey(i, SettingTypes.BUTTON_CLICK))}`);
        keyFile.set_string(`Toggle ${i}`, 'check-exit-code', `${settings.get_boolean(getSettingKey(i, SettingTypes.CHECK_EXIT_CODE))}`);
        keyFile.set_string(`Toggle ${i}`, 'show-indicator', `${settings.get_boolean(getSettingKey(i, SettingTypes.SHOW_INDICATOR))}`);
        keyFile.set_string(`Toggle ${i}`, 'close-menu', `${settings.get_boolean(getSettingKey(i, SettingTypes.CLOSE_MENU))}`);
        keyFile.set_string(`Toggle ${i}`, 'command-sync', `${settings.get_boolean(getSettingKey(i, SettingTypes.CHECK_COMMAND_SYNC))}`);
        keyFile.set_string(`Toggle ${i}`, 'polling-frequency', `${settings.get_int(getSettingKey(i, SettingTypes.CHECK_COMMAND_INTERVAL))}`);
        const keybindings = settings.get_value(getSettingKey(i, SettingTypes.KEYBINDING)).deep_unpack();
        keyFile.set_string(`Toggle ${i}`, 'keyboard-shortcut', keybindings[0]);
        keyFile.set_string(`Toggle ${i}`, 'enabled', `${settings.get_boolean(getSettingKey(i, SettingTypes.ENABLED))}`);
    }
    //#endregion Export Settings


    //#region Save File
    try {
        keyFile.save_to_file(filePath);
        console.log(`[Custom Command Toggle] Toggle button settings exported to ${filePath}`);
        const toast = Adw.Toast.new(_('Settings exported to: %s').format(filePath));
        toast.set_timeout(4);
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
        const toast = Adw.Toast.new(_('Export Error'));
        toast.set_timeout(4);
        toast.set_button_label(_('Details'));
        toast.connect('button-clicked', () => {
            let errorDialog = new Adw.MessageDialog({
                transient_for: window,
                modal: true,
                heading: _('Export Error'),
                body: _('Failed to export settings\n\n%s').format(e),
            });
            errorDialog.add_response('ok', _('OK'));
            errorDialog.connect('response', () => errorDialog.destroy());
            errorDialog.show();
        });
        window.add_toast(toast);
    }
    //#endregion Save File
}


//#region Import
export function importConfiguration(settings, window) {

    let keyFile = new GLib.KeyFile();

    if (!GLib.file_test(filePath, GLib.FileTest.EXISTS)) {
        const toast = Adw.Toast.new(_('File not found'));
        toast.set_timeout(4);
        toast.set_button_label(_('Details'));
        toast.connect('button-clicked', () => {
            let errorDialog = new Adw.MessageDialog({
                transient_for: window,
                modal: true,
                heading: _('File Not Found'),
                body: _(
                    "The %s configuration file was not found in the user's home directory.\n\n" +
                    "Verify the following file exists:\n\n%s"
                ).format(fileName, filePath),
            });
            errorDialog.add_response('ok', _('OK'));
            errorDialog.connect('response', () => errorDialog.destroy());
            errorDialog.show();
        });
        window.add_toast(toast);
        console.log(`[Custom Command Toggle] Failed to import settings. File not found.`);
        return;
    }

    try {
        keyFile.load_from_file(filePath, GLib.KeyFileFlags.NONE);
    } catch (e) {
        console.log('[Custom Command Toggle] Failed to import configuration\n%s'.format(e));
        const toast = Adw.Toast.new(_('Import Error'));
        toast.set_timeout(4);
        toast.set_button_label(_('Details'));
        toast.connect('button-clicked', () => {
            let errorDialog = new Adw.MessageDialog({
                transient_for: window,
                modal: true,
                heading: _('Import Error'),
                body: _('Failed to import configuration\n\n%s').format(e),
            });
            errorDialog.add_response('ok', _('OK'));
            errorDialog.connect('response', () => errorDialog.destroy());
            errorDialog.show();
        });
        window.add_toast(toast);
        return;
    }

    let buttonCount = 0;

    for (let i = 1; i <= numberOfTogglesAllowed; i++) {

        if (keyFile.has_group(`Toggle ${i}`)) {

            buttonCount++;

            const getString = (k, def) => {
                try { return keyFile.get_string(`Toggle ${i}`, k); } catch (_) { return def; }
            };
            const getBool = (k, def) => {
                try { return keyFile.get_boolean(`Toggle ${i}`, k); } catch (_) { return def; }
            };
            const getInt = (k, def) => {
                try { return keyFile.get_integer(`Toggle ${i}`, k); } catch (_) { return def; }
            };

            let button_name          = getString('button-name', _('My Button'));
            let icon                 = getString('icon', 'face-smile-symbolic');
            let toggle_on_command    = getString('toggle-on-command', 'notify-send "Custom Command Toggle" "ON"');
            let toggle_off_command   = getString('toggle-off-command', 'notify-send "Custom Command Toggle" "OFF"');
            let check_status_command = getString('check-status-command', '');
            let search_term          = getString('search-term', '');
            let initial_state        = getInt('initial-state', 2);
            let run_at_startup       = getBool('run-at-startup', false);
            let startup_delay_time   = getInt('startup-delay-time', 3);
            let check_status_delay   = getInt('check-status-delay-time', 3);
            let button_click_action  = getInt('button-click-action', 2);
            let check_exit_code      = getBool('check-exit-code', false);
            let show_indicator       = getBool('show-indicator', true);
            let close_menu           = getBool('close-menu', false);
            let command_sync         = getBool('command-sync', false);
            let polling_frequency    = getInt('polling-frequency', 10);
            let keyboard_shortcut    = getString('keyboard-shortcut', '');
            let enabled              = getBool('enabled', true);

            if (initial_state < 0 || initial_state > 3) initial_state = 2;
            if (startup_delay_time < 0 || startup_delay_time > 10) startup_delay_time = 3;
            if (check_status_delay < 0 || check_status_delay > 10) check_status_delay = 3;
            if (button_click_action < 0 || button_click_action > 2) button_click_action = 2;
            if (polling_frequency < 2 || polling_frequency > 900) polling_frequency = 10;

            // Write to settings using new unified naming scheme
            settings.set_string(getSettingKey(buttonCount, SettingTypes.TITLE), button_name);
            settings.set_string(getSettingKey(buttonCount, SettingTypes.ICONS), icon);
            settings.set_string(getSettingKey(buttonCount, SettingTypes.COMMAND_ON), toggle_on_command);
            settings.set_string(getSettingKey(buttonCount, SettingTypes.COMMAND_OFF), toggle_off_command);
            settings.set_string(getSettingKey(buttonCount, SettingTypes.CHECK_COMMAND), check_status_command);
            settings.set_string(getSettingKey(buttonCount, SettingTypes.CHECK_REGEX), search_term);
            settings.set_int(getSettingKey(buttonCount, SettingTypes.INITIAL_STATE), initial_state);
            settings.set_boolean(getSettingKey(buttonCount, SettingTypes.RUN_COMMAND_AT_BOOT), run_at_startup);
            settings.set_int(getSettingKey(buttonCount, SettingTypes.DELAY_TIME), startup_delay_time);
            settings.set_int(getSettingKey(buttonCount, SettingTypes.CHECK_COMMAND_DELAY_TIME), check_status_delay);
            settings.set_int(getSettingKey(buttonCount, SettingTypes.BUTTON_CLICK), button_click_action);
            settings.set_boolean(getSettingKey(buttonCount, SettingTypes.CHECK_EXIT_CODE), check_exit_code);
            settings.set_boolean(getSettingKey(buttonCount, SettingTypes.SHOW_INDICATOR), show_indicator);
            settings.set_boolean(getSettingKey(buttonCount, SettingTypes.CLOSE_MENU), close_menu);
            settings.set_boolean(getSettingKey(buttonCount, SettingTypes.CHECK_COMMAND_SYNC), command_sync);
            settings.set_int(getSettingKey(buttonCount, SettingTypes.CHECK_COMMAND_INTERVAL), polling_frequency);
            settings.set_strv(getSettingKey(buttonCount, SettingTypes.KEYBINDING), keyboard_shortcut ? [keyboard_shortcut] : ['']);
            settings.set_boolean(getSettingKey(buttonCount, SettingTypes.ENABLED), enabled);
        }
    }

    if (buttonCount === 0) {
        const toast = Adw.Toast.new(_('No toggles found in %s.').format(fileName));
        toast.set_timeout(4);
        window.add_toast(toast);
        return;
    }

    settings.set_int('numbuttons', buttonCount === 0 ? 1 : buttonCount);
    console.log('[Custom Command Toggle] Configuration imported from %s'.format(filePath));

    const toast = Adw.Toast.new(
        ngettext(
            'Successfully imported %d toggle',
            'Successfully imported %d toggles',
            buttonCount
        ).format(buttonCount)
    );
    toast.set_timeout(4);
    window.add_toast(toast);

    //#endregion Import
}


export function reset(settings, window) {
    try {
        const schema = settings.settings_schema;
        const keys = schema.list_keys();

        for (const key of keys)
            settings.reset(key);

        const toast = Adw.Toast.new(_('All settings reset to defaults'));
        window.add_toast(toast);

        console.log('[Custom Command Toggle] All settings successfully reset to defaults');
    } catch (e) {
        console.log('[Custom Command Toggle] Failed to reset settings:', e);

        const errorToast = Adw.Toast.new(_('Failed to reset settings'));
        window.add_toast(errorToast);
    }
}
