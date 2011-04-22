/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare Dependencies
/*global setTimeout, clearTimout, tt, jQuery*/

var tt = tt || {};

(function ($) {
    
    var fetchText = function (that, pathToFile) {
        $.ajax({
            url: pathToFile,
            dataType: "text",
            success: that.events.afterTextFetched.fire
        });
    };
    
    var startTimer = function (that) {
        return setTimeout(that.events.afterTimeFinished.fire, 60000);
    };
    
    var calculateWPMStats = function (that) {
        var sampleText = that.toArray(that.sampleText);
        var typedText = that.toArray(that.locate("input").val());
        var errors = that.compare(sampleText, typedText);
        var adjustedWPM = that.calculateWPM(typedText.length, errors.length, 1);
        
        return {
            WPM: typedText.length,
            errors: errors.length,
            adjustedWPM: adjustedWPM
        };
    };
    
    var displayWPM = function (that, WPM) {
        that.locate("WPMScore").text(WPM);
    };
    
    var bindStartEvent = function (that) {
        that.locate("input").bind("keyup.tt-start", function (event) {
            that.events.afterStarted.fire(event.which);
        });
    };
    
    var bindCancelEvent = function (that) {
        that.locate("input").bind("blur.tt-cancel", function (event) {
            that.cancel();
        });
    };
    
    var bindEvents = function (that) {
        bindStartEvent(that);
    };
    
    var addListeners = function (that) {
        that.events.afterStarted.addListener(function () {
            that.locate("input").unbind("keyup.tt-start");
            bindCancelEvent(that);
            that.timerID = startTimer(that);
        });
        
        that.events.afterTimeFinished.addListener(function () {
            that.locate("input").attr("disabled", true);
            var WPMStats = calculateWPMStats(that);
            displayWPM(that, WPMStats.adjustedWPM);
            that.notify(WPMStats);
            that.cancel();
        });
    };
    
    var setup = function (that) {
        bindEvents(that);
        addListeners(that);
        fetchText(that, that.options.texts[0].url);
    };

    fluid.registerNamespace("tt.typingTest");
    
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
    
    tt.typingTest.defaultNotification = function (WPMStats) {
        alert("Your WPM is " + WPMStats.adjustedWPM + "\n\n" + "WPM: " + WPMStats.WPM + "\nErrors: " + WPMStats.errors + "\nAdjusted WPM: " + WPMStats.adjustedWPM);
    };
    
    tt.typingTest.preInit = function (that) {
        that.resetTest = function () {
            var textInput = that.locate("input");
            textInput.val("");
            textInput.removeAttr("disabled");
            textInput.unbind("blur.tt-cancel");
            bindStartEvent(that);
        };
        
        that.cancel = function () {
            clearTimeout(that.timerID);
            that.resetTest();
        };
        
        that.renderText = function (text) {
            that.sampleText = text || "";
            that.locate("sampleText").text(that.sampleText);
        };
    };
    
    tt.typingTest.finalInit = function (that) {
        setup(that);
    };
    
    fluid.defaults("tt.typingTest", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "tt.typingTest.preInit",
        finalInitFunction: "tt.typingTest.finalInit",
        
        invokers: {
            notify: "tt.typingTest.defaultNotification",
            toArray: "tt.typingTest.stringToArray",
            compare: "tt.typingTest.compareStringArrays",
            calculateWPM: "tt.typingTest.wordsPerMinute"
        },
        
        selectors: {
            sampleText: ".tt-typingTest-sampleText",
            input: ".tt-typingTest-input",
            WPMScore: ".tt-typingTest-WMPScore"
        },
        
        listeners: {
            afterTextFetched: "{tt.typingTest}.renderText"
        },
        
        events: {
            afterTextFetched: null,
            afterStarted: null,
            afterTimeFinished: null
        },
        
        texts: [
            {
                name: "Macbeth",
                url: "../text/Macbeth.txt"
            },
            {
                name: "A Tale of Two Cities",
                url: "../text/A_Tale_of_Two_Cities.txt"
            },
            {
                name: "The Wonderful Wizard of Oz",
                url: "../text/The_Wonderful_Wizard_of_Oz.txt"
            }
        ]
    });
})(jQuery);
