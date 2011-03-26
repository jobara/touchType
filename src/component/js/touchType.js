/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare Dependencies
/*global tt, jQuery*/

var tt = tt || {};

(function ($) {
    tt.typingTest = function (container, options) {
        var that = fluid.initView("tt.typingTest", container, options);
        
        return that;
    };
    
    tt.typingTest.stringToArray = function (str) {
        return str.split(/\s/);
    };
    
    fluid.defaults("tt.typingTest", {
        
    });
})(jQuery);
