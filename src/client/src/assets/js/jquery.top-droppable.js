
(function($){
  $.getTopElementManager = () => { return topElementManager; }

  var topElementManager = {
    list: [],

    addElement: function (element) {
      var z = parseInt($(element).css("z-index"));
      if (isNaN(z)) {
        console.error("ERROR: please add a specific z-index to your topDroppable Elements!");
        return;
      }
      var pos = this._searchPosition(z);
      this.list.splice(pos, 0, { z: z, element: element });
    },

    deleteElement: function (element) {
      var pos = this.list.findIndex(function (e) {
        return e.element === element; 
      });
      this.list.splice(pos, 1);
    },

    clearList: function () {
      this.list = [];
    },

    isTop: function(e) {
      return e && this.list.length && this.list[0].element === e;
    },

    _searchPosition: function (z) {

      var i, L = this.list,
        l = 0, r = L.length - 1;

      while (l <= r) {
        i = (l + r) / 2 | 0;
        if (L[i].z <= z) {
          r = i - 1;
        } else {
          l = i + 1;
        }
      }

      return r + 1;
    }
  };

  $.fn.extend({ 

    topDroppable: function(settings) {

      var defaults = {

        drop: function() {},

      };
      var settings = $.extend(defaults, settings);

      return this.each(function() {
        $(this).on("dropover", function(event, ui) {
          topElementManager.addElement(this);
        });
        $(this).on("dropout", function(event, ui) {
          if (!$(this).hasClass('ui-droppable-hover')) {
            topElementManager.deleteElement(this);
          }
        });
        $(this).on("drop", function(event, ui) {
          if (topElementManager.isTop(this)) {
            topElementManager.clearList();
            settings.drop.call(this, event, ui);
          }
        });
      });
    }
  });	
})(jQuery);
