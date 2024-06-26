# Custom Command Toggle

#### A GNOME extension to run shell commands using a GNOME quick toggle.

Custom Command Toggle is an extension for GNOME 45/46 to run user defined commands by switching a customizable quick toggle button on or off.

<br>

![Screenshot-main](screenshots/Screenshot-main.png)

<br>

## Features:

- Run terminal commands and launch custom scripts using a quick toggle button.
- Easily change the quick toggle button name and icon in the extension preferences.
- Enter separate commands to run when the quick toggle is switched on and when it is switched off.

<br>

## Installation

### Recommended

Browse for and install this extension through the GNOME Extension tool, or install through the [GNOME Extensions website](https://extensions.gnome.org/extension/7012/custom-command-toggle/).

### Manual

1. Download the `custom-command-toggle.zip` file of the [latest release](https://github.com/StorageB/custom-command-toggle/releases/tag/v5-beta1). 
2. Run the following command from the terminal:
`gnome-extensions install --force custom-command-toggle.zip`
3. Logout and login.

<br>

## Configuration

Customize the behavior and appearance of the quick toggle by accessing the extension preferences.

<br>

### Commands

Enter the terminal/shell commands to associate with the quick toggle on/off actions.

![Screenshot-commands](screenshots/Screenshot-commands.png)

Tips:
- Run multiple commands by using `&` between commands.
- Chain multiple commands together to run one at a time using `&&` between commands.
- By default, commands do not run in a terminal window and will not show any output or error messages. Test the full command first by running it in the terminal before adding it to the extension to verify it is correct. 
- To run a command in a terminal window, use `gnome-terminal -- command`. Note that by default the GNOME terminal will close after the command is complete, but that can be changed in the terminal preferences if needed.
- Sudo commands require a password input from the terminal, so they will not directly work by themselves since commands run without a terminal window by default. However, you can use `gnome-terminal -- command` to run the command in the terminal. For example, `gnome-terminal -- sudo apt-get update` will open a terminal, prompt for your password, and then run the command.

<br>

### Appearance

Enter the text and icon information to use for the quick toggle button. 

![Screenshot-appearance](screenshots/Screenshot-appearance.png)

For a list of available icons to use: https://github.com/StorageB/icons/blob/main/Yaru/icons.md

Alternatively, navigate to the icon directory for your system’s theme (located at /usr/share/icons), or use the [Icon Library app](https://flathub.org/apps/org.gnome.design.IconLibrary).

Enter the name of the icon without the file extension. Note that icon appearance will vary depending on your systems's theme.

<br>

## Usage Examples and Suggestions

Here are some ideas on how this extension can be used:
- Create a work/home mode toggle that automatically launches all the applications and web pages you need opened.
- Use the quick toggle to launch custom bash scripts or python scripts. 
- Create a presentation or streaming mode toggle that sets up your computer for presentations or for streaming video on an HDMI connected TV. You could input commands to do the following:
    - Turn off night light for presentation mode.
    - Enable do not disturb to disable popup notifications for presentation mode.
    - Change sound output to HDMI for presentation mode.
    - Switch back to defaults when presentation mode is disabled.


<br>

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request to contribute to this project.

<br>

## License

This project is licensed under the [GNU General Public License](http://www.gnu.org/licenses/).

<br>

#### I hope you found this extension helpful!

<a href="https://www.buymeacoffee.com/StorageB" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 36px !important;width: 131px !important;" ></a>


