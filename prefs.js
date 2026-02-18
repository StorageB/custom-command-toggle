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
import Gdk from 'gi://Gdk';
import GObject from 'gi://GObject';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import {KeybindingRow} from './keybinding.js';

import {exportConfiguration} from './backup.js';
import {importConfiguration} from './backup.js';
import {reset} from './backup.js';
import {showAboutDialog} from './about.js';

let numButtons = 1;

export default class CustomCommandTogglePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {

        window._settings = this.getSettings();
        const settings = window._settings;
        this.populateTogglePages(window);

        this._window = window;
        const page = new Adw.PreferencesPage();
        this._window.add(page);

        const menuModel = new Gio.Menu();

        const menuSection1 = new Gio.Menu();
        menuSection1.append(_("User Guide"), "app.userGuide");
        menuSection1.append(_("Icon List"), "app.iconList");

        const menuSection2 = new Gio.Menu();
        menuSection2.append(_("About"), "app.about");

        menuModel.append_section(null, menuSection1);
        menuModel.append_section(null, menuSection2);

        const menuButton = new Gtk.MenuButton({
            icon_name: "open-menu-symbolic",
            can_focus: false,
        });
        menuButton.add_css_class("flat");
        menuButton.set_tooltip_text(_('Help and resources'));
        menuButton.set_menu_model(menuModel);

        menuButton.connect('realize', () => {
            const popover = menuButton.get_popover();
            //popover.halign = Gtk.Align.START;
            //popover.set_has_arrow(false);
        });

        const actionGroup = new Gio.SimpleActionGroup();

        const iconListAction = new Gio.SimpleAction({ name: "iconList" });
        iconListAction.connect("activate", () => {
            Gio.app_info_launch_default_for_uri('https://storageb.github.io/custom-command-toggle/icons-adwaita/', null);
        });
        actionGroup.add_action(iconListAction);

        const userGuideAction = new Gio.SimpleAction({ name: "userGuide" });
        userGuideAction.connect("activate", () => {
            Gio.app_info_launch_default_for_uri('https://storageb.github.io/custom-command-toggle/', null);
        });
        actionGroup.add_action(userGuideAction);

        const aboutAction = new Gio.SimpleAction({ name: "about" });
        aboutAction.connect("activate", () => {
            showAboutDialog(window, this.metadata, this.path);
        });
        actionGroup.add_action(aboutAction);

        window.insert_action_group("app", actionGroup);

        const pagesStack = page.get_parent();
        const contentStack = pagesStack.get_parent().get_parent(); // GtkStack
        const preferences = contentStack.get_parent(); // GtkBox

        const headerBar = preferences
            .get_first_child()
            .get_next_sibling()
            .get_first_child()
            .get_first_child()
            .get_first_child(); // This gets the AdwHeaderBar

