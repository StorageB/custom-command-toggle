/* prefs.js */
 
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);
 

        const group1 = new Adw.PreferencesGroup({
            title: _('Commands'),
            description: _('Enter shell commands to run when the quick toggle is switched.'),
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
        

    }
}
