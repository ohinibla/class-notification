# class notification

* This add-on notifies users when the class is open to enter on daan.ir remote learning platform.

## What it does

* This extension checks the class list page, adds bell icon buttons to classes are not yet
passed, reloads the page until the enter class button of the page is available and notifies
the user by visuals and sound.

This extension includes:

* a background script to handle messages and preserve selected class / options.
* two content scripts, "content_script.js" and "content_script_reset.js", that is injected into
https://srbiau.daa.ir/session-list pages.
* a browser action action script, "popup.js" to handle browser actions button for turning the notification
listener on or off, and selecting various sounds for notification alarm.
* cuple of sounds, images and stylesheet pages.

