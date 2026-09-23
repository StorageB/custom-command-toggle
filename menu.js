import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';

import {gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export function createMenuItemsUI(menuGroup, settings, settingName) {
    const menuItems = [];

    const emptyMenuRow = new Adw.ActionRow({
        subtitle: _('Click + to add a menu item'),
        activatable: false,
    });
    menuGroup.add(emptyMenuRow);

    let savedItems;
    
    try {
        savedItems = JSON.parse(settings.get_string(settingName));
    } catch (e) {
        console.log(`[Custom Command Toggle] Failed to load ${settingName}: ${e}`);
        savedItems = [];
    }
    
    if (Array.isArray(savedItems)) {
        savedItems.forEach(item => {
            if (item && typeof item === 'object')
                createMenuItem(menuGroup, menuItems, emptyMenuRow, settings, settingName, item);
        });
    }

    emptyMenuRow.visible = menuItems.length === 0;

    const addMenuButton = new Gtk.Button({
        icon_name: 'list-add-symbolic',
        tooltip_text: _('Add Menu Item'),
    });
    addMenuButton.add_css_class('flat');
    menuGroup.set_header_suffix(addMenuButton);

    addMenuButton.connect('clicked', () => {
        createMenuItem(menuGroup, menuItems, emptyMenuRow, settings, settingName);
    });

    return menuItems;
}


function createMenuItem(menuGroup, menuItems, emptyMenuRow, settings, settingName, savedItem = null) {
    const item = {
        name: savedItem?.name ?? '',
        icon: savedItem?.icon ?? '',
        command: savedItem?.command ?? '',
    };

    const row = new Adw.ExpanderRow({
        title: item.name ? GLib.markup_escape_text(item.name, -1) : _('New Menu Item'),
        subtitle: item.command ? GLib.markup_escape_text(item.command, -1) : _('No command configured'),
    });

    const nameRow = new Adw.EntryRow({
        title: _('Name'),
    });
    nameRow.text = item.name;
    row.add_row(nameRow);

    const iconRow = new Adw.EntryRow({
        title: _('Icon'),
    });
    iconRow.text = item.icon;
    row.add_row(iconRow);

    const commandRow = new Adw.EntryRow({
        title: _('Command'),
    });
    commandRow.text = item.command;
    row.add_row(commandRow);

    const deleteButton = new Gtk.Button({
        icon_name: 'user-trash-symbolic',
        tooltip_text: _('Remove Menu Item'),
    });
    deleteButton.add_css_class('flat');
    row.add_suffix(deleteButton);

    nameRow.connect('notify::text', () => {
        item.name = nameRow.text;
        row.title = item.name ? GLib.markup_escape_text(item.name, -1) : _('New Menu Item');
        saveMenuItems(menuItems, settings, settingName);
    });

    iconRow.connect('notify::text', () => {
        item.icon = iconRow.text.trim();
        saveMenuItems(menuItems, settings, settingName);
    });

    commandRow.connect('notify::text', () => {
        item.command = commandRow.text;
        row.subtitle = item.command ? GLib.markup_escape_text(item.command, -1) : _('No command configured');
        saveMenuItems(menuItems, settings, settingName);
    });

    deleteButton.connect('clicked', () => {
        menuGroup.remove(row);

        const index = menuItems.indexOf(item);
        if (index !== -1) menuItems.splice(index, 1);

        emptyMenuRow.visible = menuItems.length === 0;

        saveMenuItems(menuItems, settings, settingName);
    });

    menuItems.push(item);
    menuGroup.add(row);

    emptyMenuRow.visible = false;

    if (savedItem === null) row.expanded = true;
}


function saveMenuItems(menuItems, settings, settingName) {
    settings.set_string(settingName, JSON.stringify(menuItems));
}