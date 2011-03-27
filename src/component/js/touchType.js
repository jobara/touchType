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
        that.sampleText = text;
        var sampleTextDisplay = that.locate("sampleText");
        sampleTextDisplay.text(that.sampleText);
    };
    
    var startTimer = function (that) {
        setTimeout(that.events.afterTimeFinished.fire, 60000);
    };
    
    var calculateWPM = function (that) {
        var sampleText = tt.typingTest.stringToArray(that.sampleText);
        var typedText = tt.typingTest.stringToArray(that.locate("input").val());
        var errors = tt.typingTest.compareStringArrays(sampleText, typedText);
        
        return tt.typingTest.wordsPerMinute(typedText.length, errors.length, 1);
    };
    
    var displayWPM = function (that, WPM) {
        that.locate("WPMScore").text(WPM);
    };
    
    var bindStartEvent = function (that) {
        that.locate("input").bind("keyup.tt-start", function (event) {
            that.events.afterStarted.fire(event.which);
        });
    };
    
    var bindEvents = function (that) {
        bindStartEvent(that);
    };
    
    var addListeners = function (that) {
        that.events.afterTextFetched.addListener(function (text) {
            renderText(that, text);
        });
        
        that.events.afterStarted.addListener(function () {
            that.locate("input").unbind("keyup.tt-start");
            that.timerID = startTimer(that);
        });
        
        that.events.afterTimeFinished.addListener(function () {
            var WPM = calculateWPM(that);
            displayWPM(that, WPM);
        });
    };
    
    var setup = function (that) {
        bindEvents(that);
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
            input: ".tt-typingTest-input",
            WPMScore: ".tt-typingTest-WMPScore"
        },
        
        events: {
            afterTextFetched: null,
            afterStarted: null,
            afterTimeFinished: null
        }
    });
})(jQuery);
