# Fix the subs

## Background

Netflix allows the upload of custom subtitles using a keyboard shortcut - `Ctrl + Shift + Alt + Meta + T`. Somewhere around Jan 23rd [the loader broke](https://www.reddit.com/r/terracehouse/comments/aiz9ca/subtitles_suddenly_arent_working/). I chose to improvise my own solution instead of wait for a fix.

This repository includes a Chrome extension for loading subtitle files into the Netflix `/watch` page. The format the subs are loaded in is a JSON structure. The directory `preprocessor` contains a tool to convert DFXP subs to the correct format.

## Caveats

As this is a tool I wrote to fix an issue in a time pressure, there are a number of shortcomings to the tool that were adequate given its limited usage.

* DFXP subs may not be imported without preprocessing.
* When clicking on a video to play from the main page of Netflix, the page does not completely reload before the url changes to `/watch` - as such the background javascript in the extension doesn't load. A refresh to the page is required before it works as expected.
* Subs do not show when the player is in full-screen mode. Maximised works fine though.
* Subs only show at the top of the page.
* When timings for subs overlap, leading to multiple subs being shown at once, only one sub is shown.
