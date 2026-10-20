# Initial Testing Setup

## Icons

1. Save icons to the local icon directory `~/.local/share/icons/`.
2. Restart the computer (or log out and back in).

## Toggle Configuration

1. Save `toggles.ini` to the home directory `~/`.
2. Import the `toggles.ini` configuration from the extension preferences.

## Test Script

1. Save `test-script` to the home directory `~/`.
2. Make the script executable: `chmod u+x ~/test-script`.
3. Use the following commands for on/off/status:
   - `~/test-script start`
   - `~/test-script stop`
   - `~/test-script status`

4. The status command outputs one of the following:
   - `[Custom Command Toggle] test script is ENABLED`
   - `[Custom Command Toggle] test script is DISABLED`