/* settings-utils.js
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

// Shared utilities and constants for settings management
// This file can be imported by both extension.js and prefs.js

export const numberOfTogglesAllowed = 6;

// Enum for all setting types
export const SettingTypes = Object.freeze({
    TITLE: 'title',
    ICONS: 'icons',
    COMMAND_ON: 'command-on',
    COMMAND_OFF: 'command-off',
    CHECK_COMMAND: 'checkcommand',
    CHECK_REGEX: 'checkregex',
    INITIAL_STATE: 'initialstate',
    RUN_COMMAND_AT_BOOT: 'runcommandatboot',
    DELAY_TIME: 'delaytime',
    CHECK_COMMAND_DELAY_TIME: 'checkcommanddelaytime',
    BUTTON_CLICK: 'buttonclick',
    CHECK_EXIT_CODE: 'checkexitcode',
    SHOW_INDICATOR: 'showindicator',
    CLOSE_MENU: 'closemenu',
    CHECK_COMMAND_SYNC: 'checkcommandsync',
    CHECK_COMMAND_INTERVAL: 'checkcommandinterval',
    KEYBINDING: 'keybinding',
    STATE: 'state',
    ENABLED: 'enabled',
});

// Get setting key by toggle number and setting type
// All toggles follow the same consistent pattern
export function getSettingKey(toggleNumber, settingType) {
    return `toggle${toggleNumber}-${settingType}`;
}
