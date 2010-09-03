# TipSwift #

TipSwift is a tiny jQuery plugin for displaying tooltips and inline context-based
dialog boxes ranging from prompts to confirmations for an ultra-sexy user interface.

TipSwift has started as a port of [swift](http://github.com/visionmedia/swift) to [tipsy](http://github.com/jaz303/tipsy).
The tipsy library was required to use TipSwift v1.

As of v2, TipSwift integrates its own tooltip library (which is mostly tipsy) then
it can now be used on its own without requiring tipsy. The major advantage is that
both a tip and a dialog can be displayed on an element.

## Demo ##

[TipSwift Demo](http://vicb.github.com/tipsy-swift/demo/demo.html)

## Usage ##

Include jquery and tipswift in the document head:

    <script type="text/javascript" src="jquery.tipsy.js"></script>
    <script type="text/javascript" src="jquery.tipswift.js"></script>
    <link rel="stylesheet" type="text/css" href="jquery.tipswift.css" />

Use a jQuery selector in your document ready function:

    jQuery(function($) {
        $("#target").tipSwift({ 
          <options>,
          tip: { <options for the tip> },
          dialog: { <options for the dialog> }
        });
    });

## Options ##

Tipswift options are listed in a javascript object (with their default values):

    $.tipSwift.defaults = {
      live: false,                                          // [GLOBAL] use live events (make tipswift work on dynamically added items)
      gravity: 'n',                                         // tip gravity
      offset: 0,                                            // offset from the element edge in pixel
      opacity: 0.9,                                         // opacity [0..1]
      showEffect: $.tipSwift.effects.show,                  // effect used to show the tip
      hideEffect: $.tipSwift.effects.hide,                  // effect used to hide the tip (must eventually remove() the tip)
      extraClass: [],                                       // extra classes to add the tip
      tip: {
        trigger: 'events',                                  // what triggers showing the tip ('events' or 'manual')
        delayIn: 0,                                         // delay before showing the tip in ms
        delayOut: 0,                                        // delay before hiding the tip in ms
        html: false,                                        // wether to use html for the tip content
        title: 'title',                                     // attribute name or function to use to set the tip title
        fallback: '',                                       // fallback text when the title is empty
        showOn: ['mouseenter', 'focusin'],                  // which events trigger showing the tip
        hideOn: ['mouseleave', 'focusout']                  // which events trigger hiding the tip
      },
      dialog: {
        trigger: 'events',                                  // what triggers showing the dialog ('events' or 'manual')
        showOn: ['click'],                                  // which events trigger showing the dialog
        dialogTemplate: $.tipSwift.templates.dialog,        // the function used to build the dialog markup
        buttonTemplate: $.tipSwift.templates.button         // the function used to build the buttons markup
      }
    };

### Notes ###

The 'live' options is global (you can not define a specific value for tip or dialog).
All others options can be overriden at a tip / dialog level.

Do not define tip in the options when calling tipSwift if you don't want to use a tip,
the same is also true for dialog.

In order to display a dialog, you **must** define all the non optional properties:

- title: HTML for the dialog title (or a function returning the title),
- body (optional): HTML for the dialog body (or a function returning the title),
- buttons: hash of buttons (or a function returning the hash), each key can have the following options:
  - label: button label,
  - action (optional): button onclick callback:
    - receive the event targeting the tipswift target as a parameter,
    - should return false to close the dialog,
    - when no action is specified, the default is to close the dialog.

## Requirements ##

* jQuery 1.4.2+

## Authors & Contributors ##

* [Jason Frame](ttp://github.com/jaz303) is the author of tipsy,
* [TJ Holowaychuk](http://github.com/visionmedia) is the author swift,
* [Victor Berchet](http://github.com/vicb) is the author of tipswift.

## History ##

v2.0.0

Major rewrite:
  * NEW: ability to display both a tip and a dialog for an element (each can define custom options),
  * NEW: dialog can have their content loaded through AJAX,
  * API break: tipswift() has been renammed to tipSwift(),
  * API break: the option format has changed.

v1.1.2 - 2010-08-19

  * Requires jQuery 1.4.2+

v1.1.1 - 2010-08-13

  * API BREAK: the target of events passed to button actions is no more a jQuery object
  * empty btnActions while closing opened instances

v1.1.0 - 2010-08-12

  * API BREAK: tipswift(options) now take a single hash as parameter, label has been moved to the hash and renamed title
  * refactoring
  * allow for dynamic titles

v1.0.1 - 2010-08-11

  * fix a bug when clicking on a trigger with an opened tipswift  
  * improve show and hide animations

v1.0.0 - 2010-08-11

  * Initial release.
  

## License ##

(The MIT License)

Copyright (c) 2010 [Victor Berchet](http://github.com/vicb)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
