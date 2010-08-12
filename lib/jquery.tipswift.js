
// jQuery - tipswift (MIT Licensed)
// 
// Copyright (c) 2010 Victor Berchet - http://www.github.com/vicb
//
// heavily inspired by swift, copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca>
//
// History:
// 
// - v1.0.0 - 2010-08-11: initial release
// - v1.0.1 - 2010-08-11: fix a bug when clicking on a trigger with an opened tipswift
// - v1.1.0 - 2010-08-12: refactoring, allow for dynamic titles

;(function($){
  
  // --- tipsy instances, button indexes and mapping
  
  var opened = [],
    btnUid = 0,
    btnActions = {};

  function Tipswift(target, options)
  {
    var self = this;
    this.setOptions(options);
    options.tipsy.title = function() {return self.getHtml.call(self, this);};
    $(target).tipsy(options.tipsy);
    this.tipsy = $(target).tipsy(true);
  }

  Tipswift.prototype = {
    setOptions: function(options) {
      this.options = options;
      return this;
    },

    getHtml: function() {
      return $.fn.tipswift.templates.dialog(this.options, this.getButtonsHtml());
    },

    /**
     * Generate the markup for all buttons from the given _options_.
     *
     * @return {string}
     * @see $.fn.tipswift.templates.button
     * @api private
     */
    getButtonsHtml: function()
    {
      var id, buf = '';
      $.each(this.options.buttons, function(k, v) {
        id = "btn-tipswift-" + btnUid++;
        buf += $.fn.tipswift.templates.button(k, v.label, id);
        btnActions[id] = v.action || function() {};
      });
      return buf;
    },

    close: function() {
      this.tipsy.hide();
      return this;
    },

    show: function() {
      this.tipsy.show();
      return this;
    },

    tip: function() {
      return this.tipsy.tip();
    }
  }  
  
  /**
   * Create a tipswift instance applied to the first element
   * in the collection. Self-positions based on it's offset.
   *
   * Returns the first element.
   *
   * Options:
   *
   *  - title:     arbitrary text or markup for the dialog title
   *  - body:      arbitrary text or markup placed before buttons
   *  - buttons:   hash of buttons passed to buttons()
   *
   * @param  {Object} options
   * @return {jQuery}
   * @api public
   */
  
  $.fn.tipswift = function(options) {
    options = $.extend(true, {}, $.fn.tipswift.conf, options);

    var tip, 
      target = this[0],
      tipswift = $.data(target, 'tipswift');

    for (; tip = opened.pop();) {
      tip.close();
    }

    if (!tipswift) {
      tipswift = new Tipswift(target, options);
      $.data(target, 'tipswift', tipswift);
    } 

    opened.push(tipswift.setOptions(options).show());

    tip = tipswift.tip();
    tip.find('[id^=btn-tipswift-]')
    .click(function(e){
      e.target = $(target);
      if (btnActions[$(this).attr('id')].call(tip, e) !== false) { tipswift.close();}
    });

    return $(target);
    
  };

  $.extend($.fn.tipswift, {
    effects: {

      /**
       * tipsy custom show animation
       *
       * @param  {jQuery} tip: dialog
       * @param  {Object} options: tipsy options
       */
      
      show: function(tip, options) {
        tip.stop()
          .css({visibility: 'visible', opacity: 0})
          .animate({left: '+=' + 15 * (options.actualGravity.indexOf('e') > -1?-1:1), opacity: options.opacity});
      },

      /**
       * tipsy custom hide animation
       *
       * @param  {jQuery} tip: dialog
       * @param  {Object} options: tipsy options
       */

      hide: function(tip, options) {
        tip.stop()
          .animate({
            left: '-=' + 15 * (options.actualGravity.indexOf('e') > -1?-1:1),
            opacity: 0
          },
          function(){$(this).remove();}
        );
      }

    },

    templates : {
      
      /**
       * Generate the tipswift markup with the given _label_ and _options_.
       *
       * Options:
       *
       *  - body:    arbitrary text or markup placed before buttons
       *  - buttons: hash of buttons passed to buttons()
       *
       * @param  {String} label
       * @param  {Object} options
       * @param  {String} buttons: buttons markup
       * @return {String} dialog markup
       */

      dialog: function(options, buttons) {
        return '<span class="tipswift">' +
          '<span class="tipswift-title">' + options.title + '</span>' +
          (options.body?'<span class="tipswift-body">' + (options.body) + '</span>':'') +
          '<span class="tipswift-button">' + buttons + '</span>' +
        '</span>';
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

  $.fn.tipswift.conf = {
    dialogTpl: $.fn.tipswift.templates.dialog,
    buttontpl: $.fn.tipswift.templates.button,
    tipsy: {
      trigger: 'manual',
      gravity: $.fn.tipsy.autoWE,
      html: true,
      showTip: function(options) {$.fn.tipswift.effects.show(this, options);},
      hideTip: function(options) {$.fn.tipswift.effects.hide(this, options);}
    }
  };

})(jQuery);
