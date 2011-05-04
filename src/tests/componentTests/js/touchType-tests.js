/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare dependencies
/*global tt, fluid, jQuery, jqUnit, start*/

(function ($) {
    
    fluid.staticEnvironment.unitTest = fluid.typeTag("tt.typingTest.unitTest");
    
    fluid.demands("tt.typingTest.defaultNotification", "tt.typingTest.unitTest", {
        funcName: "fluid.emptySubcomponent"
    });
    
    var ttTests = new jqUnit.TestCase("touchType Tests");
    
    var textObj = {
        name: "Macbeth",
        url: "../../../component/text/Macbeth.txt"
    };
    
    var createTypingTest = function (options) {
        var mergedOptions = fluid.merge("replace", {
            texts: [textObj]
        }, options);
        return tt.typingTest("#typingTest", mergedOptions);
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
    
    var rendetTextTest = function (testName, testText) {
        ttTests.test(testName, function () {
            var typingTest = createTypingTest();
            typingTest.renderText(testText);
            jqUnit.assertEquals("The sample text should be rendered", testText || "", typingTest.locate("sampleText").text());
        });
    };
    
    $(document).ready(function () {
    
        ttTests.asyncTest("Initialization", function () {
            var typingTest = createTypingTest();
            var textTest = function (text) {
                jqUnit.assertEquals("The sample text is set correctly", text, typingTest.sampleText);
                start();
            };
            
            jqUnit.assertTrue("typingTest initialized", typingTest);
            
            $.ajax({
                url: textObj.url,
                dataType: "text",
                success: textTest
            });
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
        
        ttTests.test("that.resetTest", function () {
            var typingTest = createTypingTest();
            var input = typingTest.locate("input");
            
            input.val("test");
            input.attr("disabled", true);
            
            typingTest.resetTest();
            
            jqUnit.assertEquals("The input should have an empty value", "", input.val());
            jqUnit.assertFalse("There should not be a 'disabled' attribute on the input", input.attr("disabled"));
        });
        
        rendetTextTest("that.renderText: with text passed in", "TEST TEXT");
        rendetTextTest("that.renderText: with text passed in");
        
        ttTests.test("that.start", function () {
            var typingTest = createTypingTest();
            
            typingTest.start();
            
            jqUnit.assertTrue("The timerID should be set", typingTest.timerID);
        });
    });
})(jQuery);
