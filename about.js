/* about.js */

export const releaseNotes = `
What's new in this version:

•  Option to check a command's output to determine toggle state at startup.
•  Option to toggle button state only if command executes successfully (returns exit code 0).
•  Fixed a compatibility issue with some systems (such as NixOS) by switching from /bin/bash to /usr/bin/env bash for command execution.
•  Added feature to export current toggle button settings to a file.
•  Added support for GNOME 48.
•  Minor UI improvements.

Previous version:

•  Option to use keyboard shortcuts to activate toggle buttons.
•  Option to immediately hide quick settings menu after button press.
`;

