# Custom Command Toggle

#### A GNOME extension to create custom quick toggle buttons.

Custom Command Toggle is an extension for GNOME 45+ that lets you create fully customizable quick toggle buttons in the system menu.

<br>

![screenshot-main](docs/screenshots/screenshot-main-12.png)

<br>

## Features:

- Run commands and launch custom scripts using quick toggle buttons.
- Assign custom button names and icons.
- Run a command at startup to determine the button's initial state based on the command output, or manually specify whether the button starts as on, off, or in its last known state.
- Run associated on or off command at startup to sync button state if required.
- Keep button states synced to a command's output.
- Option to toggle the button only if the command executes successfully and returns exit code 0 (for use with sudo commands using `pkexec sudo` where the command could be canceled or incorrect password entered).
- Customize toggle button behavior to toggle or be in an always on or off state.
- Assign keyboard shortcuts to quick toggle buttons.
- Import and export button configurations using an easy-to-edit .ini file.
- Create up to 6 custom buttons.

<br>

## Documentation

For detailed configuration instructions and setup tips, refer to the  
📘 **[User Guide](https://StorageB.github.io/custom-command-toggle/)**

<br>

## Installation

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="" width="100">](https://extensions.gnome.org/extension/2932/executor/)

### Recommended Installation

Browse for and install this extension through the GNOME Extension Manager, or install through the [GNOME Extensions website](https://extensions.gnome.org/extension/7012/custom-command-toggle/).


### Manual Installation

1. Download the `custom-command-toggle.zip` file of the [latest release](https://github.com/StorageB/custom-command-toggle/releases). 
2. In the terminal run:
`gnome-extensions install --force custom-command-toggle.zip`
3. Logout and login.

To enable and configure the extension:
```
gnome-extensions enable custom-command-toggle@storageb.github.com
gnome-extensions prefs custom-command-toggle@storageb.github.com
```

<br>

---


#### I hope you found this extension useful!

<a href="https://www.buymeacoffee.com/StorageB" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 36px !important;width: 131px !important;" ></a>


