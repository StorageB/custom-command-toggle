/* about.js */

export const releaseNotes = `
What's new in this version:

•  Option to check a command's output to determine button state at startup.
•  Option to check a command's exit code and toggle button state only if command executes successfully (returns exit code 0).
•  Added feature to export current button configurations to a file.
•  Fixed a compatibility issue with some systems (such as NixOS) by switching from /bin/bash to /usr/bin/env bash for command execution.
•  Added support for GNOME 48.
•  Minor UI improvements.
•  Improved code readability.

Previous version:

•  Option to use keyboard shortcuts to activate toggle buttons.
•  Option to immediately hide quick settings menu after button press.
`;

