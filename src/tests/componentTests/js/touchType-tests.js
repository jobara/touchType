/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare dependencies
/*global tt, jQuery, jqUnit*/

(function ($) {
    var ttTests = new jqUnit.TestCase("touchType Tests");
    
    
    var createTypingTest = function (options) {
        return tt.typingTest("#typingTest", options);
    };
    
    $(document).ready(function () {
    
        ttTests.test("Initialization", function () {
            jqUnit.assertTrue("typingTest initialized", createTypingTest());
        });
        
    });
})(jQuery);
