// jQuery - tipSwift (MIT Licensed)
//
// Copyright (c) 2010 Victor Berchet - http://www.github.com/vicb
//
// parts of the code from:
// - tipsy, (c) 2008-2010 Jason Frame (jason@onehackoranother.com), http://github.com/jaz303/tipsy
// - swift, (c) 2009 TJ Holowaychuk <tj@vision-media.ca>, http://github.com/visionmedia/swift
//
// Version 2.0.0-dev

(function($) {

  var openedDialog,
    btnUid = 0,
    btnActions = {};

  function Tipswift(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = options;
    this.enabled = true;
    this.showTimer = null;
    this.hideTimer = null;
    this.tipOpened = false;
    this.dialogOpened = false;
    this.tipOptions = $.extend({}, options, options.tip || {});
    this.dialogOptions = $.extend({}, options, options.dialog || {});
    this._fixTitle();
  }

  $.extend(Tipswift.prototype, {
    /**
     * Show the tip
     *
     * @params {integer} delayIn delay before showing in ms
     */
    showTip: function(delayIn) {
      if (!this.dialogOpened) {
        var o = this.tipOptions;
        delayIn = typeof delayIn == 'undefined' ? o.tip.delayIn : delayIn;
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
        if (delayIn && !this.showTimer) {
          this._fixTitle();
          this.showTimer = setTimeout($.proxy(this.showTip, this), delayIn);
        } else {
          clearTimeout(this.showTimer);
          this.showTimer = null;
          var content = this._getTipContent();
          if (content && this.enabled) {
            o.showEffect.call(this._buildDom(content, 'tip'), o, this.gravity);
            this.tipOpened = true;
          }
        }
      }
    },

    /**
     * Hide the tip
     *
     * @params {integer} delayOut delay before hiding in ms
     */
    hideTip: function(delayOut) {
      if (!this.dialogOpened) {
        var o = this.tipOptions;
        delayOut = typeof delayOut == 'undefined' ? o.tip.delayOut : delayOut;
        clearTimeout(this.showTimer);
        this.showTimer = null;
        if (delayOut && !this.hideTimer) {
          this.hideTimer = setTimeout($.proxy(this.hideTip, this), delayOut);
        } else if (this.tipOpened) {
          clearTimeout(this.hideTimer);
          this.hideTimer = null;
          o.hideEffect.call(this.tip(), this.options, this.gravity);
          this.tipOpened = false;
        }
      }
    },

    /**
     * Show the dialog
     */
    showDialog: function() {
      if (openedDialog) { openedDialog.hideDialog(); openedDialog = null; }
      if (this.tipOpened) { this.tip().remove();}
      if (this.enabled) {
        var o = this.dialogOptions, content = this._getDialogContent();
        o.showEffect.call(this._buildDom(content, 'dialog'), o, this.gravity);
        this.dialogOpened = true;
        openedDialog = this;
        var tip = this.tip(), self = this;
        tip.delegate('[id^=btn-tipswift-]', 'click',  function (e) {
          e.target = self.element;
          if (btnActions[$(this).attr('id')].call(tip, e) !== false) { self.hideDialog(); }
        });
      }
    },

    /**
     * Hide the dialog
     */
    hideDialog: function() {
      var o = this.dialogOptions;
      o.hideEffect.call(this.tip(), o, this.gravity);
      this.dialogOpened = false;
    },

    /**
     * Returns the tip jQuery object (and build it when it does not exist)
     *
     * @return {jQuery}
     */
    tip: function() {
      if (!this.$tip) {
        this.$tip = $('<div class="tipswift"></div>').html('<div class="tipswift-arrow"></div><div class="tipswift-inner"></div>');
      }
      return this.$tip;
    },

    validate: function() {
      if (!this.$element[0].parentNode) {
        this.hide();
        this.$element = null;
        this.options = null;
      }
    },

    enable: function() {this.enabled = true;},

    disable: function() {this.enabled = false;},

    toggleEnabled: function() {this.enabled = !this.enabled;},
    
    /**
     * Build the DOM
     *
     * @param {string} content tip content (either html or text)
     * @param {string} type either 'tip' or 'dialog'
     * @return {jQuery} the tip
     */
    _buildDom: function(content, type)
    {
        var o, html, $tip = this.tip();

        if (type == 'tip') {
          html = this.options.tip.html;
          o = this.tipOptions;
        } else {
          html = true;
          o = this.dialogOptions;
        }

        $tip.find('.tipswift-inner')[html ? 'html' : 'text'](content);
        $tip[0].className = 'tipswift'; // reset classname in case of dynamic gravity
        $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);

        var pos = $.extend({}, this.$element.offset(), {
          width: this.$element[0].offsetWidth,
          height: this.$element[0].offsetHeight
        });

        var actualWidth = $tip[0].offsetWidth, actualHeight = $tip[0].offsetHeight;
        this.gravity = $.isFunction(o.gravity) ? o.gravity.call(this.$element[0]) : o.gravity;

        var tp;
        switch (this.gravity.charAt(0)) {
          case 'n':
            tp = {top: pos.top + pos.height + o.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
          case 's':
            tp = {top: pos.top - actualHeight - o.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
          case 'e':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - o.offset};
            break;
          case 'w':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + o.offset};
            break;
        }

        if (this.gravity.length == 2) {
          if (this.gravity.charAt(1) == 'w') {
            tp.left = pos.left + pos.width / 2 - 15;
          } else {
            tp.left = pos.left + pos.width / 2 - actualWidth + 15;
          }
        }

        $tip.css(tp).addClass('tipswift-' + this.gravity).addClass(type).addClass(o.extraClass.join(' '));

        return $tip;
    },

    /**
     * Generate the markup for the dialog
     *
     * @return {string} markup
     * @see $.fn.tipSwift.templates.dialog
     */
    _getDialogContent: function() {
      return $.fn.tipSwift.templates.dialog(this.options.dialog, this._getButtonsContent());
    },

    /**
     * Generate the markup for all the buttons.
     *
     * @return {string}
     * @see $.fn.tipSwift.templates.button
     * @api private
     */
    _getButtonsContent: function() {
      var id, buf = '', o = this.options.dialog;
      var buttons = $.isFunction(o.buttons) ? o.buttons() : o.buttons;
      $.each(buttons, function (k, v) {
        id = "btn-tipswift-" + btnUid++;
        buf += $.fn.tipSwift.templates.button(k, v.label, id);
        btnActions[id] = v.action || $.noop;
      });
      return buf;
    },

    /**
     * Returns the content of the tip
     *
     * @returns {string}
     */
    _getTipContent: function() {
      var title, $e = this.$element, o = this.options.tip;
      this._fixTitle();
      if (typeof o.title == 'string') {
        title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
      } else if (typeof o.title == 'function') {
        title = o.title.call($e[0]);
      }
      title = ('' + title).replace(/(^\s*|\s*$)/, '');
      return title || o.fallback;
    },

    /**
     * Remove the element title attribute (to prevent browsers from displaying a tip)
     */
    _fixTitle: function() {
      var $e = this.$element;
      if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
        $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
      }
    }

  });

  $.fn.tipSwift = function(options) {

    if (options === true) {
      return this.data('tipswift');
    } else if (typeof options == 'string') {
      var tipswift = this.data('tipswift');
      if (tipswift) { tipswift[options](); }
      return this;
    }

    var hasTip = typeof options.tip != 'undefined',
      hasDialog = typeof options.dialog != 'undefined';

    $.extend(true, {}, $.fn.tipSwift.defaults, options);

    function get(ele) {
      var tipswift = $.data(ele, 'tipswift');
      if (!tipswift) {
        tipswift = new Tipswift(ele, $.fn.tipSwift.elementOptions(ele, options));
        $.data(ele, 'tipswift', tipswift);
      }
      return tipswift;
    }

  function enter() {
    var tipswift = get(this);
    tipswift.showTip();
  }

  function leave() {
    var tipswift = get(this);
    tipswift.hideTip();
  }

  function showDialog(e) {
    e.preventDefault();
    var tipswift = get(this);
    tipswift.showDialog();
  }

    if (!options.live) { this.each(function() { get(this); }); }

    var binder = options.live ? 'live' : 'bind';

    if (hasTip && options.tip.trigger != 'manual') {
      this[binder](options.tip.showOn.join(' '), enter);
      this[binder](options.tip.hideOn.join(' '), leave);
    }

    if (hasDialog && options.dialog.trigger != 'manual') {
      this[binder](options.dialog.showOn.join(' '), showDialog);
    }

    return this;
  };

  $.extend($.fn.tipSwift, {
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipswift-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipswift-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    elementOptions : function(ele, options) {
      return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    },

    gravity: {
      autoNS : function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
      },

      autoWE : function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
      }
    },

    effects : {
      show: function(options) {
        this.css({visibility: 'visible', opacity: options.opacity});
      },

      hide: function() {
      this.remove();
      },

      fadeIn: function(options) {
      this.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: options.opacity});
      },

      fadeOut: function() {
      this.stop().fadeOut(function() { $(this).remove(); });
      },

      slideOutWE: function(options, gravity) {
        this.stop()
          .css({visibility: 'visible', opacity: 0})
          .animate({ left: '+=' + 15 * (gravity.indexOf('e') > -1 ? -1 : 1), opacity: options.opacity });
      },
      
      slideInWE: function(options, gravity) {
        this.stop()
          .animate({
            left: '-=' + 15 * (gravity.indexOf('e') > -1 ? -1 : 1),
            opacity: 0
          },
          function(){ $(this).remove(); }
        );
      }
    },

    templates : {
      /**
       * Generate the tipswift markup with the given _options_.
       *
       * Options:
       *
       *  - title:   arbitrary text used as dialog title
       *  - body:    arbitrary text or markup placed before buttons
       *  - buttons: buttons markup
       *
       * @param  {String} label
       * @param  {Object} options
       * @param  {String} buttons: buttons markup
       * @return {String} dialog markup
       */
      dialog: function(options, buttons) {
        var title = $.isFunction(options.title) ? options.title() : options.title,
        body = $.isFunction(options.body) ? options.body() : options.body;
        return '<span class="tipswift-title">' + title + '</span>' +
          (options.body?'<span class="tipswift-body">' + (body) + '</span>':'') +
          '<span class="tipswift-button">' + buttons + '</span>';
      },

      /**
       * Generate a button markup with the given _name_, _value_ and _id_
       *
       * @param  {String} name
       * @param  {String} value
       * @param  {String} id: must be used as element's id
       * @return {String} button markup
       */
      
      button: function(name, value, id) {
        return '<input type="button" id="' + id + '" name="' + name + '" value="' + value + '" />';
      }
    }

  });

  $.fn.tipSwift.defaults = {
    live: false,                                          // [GLOBAL] use live events (make tipswift work on dynamically added items)
    gravity: 'n',                                         // tip gravity
    offset: 0,                                            // offset from the element edge in pixel
    opacity: 0.9,                                         // opacity [0..1]
    showEffect: $.fn.tipSwift.effects.show,               // effect used to show the tip
    hideEffect: $.fn.tipSwift.effects.hide,               // effect used to hide the tip (must eventually remove() the tip)
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
      dialogTemplate: $.fn.tipSwift.templates.dialog,     // the function used to build the dialog markup
      buttonTemplate: $.fn.tipSwift.templates.button      // the function used to build the buttons markup
    }
  };

})(jQuery);
