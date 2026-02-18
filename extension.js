/* extension.js
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

import GObject from 'gi://GObject';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import {QuickToggle, SystemIndicator} from 'resource:///org/gnome/shell/ui/quickSettings.js';

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {numberOfTogglesAllowed, SettingTypes, getSettingKey} from './settings-utils.js';

// Toggle configuration: stores command on/off for each toggle
let toggleCommands = [];
let toggleStates = [];
let initialStates = [];
let buttonClicks = [];
let shortcutIds = [];

for (let i = 0; i < numberOfTogglesAllowed; i++) {
    toggleCommands[i] = { on: "", off: "" };
    toggleStates[i] = false;
    initialStates[i] = 2;
    buttonClicks[i] = 2;
    shortcutIds[i] = null;
}

let checkIntervals = []; let commandTimeouts = [];
let isRunning = [];
let debug = false;


const myQuickToggle = GObject.registerClass(
{
    GTypeName: 'CustomCommandToggleQuickToggle'
},
class myQuickToggle extends QuickToggle {
    constructor(title, icon) {
        super({
            title: title,
            iconName: icon,
            toggleMode: true,
        });
    }
});

//#region Create Indicators
function createIndicatorClass(toggleNumber) {
    return GObject.registerClass(
        {
            GTypeName: `CustomCommandToggleIndicator${toggleNumber}`
        },
        class extends SystemIndicator {
            constructor(settings) {
                super();

                const idx = toggleNumber - 1;
                let title = settings.get_string(getSettingKey(toggleNumber, SettingTypes.TITLE));
                let iconSetting = settings.get_string(getSettingKey(toggleNumber, SettingTypes.ICONS)).trim();
                let [iconOn, iconOff] = iconSetting.split(',').map(s => s.trim());
                if (!iconOff) iconOff = iconOn;
                let showIndicator = settings.get_boolean(getSettingKey(toggleNumber, SettingTypes.SHOW_INDICATOR));

                this._indicator = this._addIndicator();
                this._indicator.iconName = toggleStates[idx] ? iconOn : iconOff;

                this.toggle = new myQuickToggle(title, toggleStates[idx] ? iconOn : iconOff);
                this.toggle.bind_property('checked', this._indicator, 'visible', GObject.BindingFlags.SYNC_CREATE);
                this.quickSettingsItems.push(this.toggle);
                this.toggle.checked = toggleStates[idx];

                this.toggleConnectSignal = this.toggle.connect('notify::checked', () => {
                    if (settings.get_boolean(getSettingKey(toggleNumber, SettingTypes.CLOSE_MENU))) {Main.panel.closeQuickSettings();}
                    if (settings.get_int(getSettingKey(toggleNumber, SettingTypes.BUTTON_CLICK)) === 2 && settings.get_boolean(getSettingKey(toggleNumber, SettingTypes.CHECK_EXIT_CODE))) {
                        checkCommandExitCode(toggleNumber, this.toggle.checked, toggleCommands[idx].on, toggleCommands[idx].off, (exitCodeResult) => {
                            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Exit code check: ${exitCodeResult ? 'passed' : 'failed'}${exitCodeResult ? '' : ' (toggle state not changed)'}`);
                            if (!exitCodeResult) {
                                GObject.signal_handler_block(this.toggle, this.toggleConnectSignal);
                                this.toggle.checked = !this.toggle.checked;
                                toggleStates[idx] = this.toggle.checked;
                                settings.set_boolean(getSettingKey(toggleNumber, SettingTypes.STATE), toggleStates[idx]);
                                this._indicator.iconName = this.toggle.checked ? iconOn : iconOff;
                                this.toggle.iconName = this.toggle.checked ? iconOn : iconOff;
                                if (!showIndicator) {this._indicator.visible = false;}
                                GObject.signal_handler_unblock(this.toggle, this.toggleConnectSignal);
                            }
                        });
                    } else {
                        switch (buttonClicks[idx]) {
                            case 0: if (this.toggle.checked)  {executeCommand(toggleNumber, this.toggle.checked, toggleCommands[idx].on, toggleCommands[idx].off);} this.toggle.checked = true; break;
                            case 1: if (!this.toggle.checked) {executeCommand(toggleNumber, this.toggle.checked, toggleCommands[idx].on, toggleCommands[idx].off);} this.toggle.checked = false; break;
                            case 2: {executeCommand(toggleNumber, this.toggle.checked, toggleCommands[idx].on, toggleCommands[idx].off);} break;
                        }
                    }
                    toggleStates[idx] = this.toggle.checked;
                    settings.set_boolean(getSettingKey(toggleNumber, SettingTypes.STATE), toggleStates[idx]);
                    if (!showIndicator) this._indicator.visible = false;
                    this._indicator.iconName = this.toggle.checked ? iconOn : iconOff;
                    this.toggle.iconName = this.toggle.checked ? iconOn : iconOff;
                });
                if (!showIndicator) this._indicator.visible = false;
            }
        }
    );
}

const indicatorClasses = [];
// Only create classes if they haven't been created yet (prevents re-registration on reload)
for (let i = 1; i <= numberOfTogglesAllowed; i++) {
    indicatorClasses[i] = createIndicatorClass(i);
}
//#endregion Create Indicators


//#region Execute Command
function executeCommand(toggleNumber, toggleChecked, commandChecked, commandUnchecked) {
    let command = toggleChecked ? commandChecked : commandUnchecked;
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Attempting to execute toggle command:`);
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | ${command.trim() === '' ? '(no command provided)' : command}`);
    if (command.trim() === "") return;

    let [success, pid] = GLib.spawn_async(null, ["/usr/bin/env", "bash", "-c", command], null, GLib.SpawnFlags.SEARCH_PATH, null);
    if (!success && debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Failed to spawn command`);
}
//#endregion Execute Command


//#region Check Exit Code
function checkCommandExitCode(toggleNumber, toggleChecked, commandChecked, commandUnchecked, exitCodeCallback) {
    let command = toggleChecked ? commandChecked : commandUnchecked;
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Attempting to execute toggle command with exit code status check:`);
    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | ${command.trim() === '' ? '(no command provided)' : command}`);
    if (command.trim() === "") return;

    try {
        let [success, pid] = GLib.spawn_async(null, ["/usr/bin/env", "bash", "-c", command], null, GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD | GLib.SpawnFlags.STDOUT_TO_DEV_NULL, null);
        if (success) {
            GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status) => {
                try {
                    let exitStatus = GLib.spawn_check_exit_status(status);
                    exitCodeCallback(exitStatus);
                } catch (e) {
                    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Exit code check: ${e}`);
                    exitCodeCallback(false);
                }
            });
        } else {
            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Failed to spawn command`);
            exitCodeCallback(false);
        }
    } catch (e) {
        if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error checking command exit status: ${e}`);
        exitCodeCallback(false);
    }
}
//#endregion Check Exit Code


export default class CustomQuickToggleExtension extends Extension {
    //#region Enable
    enable() {

        this._settings = this.getSettings();
        debug = this._settings.get_boolean(`debug`);
        let numToggleButtons = this._settings.get_int('numbuttons');
        if (debug) console.log(`[Custom Command Toggle] `);
        console.log(`[Custom Command Toggle] Extension enabled | Toggles created: ${numToggleButtons} | Detailed logging: ${debug}`);

        refreshIndicator.call(this);

        //#region Keybindings
        for (let i = 1; i <= numToggleButtons; i++) {
            shortcutIds[i - 1] = Main.wm.addKeybinding(
                getSettingKey(i, SettingTypes.KEYBINDING), this._settings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.ALL,
                () => {
                    const indicator = this[`_indicator${i}`];
                    if (indicator) indicator.toggle.checked = !indicator.toggle.checked;
                }
            );
        }
        //#endregion Keybindings


        //#region Settings Connections
        this._settings.connect('changed::force-refresh', () => {
            if (debug) console.log(`[Custom Command Toggle] `);
            if (debug) console.log(`[Custom Command Toggle] Rebuilding and reinitializing all toggles`);

            // Remove old intervals
            checkIntervals.forEach((id, i) => {
                if (id) GLib.source_remove(id);
                checkIntervals[i] = 0;
            });

            // Reset running flags
            isRunning.forEach((_, i) => isRunning[i] = false);

            // Remove pending command timeouts
            commandTimeouts.forEach(id => id && GLib.source_remove(id));
            commandTimeouts = [];

            numToggleButtons = this._settings.get_int('numbuttons');
            initialSetup.call(this);
            refreshIndicator.call(this);
            runAtBoot.call(this);
        });

        for (let i = 1; i <= numToggleButtons; i++) {
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.ENABLED)}`, () => {
                if (debug) console.log(`[Custom Command Toggle] Toggle ${i} | ${this._settings.get_boolean(getSettingKey(i, SettingTypes.ENABLED)) ? 'ENABLED' : 'DISABLED'}`);
                if (this._settings.get_boolean(getSettingKey(i, SettingTypes.ENABLED))) {
                    initialSetup.call(this, i);
                    refreshIndicator.call(this);
                    runAtBoot.call(this, i);
                } else {
                    if (checkIntervals[i - 1]) {
                        GLib.source_remove(checkIntervals[i - 1]);
                        checkIntervals[i - 1] = 0;
                    }

                    isRunning[i - 1] = false;

                    if (commandTimeouts[i - 1]) {
                        GLib.source_remove(commandTimeouts[i - 1]);
                        commandTimeouts[i - 1] = null;
                    }

                    refreshIndicator.call(this);
                }
            });
        }

        // Settings connections for toggle commands and display settings
        for (let i = 1; i <= numToggleButtons; i++) {
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.COMMAND_ON)}`, (settings, key) => {
                toggleCommands[i - 1].on = this._settings.get_string(getSettingKey(i, SettingTypes.COMMAND_ON));
            });
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.COMMAND_OFF)}`, (settings, key) => {
                toggleCommands[i - 1].off = this._settings.get_string(getSettingKey(i, SettingTypes.COMMAND_OFF));
            });
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.TITLE)}`, (settings, key) => {
                refreshIndicator.call(this);
            });
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.ICONS)}`, (settings, key) => {
                refreshIndicator.call(this);
            });

            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.BUTTON_CLICK)}`, (settings, key) => {
                buttonClicks[i - 1] = this._settings.get_int(getSettingKey(i, SettingTypes.BUTTON_CLICK));
                if (buttonClicks[i - 1] === 0) { toggleStates[i - 1] = true;  settings.set_boolean(getSettingKey(i, SettingTypes.STATE), toggleStates[i - 1]); }
                if (buttonClicks[i - 1] === 1) { toggleStates[i - 1] = false; settings.set_boolean(getSettingKey(i, SettingTypes.STATE), toggleStates[i - 1]); }
                refreshIndicator.call(this);
            });
        }

        let debounceIds = {};

        function debounce(i, func, delay = 500) {
            if (debounceIds[i]) GLib.source_remove(debounceIds[i]);
            debounceIds[i] = GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
                func();
                debounceIds[i] = null;
                return GLib.SOURCE_REMOVE;
            });
        }

        for (let i = 1; i <= numToggleButtons; i++) {
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.INITIAL_STATE)}`,           () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.CHECK_REGEX)}`,                   () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.CHECK_COMMAND)}`,                 () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.CHECK_COMMAND_INTERVAL)}`, () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.CHECK_COMMAND_SYNC)}`,     () => debounce(i, () => setupCheckSync.call(this, i)));
            this._settings.connect(`changed::${getSettingKey(i, SettingTypes.SHOW_INDICATOR)}`,        () => refreshIndicator.call(this));
        }

        this._settings.connect('changed::debug', () => {
            debug = this._settings.get_boolean('debug');
        });
        //#endregion Settings connections


        //#region Initial Setup
        function initialSetup (toggleIndex = null) {
            // Load toggle commands
            for (let i = 1; i <= numToggleButtons; i++) {
                toggleCommands[i - 1].on = this._settings.get_string(getSettingKey(i, SettingTypes.COMMAND_ON));
                toggleCommands[i - 1].off = this._settings.get_string(getSettingKey(i, SettingTypes.COMMAND_OFF));
            }

            // Load initial states and button clicks
            for (let i = 1; i <= numToggleButtons; i++) {
                initialStates[i - 1] = this._settings.get_int(getSettingKey(i, SettingTypes.INITIAL_STATE));
                buttonClicks[i - 1] = this._settings.get_int(getSettingKey(i, SettingTypes.BUTTON_CLICK));
            }

            for (let i = 1; i <= numToggleButtons; i++) {
                if (toggleIndex !== null && i !== toggleIndex)          continue;
                if (!this._settings.get_boolean(getSettingKey(i, SettingTypes.ENABLED))) continue;

                let initialState = initialStates[i - 1];
                let toggleStateKey = getSettingKey(i, SettingTypes.STATE);

                switch (initialState) {
                    case 0:
                        toggleStates[i - 1] = true;
                        this._settings.set_boolean(toggleStateKey, true);
                        break;
                    case 1:
                        toggleStates[i - 1] = false;
                        this._settings.set_boolean(toggleStateKey, false);
                        break;
                    case 2:
                        toggleStates[i - 1] = this._settings.get_boolean(toggleStateKey);
                        break;
                    case 3:
                        setupCheckSync.call(this, i, { startup: true });
                        break;
                }

                if (initialState !== 3 && this._settings.get_boolean(getSettingKey(i, SettingTypes.CHECK_COMMAND_SYNC))) {
                    setupCheckSync.call(this, i);
                }
            }
        }
        //#endregion Initial Setup


        //#region Run at Boot
        function runAtBoot(toggleIndex = null) {
            for (let i = 1; i <= numToggleButtons; i++) {
                if (toggleIndex !== null && i !== toggleIndex) continue;
                if (!this._settings.get_boolean(getSettingKey(i, SettingTypes.ENABLED))) continue;

                let runAtBootSetting = this._settings.get_boolean(getSettingKey(i, SettingTypes.RUN_COMMAND_AT_BOOT));
                if (this._settings.get_int(getSettingKey(i, SettingTypes.INITIAL_STATE))===3){runAtBootSetting = false;}
                const delayTime = this._settings.get_int(getSettingKey(i, SettingTypes.DELAY_TIME));
                const toggleState = toggleStates[i-1];
                const command = toggleState ? toggleCommands[i-1].on : toggleCommands[i-1].off;
                if (runAtBootSetting) {
                    executeCommand(i, toggleState, `sleep ${delayTime} && (${command})`, `sleep ${delayTime} && (${command})`);
                }
            }
        }
        //#endregion Run at Boot


        //#region Setup Check Sync
        function setupCheckSync(i, { startup = false } = {}) {
            isRunning[i - 1] = false;
            let toggleStateKey = getSettingKey(i, SettingTypes.STATE);
            let key = this._settings.get_string(getSettingKey(i, SettingTypes.CHECK_REGEX));
            let checkCommandDelayTime = this._settings.get_int(getSettingKey(i, SettingTypes.CHECK_COMMAND_DELAY_TIME));
            let cmd = this._settings.get_string(getSettingKey(i, SettingTypes.CHECK_COMMAND));
            let startupCmd = `sleep ${checkCommandDelayTime} && ( ${cmd} )`;

            if (checkIntervals[i - 1]) {
                GLib.source_remove(checkIntervals[i - 1]);
                checkIntervals[i - 1] = 0;
            }

            if (!this._settings.get_boolean(getSettingKey(i, SettingTypes.ENABLED))) {
                if (debug) console.log(`[Custom Command Toggle] Toggle ${i} | Sync skipped (visibility off)`);
                return;
            }

            isRunning[i - 1] = false;

            if (startup) {
                checkCommandOutput(i, startupCmd, key, (result) => {
                    toggleStates[i - 1] = result;
                    this._settings.set_boolean(toggleStateKey, result);
                    refreshIndicator.call(this);
                });
            }

            if (this._settings.get_boolean(getSettingKey(i, SettingTypes.CHECK_COMMAND_SYNC))) {
                let interval = Math.max(1, this._settings.get_int(getSettingKey(i, SettingTypes.CHECK_COMMAND_INTERVAL)));
                checkCommandOutput(i, cmd, key, (result) => {
                    if (toggleStates[i - 1] !== result) {
                        toggleStates[i - 1] = result;
                        this._settings.set_boolean(toggleStateKey, result);
                        refreshIndicator.call(this);
                    }
                });

                checkIntervals[i - 1] = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, interval, () => {
                    if (isRunning[i - 1]) {
                        if (debug) console.log(`[Custom Command Toggle] Toggle ${i} | Skipping command to avoid overlap`);
                        return GLib.SOURCE_CONTINUE;
                    }

                    isRunning[i - 1] = true;
                    checkCommandOutput(i, cmd, key, (result) => {
                        isRunning[i - 1] = false;
                        if (toggleStates[i - 1] !== result) {
                            toggleStates[i - 1] = result;
                            this._settings.set_boolean(toggleStateKey, result);
                            refreshIndicator.call(this);
                        }
                    });
                    return GLib.SOURCE_CONTINUE;
                });
            }
        }
        //#endregion Check Sync


        //#region Check Output
        function checkCommandOutput(toggleNumber, checkCommand, checkRegex, callback) {

            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Attempting to execute command with output check:`);
            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | ${checkCommand.trim() === '' ? '(no command provided)' : checkCommand}`);
            let spawnFlags = GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD;
            let useExitCode = (checkRegex.trim() === '');
            try {
                let [success, pid, stdinFd, stdoutFd, stderrFd] = GLib.spawn_async_with_pipes(
                    null,
                    ["/usr/bin/env", "bash", "-c", checkCommand],
                    null,
                    spawnFlags,
                    null
                );
                
                try { if (stdinFd !== -1) GLib.close(stdinFd); } catch (e) {}
                try { if (stderrFd !== -1) GLib.close(stderrFd); } catch (e) {}
                
                if (!success) {
                    if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Failed to spawn command`);
                    callback(false);
                    return;
                }

                const baseStream = new Gio.UnixInputStream({ fd: stdoutFd, close_fd: true });
                const dataStream = new Gio.DataInputStream({ base_stream: baseStream });

                let didFinish = false;

                const timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
                    if (!didFinish) {
                        const isStartupCmd = checkCommand.trim().startsWith('sleep ');
                        if (debug && !isStartupCmd) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Timeout waiting for command response`);
                        cleanup();
                        if (!isStartupCmd) callback(false);
                    }
                    return GLib.SOURCE_REMOVE;
                });

                commandTimeouts.push(timeoutId);

                function cleanup() {
                    if (didFinish) return;
                    didFinish = true;

                    try { GLib.source_remove(timeoutId); } catch (_) {}
                    commandTimeouts = commandTimeouts.filter(id => id !== timeoutId);

                    try { dataStream.close_async(GLib.PRIORITY_DEFAULT, null, () => {}); } catch (_) {}
                    try { baseStream.close_async(GLib.PRIORITY_DEFAULT, null, () => {}); } catch (_) {}
                }

                let chunks = [];

                function readNext() {
                    dataStream.read_bytes_async(4096, GLib.PRIORITY_DEFAULT, null, (stream, res) => {
                        try {
                            const bytes = stream.read_bytes_finish(res);
                            if (bytes.get_size() === 0) {
                                const output = new TextDecoder().decode(Uint8Array.from(chunks.flat())).trim();
                                const match = outputMatches(output, checkRegex);

                                if (debug) {
                                    console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Command output:`);
                                    if (output === '') {
                                        console.log(`[Custom Command Toggle] Toggle ${toggleNumber} |   (no output)`);
                                    } else {
                                        output.split('\n').forEach(line => {
                                            console.log(`[Custom Command Toggle] Toggle ${toggleNumber} |   ${line}`);
                                        });
                                    }
                                    console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Search term: ${checkRegex}`);
                                    console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Search term found in command output: ${match} ` +
                                                `(toggle set to ${match ? 'ON' : 'OFF'})`);
                                }
                                cleanup();
                                callback(match);
                                return;
                            }

                            chunks.push([...bytes.get_data()]);
                            readNext();
                        } catch (e) {
                            if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error reading output: ${e}`);
                            cleanup();
                            callback(false);
                        }
                    });
                }
                if (!useExitCode) {
                    readNext();
                }
                GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status) => {
                    try {
                        GLib.spawn_close_pid(pid);
                    } catch (e) {
                        if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error closing process: ${e}`);
                    }
                    cleanup();
                    if (useExitCode) {
                        callback(status === 0);
                    }
                });

            } catch (e) {
                if (debug) console.log(`[Custom Command Toggle] Toggle ${toggleNumber} | Error running command: ${e}`);
                callback(false);
            }
        }//#endregion Check Output


        //#region Output match
        function outputMatches(output, searchTerm) {

            const normalizedOutput = output.toLowerCase();
            const normalizedSearch = searchTerm.toLowerCase();

            // Remove punctuation (letters, numbers, spaces only)
            const cleanedOutput = normalizedOutput.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
            const cleanedSearch = normalizedSearch.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

            const isSingleWord = !cleanedSearch.includes(' ');
            if (isSingleWord) {
                const regex = new RegExp(`\\b${cleanedSearch}\\b`, 'i');
                return regex.test(cleanedOutput);
            } else {
                return cleanedOutput.includes(cleanedSearch);
            }
        }
        //#endregion Output match


        //#region Refresh indicator
        function refreshIndicator() {
            for (let i = 1; i <= numberOfTogglesAllowed; i++) {
                const indicator = this[`_indicator${i}`];
                if (indicator) {
                    indicator.quickSettingsItems.forEach(item => item.destroy());
                    indicator.destroy();
                    this[`_indicator${i}`] = null;
                }
            }

            for (let i = 1; i <= numToggleButtons; i++) {
                if (this._settings.get_boolean(getSettingKey(i, SettingTypes.ENABLED))) {
                    this[`_indicator${i}`] = new indicatorClasses[i](this.getSettings());
                    Main.panel.statusArea.quickSettings.addExternalIndicator(this[`_indicator${i}`]);
                }
            }
        }
        //#endregion Refresh Indicator


        refreshIndicator.call(this);
        initialSetup.call(this);
        runAtBoot.call(this);

        this._timeOut = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3, () => {
            refreshIndicator.call(this);
            return GLib.SOURCE_REMOVE;
        });
    }
    //#endregion Enable


    //#region Disable
    disable() {
        // Destroy all indicators
        for (let i = 1; i <= numberOfTogglesAllowed; i++) {
            const indicator = this[`_indicator${i}`];
            if (indicator) {
                indicator.quickSettingsItems.forEach(item => item.destroy());
                indicator.destroy();
                this[`_indicator${i}`] = null;
            }
        }

        // Remove all keybindings
        for (let i = 1; i <= numberOfTogglesAllowed; i++) {
            if (shortcutIds[i - 1]) {
                Main.wm.removeKeybinding(getSettingKey(i, SettingTypes.KEYBINDING));
                shortcutIds[i - 1] = null;
            }
        }

        if (this._timeOut) {
            GLib.source_remove(this._timeOut);
            this._timeOut = null;
        }

        if (this._debounceIds) {
            for (let id of Object.values(this._debounceIds)) {
                if (id) GLib.source_remove(id);
            }
            this._debounceIds = {};
        }

        for (let id of checkIntervals) {
            if (id)
                GLib.source_remove(id);
        }
        checkIntervals = [];

        for (let id of commandTimeouts) {
            if (id)
                GLib.source_remove(id);
        }
        commandTimeouts = [];

        this._settings = null;

        console.log(`[Custom Command Toggle] Extension disabled`);
    }
    //#endregion Disable
}
