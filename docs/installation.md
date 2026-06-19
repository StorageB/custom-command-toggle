<!-- installation.md -->

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="100" width="220">](https://extensions.gnome.org/extension/7012/custom-command-toggle/)

## Recommended Installation

Following the Recommended Installation will ensure you have the latest version and receive automatic updates.

**Option 1:** Install through the [GNOME Extensions website](https://extensions.gnome.org/extension/7012/custom-command-toggle/).

**Option 2:** Browse for and install this extension through the [GNOME Extension Manager](https://mattjakeman.com/apps/extension-manager).

---

## Manual Installation

1. Download the `custom-command-toggle.zip` file of the [latest release](https://github.com/StorageB/custom-command-toggle/releases). 
2. In the terminal, from the download location run:

        gnome-extensions install --force custom-command-toggle.zip
        
3. Log out and log back in (or reboot).
4. To enable the extension, run:

        gnome-extensions enable custom-command-toggle@storageb.github.com

5. To configure the extension, run: 

        gnome-extensions prefs custom-command-toggle@storageb.github.com



---

## From Source

1. Download the repository as a ZIP file from the project's [GitHub page](https://github.com/StorageB/custom-command-toggle) by selecting the green *Code* button and choosing *Download ZIP*.
2. Extract the files, and from the extracted file location run `make all`
3. Log out and log back in (or reboot).
4. To configure the extension, run: 

        gnome-extensions prefs custom-command-toggle@storageb.github.com
