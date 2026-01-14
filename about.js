/* about.js
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

import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';

import { gettext as _, } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const developerName = 'StorageB';
const issueUrl =      'https://github.com/StorageB/custom-command-toggle/issues';
const extensionUrl =  'https://extensions.gnome.org/extension/7012/custom-command-toggle/';
const discussionUrl = 'https://github.com/StorageB/custom-command-toggle/discussions';
const githubUrl =     'https://github.com/StorageB/custom-command-toggle';
const userGuideUrl =  'https://storageb.github.io/custom-command-toggle/';

/* The string for `release_notes` supports: 
 *   <p> paragraphs
 *   <em> emphasis (italic)
 *   <code> code
 *   <ol> ordered (numbered) and <ul> unordered (bullet points) lists with <li> list items
 */
const releaseNotes = '\
    <p>Whats new in this version:</p>\
    <ul>\
        <li>Full import and export functionality for button configurations</li>\
        <li>Option to hide/disable individual toggle buttons from the panel menu</li>\
        <li>Changing the number of toggle buttons no longer requires logging out or rebooting</li>\
        <li>Option to reset all settings to default values</li>\
        <li>Created a more detailed and user-friendly user guide</li>\
    </ul >\
    <p>Fixes &amp; Improvements:</p>\
    <ul>\
        <li>Added a menu button to the top of the header bar for quick access to the icon lists, the new user guide, and a new about dialog</li>\
        <li>Minor UI improvements</li>\
    </ul >\
';


export function showAboutDialog(window, metadata, path) {

    const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
    if (!iconTheme.get_search_path().includes(`${path}/icons/`))
        iconTheme.add_search_path(`${path}/icons/`);

    const aboutDialog = new Adw.AboutDialog({
        application_icon: 'custom-command-toggle',
        application_name: metadata.name,
        developer_name: developerName,
        version: metadata['version-name'] || metadata.version.toString(),
        issue_url: issueUrl,
        release_notes: releaseNotes,
        comments: metadata.description,
        //website: metadata.url, 
    });

    aboutDialog.add_link(_('GitHub Page'), githubUrl);
    aboutDialog.add_link(_('Extension Page'), extensionUrl);
    aboutDialog.add_link(_('User Guide'), userGuideUrl);
    aboutDialog.add_link(_('Discussion'), discussionUrl);

    aboutDialog.present(window);
}