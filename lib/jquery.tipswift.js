
// jQuery - tipswift (MIT Licensed)
// 
// Copyright (c) 2010 Victor Berchet - http://www.github.com/vicb
//
// heavily inspired by swift, copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca>
//
// History:
// 
// - v1.0.0 - 2010-08-11: initial release

;(function($){
  
  // --- tipsy instances, button indexes and mapping
  
  var tipsies = [],
    btnUid = 0,
    btnMapping = {};
  
  /**
   * Generate the markup for all buttons from the given _options_.
   *
   * @param  {Object} options
   * @return {string}
   * @see $.fn.tipswift.templates.button
   * @api private
   */
  
  function buttons(options) {
    var id, buf = '';
    $.each(options, function(k, v) {
      v.action = v.action || function(){};
      id = "btn-tipswift-" + btnUid++;
      buf += $.fn.tipswift.templates.button(k, v.label, id);
      btnMapping[id] = v;
    });
    return buf;
  }
   
  /**
   * Close opened tipsies
   *
   * @see $.fn.swift.effects.hide
   * @api private
   */
  
  function close() {
    var tipsy;
    for (;tipsy = tipsies.pop();) {
      tipsy.hide();
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
   *  - body:      arbitrary text or markup placed before buttons
   *  - buttons:   hash of buttons passed to buttons()
   *
   * @param  {String} label
   * @param  {Object} options
   * @return {jQuery}
   * @api public
   */
  
  $.fn.tipswift = function(label, options) {
    options = $.extend(true, {}, $.fn.tipswift.conf, options);
    close(options);

    var tipsy = $(target).tipsy(true), target = this;

    if (!tipsy) {
      var html = $.fn.tipswift.templates.dialog(label, options, buttons(options.buttons));
      options.tipsy.title = function() { return html;};
      tipsy = $(target).tipsy(options.tipsy).tipsy(true);
    }

    tipsies.push(tipsy);
    tipsy.show();
    var tip = tipsy.tip();
    tip.find('[id^=btn-tipswift-]')
    .click(function(e){
      e.target = target;
      if (btnMapping[$(this).attr('id')].action.call(tip, e) !== false) { close(); }
    });
    return target;
    
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
          function(){ $(this).remove(); }
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

      dialog: function(label, options, buttons) {
        return '<span class="tipswift">' +
          '<span class="tipswift-title">' + label + '</span>' +
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