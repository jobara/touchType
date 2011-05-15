/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare Dependencies
/*global demo:true, tt, fluid, jQuery*/

var demo = demo || {};

(function ($) {
    
    demo.init = function () {
        demo.tt = tt.typingTest("#typingTest", {
            texts: [{name: "Macbeth", url: "../text/Macbeth.txt"}]
        });
        
        $(".demo-cancel").click(demo.tt.cancel);
        $(".demo-finish").click(demo.tt.finish);
    };
    
})(jQuery);
