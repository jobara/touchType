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
    
    var stringToArrayTest = function (testName, testString, expectedArray) {
        ttTests.test(testName, function () {
            var splitString = tt.typingTest.stringToArray(testString);
            jqUnit.assertDeepEq("String split correctly", expectedArray, splitString);
        });
    };
    
    $(document).ready(function () {
    
        ttTests.test("Initialization", function () {
            jqUnit.assertTrue("typingTest initialized", createTypingTest());
        });
        
        stringToArrayTest("stringToArray: string separated by single space", "abc def ghi", ["abc", "def", "ghi"]);
        stringToArrayTest("stringToArray: string separated by single tab", "jkl\tmno", ["jkl", "mno"]);
        stringToArrayTest("stringToArray: string separated by multiple spaces", "pqr  stu", ["pqr", "", "stu"]);
        
    });
})(jQuery);
