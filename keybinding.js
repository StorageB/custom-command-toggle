/* keybinding.js 
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
 * 
 * Credit to the author of the Eye on Cursor extension for creating this
 * keybinding.js code used to incorporate keyboard shortcuts into this extension.
 * https://github.com/djinnalexio/eye-on-cursor/
 * The code has been slightly modified for use with this extension. 
 */

'use strict';

import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';

import {gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

//#region Keybinding row class
export const KeybindingRow = GObject.registerClass(
    class KeybindingRow extends Adw.ActionRow {
        constructor(settings, key, shortcutName) {
            /**
             * A row that allows users to set and manage a keyboard shortcut.

             * @param {Gio.Settings} settings - settings object of the extension
             * @param {string} key - key in the settings object for the keybinding
             * @param {string} shortcutName - name of the shortcut and title of the row
             * @param {string} subtitle - subtitle of the row
             */

            super({
                title: shortcutName,
                subtitle: _('Set a keyboard shortcut for toggle button'),
                activatable: true,
            });

            this.settings = settings;
            this.key = key;

            // Display current keybinding
            this.label = new Gtk.ShortcutLabel({
                disabled_text: _('Not assigned'),
                valign: Gtk.Align.CENTER,
                hexpand: false,
                vexpand: false,
                accelerator: this.settings.get_strv(this.key)[0],
            });
            this.box = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
            this.box.append(this.label);
            this.add_suffix(this.box);

            // Button to reset keybinding
            this.resetButton = new Gtk.Button({
                icon_name: 'edit-delete-symbolic',
                css_classes: ['error'],
                hexpand: false,
                vexpand: false,
            });
            this.resetButton.connect('clicked', this.resetKeybind.bind(this));

            // Hide reset button if no shortcut is set
            if (!this.label.accelerator) this.resetButton.visible = false;

            // Connect row activation to open capture window
            this.captureWindow = null;
            this.connect('activated', this.openCaptureWindow.bind(this));

            // Connect change in accelerator to update setting
            this.label.connect('notify::accelerator', widget => {
                this.settings.set_strv(this.key, [widget.accelerator]);
                // Main.wm.addKeybinding takes string arrays, not strings
            });
        }

        resetKeybind() {
            this.label.accelerator = '';
            this.resetButton.visible = false;
        }

        openCaptureWindow() {
            const controller = new Gtk.EventControllerKey();

            const content = new Adw.StatusPage({
                title: this.title,
                description: _('Press Esc to cancel or Backspace to disable the shortcut'),
                icon_name: 'preferences-desktop-keyboard-shortcuts-symbolic',
            });

            this.captureWindow = new Adw.Window({
                modal: true,
                hide_on_close: true,
                transient_for: this.get_root(),
                width_request: 480,
                height_request: 320,
                content,
            });

            this.captureWindow.add_controller(controller);
            controller.connect('key-pressed', this.registerKey.bind(this));
            this.captureWindow.present();
        }

        registerKey(widget, keyval, keycode, state) {
            // Get default modifier mask (keys) that are currently pressed
            let mask = state & Gtk.accelerator_get_default_mod_mask();
            // Filter out CAPS LOCK
            mask &= ~Gdk.ModifierType.LOCK_MASK;

            // If Esc is pressed without modifiers, close capture window
            if (!mask && keyval === Gdk.KEY_Escape) {
                this.captureWindow.close();
                return Gdk.EVENT_STOP;
            }

            // If Backspace is pressed, reset keybinding
            if (keyval === Gdk.KEY_BackSpace) {
                this.resetKeybind();
                this.captureWindow.destroy();
                return Gdk.EVENT_STOP;
            }

            // If the key combination is not acceptable, ignore it
            if (!this.isValidBinding(mask, keycode, keyval) || !this.isValidAccel(mask, keyval)) {
                return Gdk.EVENT_STOP;
            }

            this.label.accelerator = Gtk.accelerator_name_with_keycode(null, keyval, keycode, mask);
            this.resetButton.visible = true;
            this.captureWindow.destroy();
            return Gdk.EVENT_STOP;
        }

        //#region Keybinding Validation
        // Validating functions from https://gitlab.gnome.org/GNOME/gnome-control-center/-/blob/main/panels/keyboard/keyboard-shortcuts.c

        isValidBinding(mask, keycode, keyval) {
            if (mask === 0) return false;

            if (mask === Gdk.ModifierType.SHIFT_MASK && keycode !== 0) {
                if (
                    this.isKeyInRange(keyval, Gdk.KEY_A, Gdk.KEY_Z) ||
                    this.isKeyInRange(keyval, Gdk.KEY_0, Gdk.KEY_9) ||
                    this.isKeyInRange(keyval, Gdk.KEY_a, Gdk.KEY_z) ||
                    this.isKeyInRange(keyval, Gdk.KEY_kana_fullstop, Gdk.KEY_semivoicedsound) ||
                    this.isKeyInRange(keyval, Gdk.KEY_Arabic_comma, Gdk.KEY_Arabic_sukun) ||
                    this.isKeyInRange(keyval, Gdk.KEY_Serbian_dje, Gdk.KEY_Cyrillic_HARDSIGN) ||
                    this.isKeyInRange(keyval, Gdk.KEY_Greek_ALPHAaccent, Gdk.KEY_Greek_omega) ||
                    this.isKeyInRange(keyval, Gdk.KEY_hebrew_doublelowline, Gdk.KEY_hebrew_taf) ||
                    this.isKeyInRange(keyval, Gdk.KEY_Thai_kokai, Gdk.KEY_Thai_lekkao) ||
                    this.isKeyInRange(
                        keyval,
                        Gdk.KEY_Hangul_Kiyeog,
                        Gdk.KEY_Hangul_J_YeorinHieuh
                    ) ||
                    (keyval === Gdk.KEY_space && mask === 0) ||
                    this.keyvalIsForbidden(keyval)
                ) {
                    return false;
                }
            }
            return true;
        }

        keyvalIsForbidden(keyval) {
            return [
                // Navigation keys
                Gdk.KEY_Home,
                Gdk.KEY_Left,
                Gdk.KEY_Up,
                Gdk.KEY_Right,
                Gdk.KEY_Down,
                Gdk.KEY_Page_Up,
                Gdk.KEY_Page_Down,
                Gdk.KEY_End,
                Gdk.KEY_Tab,

                // Return
                Gdk.KEY_KP_Enter,
                Gdk.KEY_Return,

                Gdk.KEY_Mode_switch,
            ].includes(keyval);
        }

        isKeyInRange(keyval, start, end) {
            return keyval >= start && keyval <= end;
        }

        isValidAccel(mask, keyval) {
            return Gtk.accelerator_valid(keyval, mask) || (keyval === Gdk.KEY_Tab && mask !== 0);
        }
        //#endregion
    }
);
//#endregion
