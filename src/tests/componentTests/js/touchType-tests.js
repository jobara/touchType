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
    
    var compareStringArraysTest = function (testName, baseArray, comparisonArray, expectedComparison) {
        ttTests.test(testName, function () {
            var actualComparison = tt.typingTest.compareStringArrays(baseArray, comparisonArray);
            jqUnit.assertDeepEq("Arrays diffed correctly", expectedComparison, actualComparison);
        });
    };
    
    var wordsPerMinuteTest = function (testName, numWords, numErrors, numMinutes, expectedWPM) {
        ttTests.test(testName, function () {
            var actualWPM = tt.typingTest.wordsPerMinute(numWords, numErrors, numMinutes);
            jqUnit.assertEquals("WPM calculated correctly", expectedWPM, actualWPM);
        });
    };
    
    $(document).ready(function () {
    
        ttTests.test("Initialization", function () {
            jqUnit.assertTrue("typingTest initialized", createTypingTest());
        });
        
        stringToArrayTest("stringToArray: string separated by single space", "abc def ghi", ["abc", "def", "ghi"]);
        stringToArrayTest("stringToArray: string separated by single tab", "jkl\tmno", ["jkl", "mno"]);
        stringToArrayTest("stringToArray: string separated by multiple spaces", "pqr  stu", ["pqr", "", "stu"]);
        
        compareStringArraysTest("compareStringArrays: compare equivalent arrays", ["abc", "def"], ["abc", "def"], []);
        compareStringArraysTest("compareStringArrays: base array longer", ["abc", "def", "ghi"], ["abc", "def"], []);
        compareStringArraysTest("compareStringArrays: comparison array longer", ["abc", "def"], ["abc", "def", "ghi"], [{
            position: 2,
            expected: undefined,
            actual: "ghi"
        }]);
        compareStringArraysTest("compareStringArrays: comparison array different", ["abc", "def"], ["abc", "ghi"], [{
            position: 1,
            expected: "def",
            actual: "ghi"
        }]);
        
        wordsPerMinuteTest("wordsPerMinute: no errors", 12, 0, 1, 12);
        wordsPerMinuteTest("wordsPerMinute: no errors, 2 minutes", 12, 0, 2, 6);
        wordsPerMinuteTest("wordsPerMinute: with errors", 12, 2, 1, 10);
        wordsPerMinuteTest("wordsPerMinute: with errors, 2 minutes", 12, 2, 2, 5);
        wordsPerMinuteTest("wordsPerMinute: more errors than words", 12, 22, 1, 0);
    });
})(jQuery);