            this._window.remove(page);
            headerBar.pack_end(menuButton);
    }


    //#region Toggle Pages
    populateTogglePages(window) {

        if (this._pages) {
            this._pages.forEach(page => {
                window.remove(page);
            });
        }

        // Number of toggle buttons to create
        numButtons = window._settings.get_int('numbuttons');
        this._pages = [];

        // Loop to create toggle button setting pages
        for (let pageIndex = 1; pageIndex <= numButtons; pageIndex++) {

            let buttonTitle = "";
            if (numButtons === 1) { buttonTitle = _("Toggle Button");
            } else { buttonTitle = _("Button %d").format(pageIndex); }

            let isVisible = window._settings.get_boolean(`toggle${pageIndex}-enabled`);

            const page = new Adw.PreferencesPage({
                title: buttonTitle,
                icon_name: isVisible ? 'utilities-terminal-symbolic' : 'view-conceal-symbolic',
            });
            window.add(page);


            //#region Appearance
            const group2 = new Adw.PreferencesGroup({
                title: _('Appearance'),
            });
            page.add(group2);

            const hideButton = new Gtk.Button({
                icon_name:    isVisible ? 'view-reveal-symbolic' : 'view-conceal-symbolic',
                tooltip_text: isVisible ? _('Hide this toggle') : _('Show this toggle'),
            });
            hideButton.add_css_class('flat');

            hideButton.connect('clicked', () => {
                isVisible = !isVisible;
                window._settings.set_boolean(`toggle${pageIndex}-enabled`, isVisible);

                hideButton.icon_name =    isVisible ? 'view-reveal-symbolic' : 'view-conceal-symbolic';
                hideButton.tooltip_text = isVisible ? _('Hide this toggle') : _('Show this toggle');

                                [ onCommandRow, offCommandRow, buttonNameRow, iconRow, checkCommandRow, checkRegexRow,
                  comboRow, expanderRow, spinRow, spinRow2, comboRow2, switchRow, switchRow2, switchRow3,
                  commandSyncExpanderRow, pollingFreqSpinRow, keybindRow
                ].forEach(widget => widget.set_sensitive(isVisible));

                page.icon_name = isVisible ? 'utilities-terminal-symbolic' : 'view-conceal-symbolic';
            });

            group2.set_header_suffix(hideButton);

            const buttonNameRow = new Adw.EntryRow({
                title: _('Button name:'),
            });
            group2.add(buttonNameRow);

            const iconRow = new Adw.EntryRow({
                title: _('Icon:'),
            });
            group2.add(iconRow);
            //#endregion Appearance


            //#region Commands
            const group1 = new Adw.PreferencesGroup({
                title: _('Commands'),
            });
            page.add(group1);

            const onCommandRow = new Adw.EntryRow({
                title: _('Toggle ON Command:'),
            });
            group1.add(onCommandRow);

            const offCommandRow = new Adw.EntryRow({
                title: _('Toggle OFF Command:'),
            });
            group1.add(offCommandRow);

            const checkCommandRow = new Adw.EntryRow({
                title: _("Check Status Command:"),
            });
            group1.add(checkCommandRow);

            const checkRegexRow = new Adw.EntryRow({
                title: _("Check Status Search Term:"),
            });
            group1.add(checkRegexRow);
            //#endregion Commands


            //#region Startup Behavior
            const group3 = new Adw.PreferencesGroup({
                title: _('Startup Behavior'),
            });
            page.add(group3);

            const optionList = new Gtk.StringList();
            [_('On'), _('Off'), _('Previous state'), _('Command output')].forEach(choice => optionList.append(choice));
            const comboRow = new Adw.ComboRow({
                title: _('Initial State'),
                subtitle: _('State of the toggle button at login/startup'),
                model: optionList,
                selected: window._settings.get_int(`toggle${pageIndex}-initialstate`),
            });
            group3.add(comboRow);

            const checkCommandInfo = new Adw.ActionRow({
                title: _('Command Configuration'),
                subtitle: _(
                            "Enter the Check Status Command and Search Term in the Commands section above. " +
                            "If the specified Search Term appears in the command\'s output, the button will be set to ON at startup. " +
                            "Otherwise, the button will be set to OFF."
                           ),
                activatable: false,
            });
            checkCommandInfo.visible = comboRow.selected === 3;
            group3.add(checkCommandInfo);

            comboRow.connect("notify::selected", () => {
                checkCommandInfo.visible = comboRow.selected === 3;
                expanderRow.visible =  comboRow.selected === 0 || comboRow.selected === 1 || comboRow.selected === 2;
                spinRow2.visible = (comboRow.selected === 3);
            });

            const expanderRow = new Adw.ExpanderRow({
                title: _('Run Command at Startup'),
                subtitle: _('Run associated toggle command at login/startup'),
                show_enable_switch: true,
                expanded: window._settings.get_boolean(`toggle${pageIndex}-runcommandatboot`),
                enable_expansion: window._settings.get_boolean(`toggle${pageIndex}-runcommandatboot`),
            });
            expanderRow.visible =  comboRow.selected === 0 || comboRow.selected === 1 || comboRow.selected === 2;

            expanderRow.connect('notify::expanded', widget => {
                expanderRow.enable_expansion = widget.expanded;
            });
            group3.add(expanderRow);

            const spinRow = new Adw.SpinRow({
                title: _('Startup Delay (seconds)'),
                subtitle: _('Amount of time to delay command from running after startup'),
                adjustment: new Gtk.Adjustment({
                    lower: 0,
                    upper: 10,
                    step_increment: 1,
                    page_increment: 1,
                }),
            });
            expanderRow.add_row(spinRow);

            const spinRow2 = new Adw.SpinRow({
                title: _('Startup Delay (seconds)'),
                subtitle: _('Amount of time to delay command from running after startup'),
                adjustment: new Gtk.Adjustment({
                    lower: 0,
                    upper: 10,
                    step_increment: 1,
                    page_increment: 1,
                }),
            });
            spinRow2.visible =  (comboRow.selected === 3 && !window._settings.get_boolean(`toggle${pageIndex}-checkcommandsync`));
            group3.add(spinRow2);
            //#endregion Startup Behavior


            //#region Toggle Behavior
            const group4 = new Adw.PreferencesGroup({
                title: _('Toggle Behavior'),
            });

            const toggleList = new Gtk.StringList();
            [_('Always on'), _('Always off'), _('Toggle')].forEach(choice => toggleList.append(choice));

            const comboRow2 = new Adw.ComboRow({
                title: _('Button Click Action'),
                subtitle: _('Button behavior when clicked'),
                model: toggleList,
                selected: window._settings.get_int(`toggle${pageIndex}-buttonclick`),
            });
            group4.add(comboRow2);
            page.add(group4);

            const switchRow3 = new Adw.SwitchRow({
                title: _('Check Command Exit Code'),
                subtitle: _('Only toggle if the command executes successfully (returns exit code 0)'),
                active: window._settings.get_boolean(`toggle${pageIndex}-checkexitcode`),
            });
            group4.add(switchRow3);
            switchRow3.visible =  comboRow2.selected === 2;

            comboRow2.connect("notify::selected", () => {
                switchRow3.visible =  comboRow2.selected === 2;
                syncDisabledInfo.visible = comboRow2.selected !== 2;
                if (comboRow2.selected !== 2) {
                    commandSyncExpanderRow.show_enable_switch = false;
                    commandSyncExpanderRow.enable_expansion = false;
                    commandSyncExpanderRow.expanded = false;
                } else {
                    commandSyncExpanderRow.show_enable_switch = true;
                    commandSyncExpanderRow.enable_expansion = window._settings.get_boolean(`toggle${pageIndex}-checkcommandsync`);
                    commandSyncExpanderRow.expanded = commandSyncExpanderRow.enable_expansion;
                }
            });

            const switchRow = new Adw.SwitchRow({
                title: _('Show Indicator Icon'),
                subtitle: _('Show top bar icon when toggle button is switched on'),
                active: window._settings.get_boolean(`toggle${pageIndex}-showindicator`),
            });
            group4.add(switchRow);

            const switchRow2 = new Adw.SwitchRow({
                title: _('Close Menu After Button Press'),
                subtitle: _('Close the system menu immediately after clicking toggle button'),
                active: window._settings.get_boolean(`toggle${pageIndex}-closemenu`),
            });
            group4.add(switchRow2);
            //#endregion Toggle Behavior


            //#region Sync Behavior
            const group5 = new Adw.PreferencesGroup({
                title: _('Command Sync Behavior'),
            });

            const commandSyncExpanderRow = new Adw.ExpanderRow({
                title: _('Keep Toggle State Synced'),
                subtitle: _('Keep toggle button state synced with a command\'s output'),
                show_enable_switch: true,
                expanded: window._settings.get_boolean(`toggle${pageIndex}-checkcommandsync`),
                enable_expansion: window._settings.get_boolean(`toggle${pageIndex}-checkcommandsync`),
            });
            if (comboRow2.selected !== 2) {
                commandSyncExpanderRow.show_enable_switch = false;
                commandSyncExpanderRow.expanded = false;
            } else {
                commandSyncExpanderRow.expanded = window._settings.get_boolean(`toggle${pageIndex}-checkcommandsync`);
                commandSyncExpanderRow.show_enable_switch = true;
            }
            commandSyncExpanderRow.connect('notify::expanded', widget => {
                commandSyncExpanderRow.enable_expansion = widget.expanded;
            });
            group5.add(commandSyncExpanderRow);

            const checkCommandInfo2 = new Adw.ActionRow({
                title: _('Command Configuration'),
                subtitle: _(
                            "Enter the Check Status Command and Search Term in the Commands section above. " +
                            "If the specified Search Term appears in the command\'s output, the button will be set to ON. " +
                            "Otherwise, the button will be set to OFF."
                           ),
                activatable: false,
            });
            commandSyncExpanderRow.add_row(checkCommandInfo2);

            const pollingFreqSpinRow = new Adw.SpinRow({
                title: _('Polling Frequency (seconds)'),
                subtitle: _('How often to check the command output and update button state'),
                adjustment: new Gtk.Adjustment({
                    lower: 2,
                    upper: 900,
                    step_increment: 1,
                    page_increment: 10,
                }),
            });
            commandSyncExpanderRow.add_row(pollingFreqSpinRow);

            const syncDisabledInfo = new Adw.ActionRow({
                subtitle: _('Command sync is disabled. To enable, set the Button Click Action to Toggle.'),
                activatable: false,
            });
            syncDisabledInfo.visible = comboRow2.selected !== 2;
            group5.add(syncDisabledInfo);

            page.add(group5);
            //#endregion Sync Behavior


            //#region Shortcut
            const group6 = new Adw.PreferencesGroup({
                title: _('Keyboard Shortcut'),
            });
            page.add(group6);

            const keybindRow = new KeybindingRow(
                window._settings,
                `toggle${pageIndex}-keybinding`,
                _('Assign Shortcut')
            );
            keybindRow.add_suffix(keybindRow.resetButton);
            group6.add(keybindRow);
            //#endregion Shortcut


            //#region Bindings
            window._settings.bind(`toggle${pageIndex}-command-on`, onCommandRow, 'text', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-command-off`, offCommandRow, 'text', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-title`, buttonNameRow, 'text', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-icons`, iconRow, 'text', Gio.SettingsBindFlags.DEFAULT);

            window._settings.bind(`toggle${pageIndex}-checkcommand`, checkCommandRow, "text", Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-checkregex`, checkRegexRow, "text", Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-initialstate`, comboRow, 'selected', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-runcommandatboot`, expanderRow, 'expanded', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-delaytime`, spinRow, 'value', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-checkcommanddelaytime`, spinRow2, 'value', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-showindicator`, switchRow, 'active', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-closemenu`, switchRow2, 'active', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-checkexitcode`, switchRow3, 'active', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-buttonclick`, comboRow2, 'selected', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-checkcommandinterval`, pollingFreqSpinRow, 'value', Gio.SettingsBindFlags.DEFAULT);
            window._settings.bind(`toggle${pageIndex}-checkcommandsync`, commandSyncExpanderRow, 'expanded', Gio.SettingsBindFlags.DEFAULT);
            //#endregion Bindings


            // Push the created page to the pages array
            this._pages.push(page);


            //#region Visibility
            [   onCommandRow, offCommandRow, buttonNameRow, iconRow, checkCommandRow, checkRegexRow,
                comboRow, expanderRow, spinRow, spinRow2, comboRow2, switchRow, switchRow2, switchRow3,
                commandSyncExpanderRow, pollingFreqSpinRow, keybindRow
            ].forEach(widget => widget.set_sensitive(isVisible));
            //#endregion Visibility

        }// End of for loop to create toggle button settings pages


        //#region Config Page
        const infoPage = new Adw.PreferencesPage({
            title: _('Configuration'),
            icon_name: 'applications-system-symbolic',
        });
        window.add(infoPage);
        this._pages.push(infoPage);
        //#endregion Config Page


        //#region Settings
        const configGroup0 = new Adw.PreferencesGroup({
            title: _('Settings'),
        });
        infoPage.add(configGroup0);

        const spinRow0 = new Adw.SpinRow({
            title: _('Number of Toggle Buttons'),
            subtitle: _('Click Apply to save and reinitialize toggle states'),
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 6,
                step_increment: 1,
                page_increment: 1,
            }),
        });
        spinRow0.value = window._settings.get_int('numbuttons');

        const applyButton = new Gtk.Button({
            label: _('Apply'),
            valign: Gtk.Align.CENTER,
            visible: true,
        });
        applyButton.add_css_class('flat');
        applyButton.set_sensitive(false);

        spinRow0.connect('notify::value', () => {
            applyButton.set_sensitive(spinRow0.value !== numButtons);
        });

        applyButton.connect('clicked', () => {
            if(window._settings.get_int('numbuttons') !== spinRow0.value) {
                window._settings.set_int('numbuttons', spinRow0.value);
                this.populateTogglePages(window);
            }
            const lastIndex = this._pages.length - 1;
            window.set_visible_page(this._pages[lastIndex]);
            window._settings.set_boolean('force-refresh', !window._settings.get_boolean('force-refresh'));

        });
        spinRow0.add_suffix(applyButton);
        spinRow0.activatable_widget = applyButton;
        configGroup0.add(spinRow0);
        //#endregion Settings


        //#region Backup
        const backupGroup = new Adw.PreferencesGroup({
            title: _('Backup and Restore'),
        });
        infoPage.add(backupGroup);

        const importRow = new Adw.ActionRow({
            title: _('Import Configuration'),
            subtitle: _('Click to import the toggles.ini configuration file from the home directory'),
            activatable: true,
        });
        importRow.connect('activated', () => {
            importConfiguration(window._settings, window);
            this.populateTogglePages(window);
            window._settings.set_boolean('force-refresh', !window._settings.get_boolean('force-refresh'));
            const lastIndex = this._pages.length - 1; // Configuration tab is last
            window.set_visible_page(this._pages[lastIndex]);
        });
        backupGroup.add(importRow);

        const exportRow = new Adw.ActionRow({
            title: _('Export Configuration'),
            subtitle: _('Click to export the toggles.ini configuration file to the home directory'),
            activatable: true,
        });
        exportRow.connect('activated', () => {
            exportConfiguration(numButtons, window._settings, window);
        });
        backupGroup.add(exportRow);
        //#endregion Backup


        //#region Advanced
        const debugCommand = 'journalctl -f -o cat /usr/bin/gnome-shell | grep "Custom Command Toggle"';

        const advancedGroup = new Adw.PreferencesGroup({
            title: _('Advanced'),
        });
        infoPage.add(advancedGroup);

        const debugSwitchRow = new Adw.SwitchRow({
            title: _('Detailed Logging'),
            subtitle: _("To view output, run the following in a terminal then restart extension:\n%s").format(debugCommand),
            active: window._settings.get_boolean(`debug`),
        });
        window._settings.bind(`debug`, debugSwitchRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        const copyButton = new Gtk.Button({
            icon_name: 'edit-copy-symbolic',
            tooltip_text: _('Copy command to clipboard'),
            has_frame: false,
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        });

        copyButton.connect('clicked', () => {
            const value = new GObject.Value();
            value.init(GObject.TYPE_STRING);
            value.set_string(debugCommand);
            const clipboard = Gdk.Display.get_default().get_clipboard();
            const provider = Gdk.ContentProvider.new_for_value(value);
            clipboard.set_content(provider);
            const toast = Adw.Toast.new(_(`Command copied to clipboard`));
            window.add_toast(toast);
        });

        debugSwitchRow.add_suffix(copyButton);

        const resetRow = new Adw.ActionRow({
            title: _('Reset to Defaults'),
            subtitle: _('Click to restore all toggles and settings to their default values'),
            activatable: true,
        });
        resetRow.connect('activated', () => {
            const dialog = new Adw.MessageDialog({
                transient_for: window,
                heading: _('Confirm Reset'),
                body: _('All toggles and extension settings will be reset to their default values. This action cannot be undone.'),
                default_response: 'cancel',
                close_response: 'cancel',
            });

            dialog.add_response('cancel', _('Cancel'));
            dialog.add_response('reset', _('Reset'));
            dialog.set_response_appearance('reset', Adw.ResponseAppearance.DESTRUCTIVE);

            dialog.connect('response', (dlg, response) => {
                if (response === 'reset') {
                    reset(window._settings, window);
                    this.populateTogglePages(window);
                }
                dlg.destroy();
            });

            dialog.show();
        });
        advancedGroup.add(debugSwitchRow);
        advancedGroup.add(resetRow);
        //#endregion Advanced


        //#region Resources
        const resourcesGroup = new Adw.PreferencesGroup({
            title: _('Resources'),
        });

        const gettingStartedActionRow = new Adw.ActionRow({
            subtitle: _('Find links to the User Guide, Icon List, and other helpful information in the menu at the top of this window.'),
            activatable: false,
        });
        gettingStartedActionRow.add_prefix(new Gtk.Image({icon_name: 'dialog-information-symbolic'}));

        infoPage.add(resourcesGroup);
        resourcesGroup.add(gettingStartedActionRow);
        //#endregion Resources


    }
}
