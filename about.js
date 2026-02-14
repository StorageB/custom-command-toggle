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

import { gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const developerName = 'StorageB';
const issueUrl =      'https://github.com/StorageB/custom-command-toggle/issues';
const extensionUrl =  'https://extensions.gnome.org/extension/7012/custom-command-toggle/';
const discussionUrl = 'https://github.com/StorageB/custom-command-toggle/discussions';
const githubUrl =     'https://github.com/StorageB/custom-command-toggle';
const userGuideUrl =  'https://storageb.github.io/custom-command-toggle/';
const changeLogUrl =  'https://storageb.github.io/custom-command-toggle/changelog/'


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
        comments: metadata.description,
    });

    aboutDialog.add_link(_("What's New"), changeLogUrl);
    aboutDialog.add_link(_("GitHub Page"), githubUrl);
    aboutDialog.add_link(_("Extension Page"), extensionUrl);
    aboutDialog.add_link(_("User Guide"), userGuideUrl);
    aboutDialog.add_link(_("Discussions"), discussionUrl);

    aboutDialog.present(window);
}