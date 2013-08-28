UI = {};

if (Meteor.isClient) {

  // XXX in the future, make the jQuery adapter a separate
  // package and make the choice of back-end library
  // configurable.  Adapters all expose the DomBackend interface.

  if (! Package.jquery)
    throw new Error("Meteor UI jQuery adapter: jQuery not found.");

  var $ = Package.jquery.jQuery;

  var DomBackend = {
    parseHTML: function (html) {
      // Return an array of nodes.
      //
      // jQuery does fancy stuff like creating an appropriate
      // container element and setting innerHTML on it, as well
      // as working around various IE quirks.
      return $.parseHTML(html);
    },
    watchElement: function (elem) {
      $(elem).on('meteor_ui_domrange_gc', $.noop);
    },
    // Called when an element is removed from the DOM using the
    // back-end library directly, either by removing it directly
    // or by removing a parent.
    //
    // To use this, override it (set it).
    onRemoveElement: function (elem) {}
  };

  // See http://bugs.jquery.com/ticket/12213#comment:23
  $.event.special.meteor_ui_domrange_gc = {
    teardown: function() {
      DomBackend.onRemoveElement(this);
    }
  };

  UI.DomBackend = DomBackend;

}