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
    
    var sampleText = "Sample Text";
    
    tt.unitTestGetText = function (pathToFile, success, error) {
        success(sampleText);
    };
    
    fluid.demands("tt.typingTest.getText", "tt.typingTest.unitTest", {
        funcName: "tt.unitTestGetText"
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
    
    var wordsPerMinuteTest = function (testName, numWords, numErrors, numSeconds, expectedWPM) {
        ttTests.test(testName, function () {
            var actualWPM = tt.typingTest.wordsPerMinute(numWords, numErrors, numSeconds);
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
    
    var eventTest = function (testName, eventToTest, instanceFunc) {
        ttTests.asyncTest(testName, function () {
            var eventFired = false;
            var listeners = {};
            
            listeners[eventToTest] = function () {
                eventFired = true;
                start();
            };
            
            var typingTest = createTypingTest({listeners: listeners});
            
            typingTest[instanceFunc]();
            jqUnit.assertTrue("The " + eventToTest + " event should have fired", eventFired);
        });
    };
    
    $(document).ready(function () {
    
        ttTests.asyncTest("Initialization", function () {
            var typingTest;
                           
            var textTest = function (text) {
                jqUnit.assertEquals("The sample text is set correctly", sampleText, text);
                start();
            };
                           
            typingTest = createTypingTest({
                listeners: {
                    afterTextRendered: textTest
                }
           });
           
           jqUnit.assertTrue("typingTest initialized", typingTest);
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
        
        wordsPerMinuteTest("wordsPerMinute: no errors", 12, 0, 60, 12);
        wordsPerMinuteTest("wordsPerMinute: no errors, 2 minutes", 12, 0, 120, 6);
        wordsPerMinuteTest("wordsPerMinute: with errors", 12, 2, 60, 10);
        wordsPerMinuteTest("wordsPerMinute: with errors, 2 minutes", 12, 2, 120, 5);
        wordsPerMinuteTest("wordsPerMinute: more errors than words", 12, 22, 60, 0);
        wordsPerMinuteTest("wordsPerMinute: less than a minute", 12, 0, 20, 36);
        wordsPerMinuteTest("wordsPerMinute: more than a minute", 12, 0, 90, 8);
        wordsPerMinuteTest("wordsPerMinute: result rounded down", 13, 0, 90, 8);
        
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
        
        ttTests.test("that.start: timerID", function () {
            var typingTest = createTypingTest();
            
            typingTest.start();
            jqUnit.assertTrue("The timerID should be set", typingTest.timerID);
        });
        
        eventTest("that.start: afterStarted event", "afterStarted", "start");
        eventTest("that.cancel: afterCancelled event", "afterCancelled", "cancel");
        eventTest("that.finish: afterFinished event", "afterFinished", "finish");
    });
})(jQuery);
