# TipSwift #

TipSwift is a tiny jQuery plugin for displaying inline context-based dialog boxes
ranging from prompts to confirmations for an ultra-sexy user interface.

TipSwift is essentially a port of [swift](http://github.com/visionmedia/swift) to [tipsy](http://github.com/jaz303/tipsy).

## Demo ##

[TipSwift Demo](http://vicb.github.com/tipsy-swift/demo/demo.html)

## Usage ##

Include jquery, tipsy, and tipswift in the document head:

    <script type="text/javascript" src="jquery.tipsy.js"></script>
    <script type="text/javascript" src="jquery.tipswift.js"></script>
    <link rel="stylesheet" type="text/css" href="jquery.tipswift.css" />

Use a jQuery selector in your document ready function:

    jQuery(function($) {
        $("#target").click(function(){ $(this).tipswift(options)} );
    });

## Options ##

Tipswift options are listed in a javascript object:

- title: HTML for the dialog title,
- body: HTML for the dialog body,
- buttons: hash of buttons, each key can have the following options:
  - label: button label [required],
  - action: button onclick callback:
    - receive the event targeting the tipswift target as a parameter,
    - should return false to close the dialog,
    - when no action is specified, the default action closes the dialog.
- tipsy: tipsy options
- dialogTpl: function returning the dialog HTML markup. Function arguments are:
  - label: the dialog label,
  - options: the dialog options,
  - buttons: the buttons HTML markup.
- buttonTpl: function returning a button markup. Function arguments are:
  - name: the button name,
  - value: the button value (label),
  - id: this must be set as element id in order to bind the click event.

The options defaults are as follow:

- dialogTpl = `$.fn.tipswift.templates.dialog`,
- buttontpl = `$.fn.tipswift.templates.button`,
- tipsy =
  - trigger = 'manual',
  - gravity = `$.fn.tipsy.autoWE`,
  - html = true,
  - showTip = `function(options) {$.fn.tipswift.effects.show(this, options);}`,
  - hideTip = `function(options) {$.fn.tipswift.effects.hide(this, options);}`

## Warning ##

**For now a custom version a tipsy is required in order to be able to customize the
show and hide effects.**

This version includes [commit c33b2372a3103b7543c2](http://github.com/vicb/tipsy/commit/c33b2372a3103b7543c28372e2e64cec7c535030) and can be found [here](http://github.com/vicb/tipsy).

The documentation will be updated when this commit eventually gets integrated in
the mainstream.

## Requirements ##

* jQuery 1.4.2+
* tipsy 1.0.0a + custom animation patch

## Authors & Contributors ##

* [TJ Holowaychuk](http://github.com/visionmedia) is the author of the original swift,
* [Victor Berchet](http://github.com/vicb) is the author of tipswift.

## History ##

b1.1.2 - 2010-08-19

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
