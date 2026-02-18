.PHONY: all install uninstall clean enable disable logs package

EXTENSION_ID = custom-command-toggle@storageb.github.com
SOURCE_DIR = $(PWD)
PACKAGE = $(EXTENSION_ID).shell-extension.zip
all: package install enable

package: $(PACKAGE)

$(PACKAGE):
	gnome-extensions pack \
		--extra-source=about.js \
		--extra-source=backup.js \
		--extra-source=keybinding.js

install: $(PACKAGE)
	gnome-extensions install --force $(PACKAGE)

uninstall:
	gnome-extensions uninstall $(EXTENSION_ID)

enable:
	gnome-extensions enable $(EXTENSION_ID)

disable:
	gnome-extensions disable $(EXTENSION_ID)

logs:
	@journalctl /usr/bin/gnome-shell -f

clean:
	rm -f $(SOURCE_DIR)/$(PACKAGE)
