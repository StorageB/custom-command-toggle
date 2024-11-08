/* prefs.js
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

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import {releaseNotes} from './about.js';
import {KeybindingRow} from './keybinding.js';

let numButtons = 1;

export default class CustomCommandTogglePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {

        window._settings = this.getSettings();

        // Number of toggle buttons to create
        numButtons = window._settings.get_int('numbuttons-setting');

        const pages = [];
        

        // Loop to create toggle button setting pages
        for (let pageIndex = 1; pageIndex <= numButtons; pageIndex++) {

            let buttonTitle = "";
            if (numButtons === 1) { buttonTitle = 'Toggle Button';
            } else { buttonTitle = `Button ${pageIndex}`; }

            const page = new Adw.PreferencesPage({
                title: _(buttonTitle),
                icon_name: 'utilities-terminal-symbolic',
            });
            window.add(page);
        
            const groups = [];
        
            // Group 1: Commands
            const group1 = new Adw.PreferencesGroup({
                title: _('Commands'),
                //description: _('Enter commands to run when the toggle button is switched.'),
            });
            page.add(group1);
            groups.push(group1);
        
            const entryRow1 = new Adw.EntryRow({
                title: _('Toggle ON command:'),
            });
            group1.add(entryRow1);
        
            const entryRow2 = new Adw.EntryRow({
                title: _('Toggle OFF command:'),
            });
            group1.add(entryRow2);
        
            // Group 2: Appearance
            const group2 = new Adw.PreferencesGroup({
                title: _('Appearance'),
                //description: _('Customize the toggle button name and icon.'),
            });
            page.add(group2);
            groups.push(group2);
        
            const entryRow3 = new Adw.EntryRow({
                title: _('Button name:'),
            });
            group2.add(entryRow3);
        
            const entryRow4 = new Adw.EntryRow({
                title: _('Icon:'),
            });
            group2.add(entryRow4);
        
            // Group 3: Startup Behavior
            const group3 = new Adw.PreferencesGroup({
                title: _('Startup Behavior'),
            });
            page.add(group3);
            groups.push(group3);

            const optionList = new Gtk.StringList();
            [_('On'), _('Off'), _('Previous state')].forEach(choice => optionList.append(choice));
        
            const comboRow = new Adw.ComboRow({
                title: _('Initial State'),
                subtitle: _('State of the toggle button at login/startup'),
                model: optionList,
                selected: window._settings.get_int(`initialtogglestate${pageIndex}-setting`),
            });
            group3.add(comboRow);
        
            const expanderRow = new Adw.ExpanderRow({
                title: _('Run Command at Startup'),
                subtitle: _('Run associated toggle command at login/startup'),
                show_enable_switch: true,
                expanded: window._settings.get_boolean(`runcommandatboot${pageIndex}-setting`),
                enable_expansion: window._settings.get_boolean(`runcommandatboot${pageIndex}-setting`),
            });
            expanderRow.connect('notify::expanded', widget => {
                expanderRow.enable_expansion = widget.expanded;
            });
            group3.add(expanderRow);
        
            const spinRow = new Adw.SpinRow({
                title: _('Delay Time (seconds)'),
                subtitle: _('Amount of time to delay command from running after startup \n' +
                    '(it may be required to allow other processes to finish loading before running the command)'),
                value: window._settings.get_int(`initialtogglestate${pageIndex}-setting`),
                adjustment: new Gtk.Adjustment({
                    lower: 0,
                    upper: 10,
                    step_increment: 1,
                    page_increment: 1,
                }),
            });
            expanderRow.add_row(spinRow);

            // Group 4: Toggle Behavior
            const group4 = new Adw.PreferencesGroup({
                title: _('Toggle Behavior'),
            });
            groups.push(group4);

            const keybindRow = new KeybindingRow(
                window._settings,
                `keybinding${pageIndex}-setting`,
                _('Keyboard Shortcut')
            );
            keybindRow.add_suffix(keybindRow.resetButton);
            group4.add(keybindRow);
            
            const toggleList = new Gtk.StringList();
            [_('Always on'), _('Always off'), _('Toggle')].forEach(choice => toggleList.append(choice));
        
            const comboRow2 = new Adw.ComboRow({
                title: _('Button Click Action'),
                subtitle: _(
                    '• Toggle: Button will toggle on/off when clicked (default action)\n' +
                    '• Always on/off: Button will remain in the selected on or off state when clicked ' +
                    'and only execute the associated on or off command'
                ),
                model: toggleList,
            });
            group4.add(comboRow2);
            page.add(group4);

            const switchRow = new Adw.SwitchRow({
                title: _('Show Indicator Icon'),
                subtitle: _('Show top bar icon when toggle button is switched on'),
                active: window._settings.get_boolean(`showindicator${pageIndex}-setting`),
            });
            group4.add(switchRow);

            const switchRow2 = new Adw.SwitchRow({
                title: _('Close Menu After Button Press'),
                subtitle: _('Close quick settings menu immediately after clicking toggle button'),
                active: window._settings.get_boolean(`closemenu${pageIndex}-setting`),
            });
            group4.add(switchRow2);            

            // Bindings 
            let i = pageIndex;
            if (pageIndex === 1) {i='';}

            window._settings.bind(`entryrow1${i}-setting`, entryRow1, 'text', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`entryrow2${i}-setting`, entryRow2, 'text', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`entryrow3${i}-setting`, entryRow3, 'text', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`entryrow4${i}-setting`, entryRow4, 'text', Gio.SettingsBindFlags.DEFAULT);
        
            window._settings.bind(`initialtogglestate${pageIndex}-setting`, comboRow, 'selected', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`runcommandatboot${pageIndex}-setting`, expanderRow, 'expanded', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`delaytime${pageIndex}-setting`, spinRow, 'value', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`showindicator${pageIndex}-setting`, switchRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`closemenu${pageIndex}-setting`, switchRow2, 'active', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`buttonclick${pageIndex}-setting`, comboRow2, 'selected', Gio.SettingsBindFlags.DEFAULT);

            // Push the created page to the pages array
            pages.push(page);
        }
        

        // Information Page
        const infoPage = new Adw.PreferencesPage({
            title: _('Configuration'),
            icon_name: 'applications-system-symbolic',
        });
        window.add(infoPage);
        
        // Group 0: Settings
        const configGroup0 = new Adw.PreferencesGroup({
            title: _('Settings'),
        });
        infoPage.add(configGroup0);

        const spinRow0 = new Adw.SpinRow({
            title: _('Number of Toggle Buttons'),
            subtitle: _('Restart required for changes to take effect'),
            value: window._settings.get_int('numbuttons-setting'),
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 6,
                step_increment: 1,
                page_increment: 1,
            }),
        });
        configGroup0.add(spinRow0);
        
        window._settings.bind('numbuttons-setting', spinRow0, 'value', Gio.SettingsBindFlags.DEFAULT);
        
        // Group 1: Resources
        const configGroup1 = new Adw.PreferencesGroup({
            title: _('Resources'),
        });
        
        
        const configRow2 = new Adw.ActionRow({
            title: _('Icons'),
            subtitle: _(
                        'For a list of available icons, refer to the link below or navigate to the icon directory for your system\'s theme. ' +
                        'Enter the name of the icon (without the file extension), or leave blank for no icon. '
                       ),
            activatable: false,
        });
        
        const configRow3 = new Adw.ActionRow({
            title: _('Icon List'),
            subtitle: _('List of default symbolic icons'),
            activatable: true,
        });
        configRow3.connect('activated', () => {
            Gio.app_info_launch_default_for_uri('https://github.com/StorageB/icons/blob/main/GNOME46Adwaita/icons.md', null);
        });
        configRow3.add_prefix(new Gtk.Image({icon_name: 'web-browser-symbolic'}));
        configRow3.add_suffix(new Gtk.Image({icon_name: 'go-next-symbolic'}));
        
        const configRow4 = new Adw.ActionRow({
            title: _('Local Icons'),
            subtitle: _('Local icon directory (/usr/share/icons)'),
            activatable: true,
        });
        configRow4.connect('activated', () => {
            Gio.app_info_launch_default_for_uri('file:///usr/share/icons', null);
        });
        configRow4.add_prefix(new Gtk.Image({icon_name: 'folder-symbolic'}));
        configRow4.add_suffix(new Gtk.Image({icon_name: 'go-next-symbolic'}));
        
        // Group: About
        const aboutGroup = new Adw.PreferencesGroup({
            title: _('About'),
        });
        
        const aboutRow0 = new Adw.ActionRow({
            title: _('What\'s New'),
            subtitle: _('List of recent changes and improvements'),
            activatable: true,
        });
        aboutRow0.connect('activated', () => {
            const dialog = new Gtk.MessageDialog({
                transient_for: window,
                modal: true,
                text: _('Release Notes'),
                secondary_text: releaseNotes,
                buttons: Gtk.ButtonsType.CLOSE,
            });
            dialog.connect('response', () => dialog.destroy());
            dialog.show();
        });
        aboutRow0.add_prefix(new Gtk.Image({icon_name: 'dialog-information-symbolic'}));
        aboutRow0.add_suffix(new Gtk.Image({icon_name: 'go-next-symbolic'}));

        const aboutRow1 = new Adw.ActionRow({
            title: _('Homepage'),
            subtitle: _('GitHub page for additional information and bug reporting'),
            activatable: true,
        });
        aboutRow1.connect('activated', () => {
            Gio.app_info_launch_default_for_uri('https://github.com/StorageB/custom-command-toggle', null);
        });
        aboutRow1.add_prefix(new Gtk.Image({icon_name: 'go-home-symbolic'}));
        aboutRow1.add_suffix(new Gtk.Image({icon_name: 'go-next-symbolic'}));
        
        const aboutRow2 = new Adw.ActionRow({
            title: _('Extension Page'),
            subtitle: _('GNOME extension page'),
            activatable: true,
        });
        aboutRow2.connect('activated', () => {
            Gio.app_info_launch_default_for_uri('https://extensions.gnome.org/extension/7012/custom-command-toggle/', null);
        });
        aboutRow2.add_prefix(new Gtk.Image({icon_name: 'web-browser-symbolic'}));
        aboutRow2.add_suffix(new Gtk.Image({icon_name: 'go-next-symbolic'}));
        
        infoPage.add(configGroup1);
        configGroup1.add(configRow2);
        configGroup1.add(configRow3);
        configGroup1.add(configRow4);
        
        infoPage.add(aboutGroup);
        aboutGroup.add(aboutRow0);
        aboutGroup.add(aboutRow1);
        aboutGroup.add(aboutRow2);

    }
}
