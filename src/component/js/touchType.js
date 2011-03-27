/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare Dependencies
/*global tt, jQuery*/

var tt = tt || {};

(function ($) {
    
    var fetchText = function (that, pathToFile) {
        $.ajax({
            url: pathToFile,
            dataType: "text",
            success: that.events.afterTextFetched.fire
        });
    };
    
    var renderText = function (that, text) {
        var sampleText = that.locate("sampleText");
        sampleText.text(text);
    };
    
    var addListeners = function (that) {
        that.events.afterTextFetched.addListener(function (text) {
            renderText(that, text);
        });
    };
    
    var setup = function (that) {
        addListeners(that);
        fetchText(that, "../text/Macbeth.txt");
    };
    
    tt.typingTest = function (container, options) {
        var that = fluid.initView("tt.typingTest", container, options);
        
        setup(that);
        
        return that;
    };
    
    tt.typingTest.stringToArray = function (str) {
        return str.split(/\s/);
    };
    
    tt.typingTest.compareStringArrays = function (baseArray, comparisonArray) {
        var differences = [];
        
        for (var i = 0; i < comparisonArray.length; i++) {
            var baseString = baseArray[i];
            var comparisonString = comparisonArray[i];
            
            if (baseString !== comparisonString) {
                differences.push({
                    position: i,
                    expected: baseString,
                    actual: comparisonString
                });
            }
        }
        
        return differences;
    };
    
    tt.typingTest.wordsPerMinute = function (numWords, numErrors, numMinutes) {
        return Math.max((numWords - numErrors) / numMinutes, 0);
    };
    
    fluid.defaults("tt.typingTest", {
        selectors: {
            sampleText: ".tt-typingTest-sampleText",
            input: ".tt-typingTest-input"
        },
        
        events: {
            afterTextFetched: null
        }
    });
})(jQuery);
