/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare Dependencies
/*global bb-tt, tt, jQuery*/

var tt = tt || {};
var bb_tt = bb_tt || {};

(function ($) {
    bb_tt.launch = function () {
        tt.typingTest("#typingTest");
        $(".tt-typingTest-input").focus();
    };
})(jQuery);
