/* prefs.js */
 
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

let initialToggleState = 2;

export default class CustomCommandTogglePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        
        const page = new Adw.PreferencesPage({
            title: _('Settings'),
            icon_name: 'applications-system-symbolic',
        });
        window.add(page);
 

        const group1 = new Adw.PreferencesGroup({
            title: _('Commands'),
            description: _('Enter commands to run when the quick toggle is switched.'),
        });
        page.add(group1);

        const entryRow1 = new Adw.EntryRow({
            title: _('Toggle ON command:'),
        });
        group1.add(entryRow1);
        
        const entryRow2 = new Adw.EntryRow({
            title: _('Toggle OFF command:'),
        });
        group1.add(entryRow2);


        const group2 = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Customize the quick toggle name and icon.'),
        });
        page.add(group2);

        const entryRow3 = new Adw.EntryRow({
            title: _('Name:'),
        });
        group2.add(entryRow3);

        const entryRow4 = new Adw.EntryRow({
            title: _('Icon:'),
        });
        group2.add(entryRow4);


        window._settings = this.getSettings();
        window._settings.bind('entryrow1-setting', entryRow1, 'text', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('entryrow2-setting', entryRow2, 'text', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('entryrow3-setting', entryRow3, 'text', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('entryrow4-setting', entryRow4, 'text', Gio.SettingsBindFlags.DEFAULT);


        const group3 = new Adw.PreferencesGroup({
            title: _('Startup Behavior'),
        });
        page.add(group3);

        initialToggleState = window._settings.get_int('initialtogglestate-setting');
        const optionList = new Gtk.StringList();
        [_('On'), _('Off'), _('Previous state')].forEach(choice => optionList.append(choice));

        const comboRow1 = new Adw.ComboRow({
            title: _('Initial Toggle State'),
            subtitle: _('State of the toggle button at login/startup'),
            model: optionList,
            selected: initialToggleState,
        });
        group3.add(comboRow1);

        const expanderRow1 = new Adw.ExpanderRow({
            title: _('Run Command at Startup'),
            subtitle: _('Run associated toggle command at login/startup'),
            show_enable_switch: true,
            expanded: window._settings.get_boolean('runcommandatboot-setting'),
            enable_expansion: window._settings.get_boolean('runcommandatboot-setting'),
        });
        expanderRow1.connect('notify::expanded', widget => {
            expanderRow1.enable_expansion = widget.expanded;
        });

        const spinRow = new Adw.SpinRow({
            title: _('Delay Time (seconds)'),
            subtitle: _('Amount of time to delay command from running after startup \n'  +
                        '(it may be required to allow other processes to finish loading before running your command)'),
            value: window._settings.get_int('initialtogglestate-setting'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 10,
                step_increment: 1,
                page_increment: 1,
            }),
        });

        window._settings.bind('initialtogglestate-setting', comboRow1, 'selected', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('runcommandatboot-setting', expanderRow1, 'expanded', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('delaytime-setting', spinRow, 'value', Gio.SettingsBindFlags.DEFAULT);
  
        group3.add(expanderRow1);
        expanderRow1.add_row(spinRow);
        

        const page2 = new Adw.PreferencesPage({
            title: _('Information'),
            icon_name: 'help-about-symbolic',
        });
        window.add(page2);
        
        const configGroup1 = new Adw.PreferencesGroup({
            title: _('Configuration'),
        });
        
        const configRow1 = new Adw.ActionRow({
            title: _('Commands'),
            subtitle: _(
                        'Enter commands to run when the quick toggle is switched. ' +
                        '' 
                       ),
            activatable: false,
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
        
        const aboutGroup = new Adw.PreferencesGroup({
            title: _('About'),
        });
        
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
        
        
        page2.add(configGroup1);
        //configGroup1.add(configRow1);
        configGroup1.add(configRow2);
        configGroup1.add(configRow3);
        configGroup1.add(configRow4);
        
        page2.add(aboutGroup);
        aboutGroup.add(aboutRow1);
        aboutGroup.add(aboutRow2);

    }
}
