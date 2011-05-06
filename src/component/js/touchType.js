/*
Copyright 2011 Justin Obara

Licensed under the MIT License. You may not use this file except 
in compliance with this License.
*/

// Declare Dependencies
/*global alert, setTimeout, clearTimout, tt:true, fluid, jQuery*/

var tt = tt || {};

(function ($) {
    
    var startTimer = function (that) {
        return setTimeout(that.events.onFinish.fire, 60000);
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
            that.events.onStart.fire(event.which);
        });
    };
    
    var bindCancelEvent = function (that) {
        that.locate("input").bind("blur.tt-cancel", function (event) {
            that.events.onCancel.fire();
        });
    };
    
    var setup = function (that) {
        bindStartEvent(that);
        that.fetchText(that.options.texts[0].url);
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
    
    tt.typingTest.getText = function (pathToFile, success, error) {
        $.ajax({
            url: pathToFile,
            dataType: "text",
            success: success,
            error: error
        });
    };
    
    tt.typingTest.preInit = function (that) {
        that.resetTest = function () {
            clearTimeout(that.timerID || null);
            var textInput = that.locate("input");
            textInput.val("");
            textInput.removeAttr("disabled");
            textInput.unbind("blur.tt-cancel");
            bindStartEvent(that);
        };
        
        that.cancel = function () {
            that.resetTest();
            that.events.afterCancelled.fire();
        };
        
        that.fetchText = function (pathToFile) {
            that.getText(pathToFile, that.events.afterTextFetched.fire);
        };
        
        that.renderText = function (text) {
            that.sampleText = text || "";
            that.locate("sampleText").text(that.sampleText);
            that.events.afterTextRendered.fire(that.sampleText);
        };
        
        that.start = function () {
            that.locate("input").unbind("keyup.tt-start");
            bindCancelEvent(that);
            that.timerID = startTimer(that);
            that.events.afterStarted.fire();
        };
        
        that.finish = function () {
            that.locate("input").attr("disabled", true);
            var WPMStats = calculateWPMStats(that);
            displayWPM(that, WPMStats.adjustedWPM);
            that.notify(WPMStats);
            that.resetTest();
            that.events.afterFinished.fire();
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
            calculateWPM: "tt.typingTest.wordsPerMinute",
            getText: "tt.typingTest.getText"
        },
        
        selectors: {
            sampleText: ".tt-typingTest-sampleText",
            input: ".tt-typingTest-input",
            WPMScore: ".tt-typingTest-WMPScore"
        },
        
        listeners: {
            afterTextFetched: "{tt.typingTest}.renderText",
            onStart: "{tt.typingTest}.start",
            onFinish: "{tt.typingTest}.finish",
            onCancel: "{tt.typingTest}.cancel"
        },
        
        events: {
            afterTextFetched: null,
            afterTextRendered: null, 
            onStart: "preventable",
            afterStarted: null,
            onFinish: "preventable",
            afterFinished: null,
            onCancel: "preventable",
            afterCancelled: null
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
