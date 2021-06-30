"use strict";
class ClockDemo {
    constructor(parent)
    {
        // declare/initialize object properties
        var clock = new Clock();
        console.log(clock);
        var mode = 0;
        var score = 0;
        var item = 1;
        var maxItems = 10;
        var inGame = false;
        var difficulty = 2;
        var createElementEx, setMode, generateItem, setItemNumber, setScore, setMaxItems; // inline functions
        var clockDemoDiv, clockWrapper, clockSizer, clockSize, basicControls, gameControls, gameControl, diffSetWrapper, timeSetters, timeValues, timeValueResponse, hourBox, minuteBox, submitButton, itemNumberBox, scoreBox;

        // declare and define inline functions
        createElementEx = function(elName, parent) { // args: elName, parent, nextNode, argName1, argVal1, argName2, argVal2, ...
            var el;
            if (elName == "")
                throw("Element name cannot be empty.");
            else {
                el = document.createElement(elName);

                if (arguments.length > 2) {
                    // ignore last attribute if it has no paired value
                    for (var i = 2, length = arguments.length - arguments.length % 2; i < length; i++) {
                        el.setAttribute(arguments[i++], arguments[i]);
                    }
                }

                if (parent != null && parent != undefined)
                    parent.appendChild(el);
            }
            return el;
        };
        
        setMode = function(modeNumber) {
            mode = modeNumber;
            clockDemoDiv.classList.toggle("widget-mode", (mode == 0));
            clockDemoDiv.classList.toggle("game-mode", (mode == 2));
            if (mode != 0)
                clock.stopClock();
            clock.hideSecondHand = (mode != 0);
        };

        generateItem = function() {
            var factor = (difficulty == 1 ? 2 : (difficulty == 2 ? 4 : (difficulty == 3 ? 12 : 60)));
            var hour = parseInt(Math.random() * 12) + 1;
            var minute = (parseInt((difficulty == 0 ? 0 : Math.round(parseInt(Math.random() * factor) * 60) / factor))) % 60;
            clock.setTimeManual(new Date((new Date()).toDateString() + " " + hour + ":" + minute + " AM"));
        };
        
        setItemNumber = function(count) {
            if (!isNaN(parseInt(count))) {
                item = parseInt(count);
                if (itemNumberBox != undefined)
                    itemNumberBox.innerHTML = item;
            }
        };
        
        setScore = function(count) {
            if (!isNaN(parseInt(count))) {
                score = parseInt(count);
                if (scoreBox != undefined)
                    scoreBox.innerHTML = score + " / " + maxItems;
            }
        };
        
        setMaxItems = function(count) {
            if (!isNaN(parseInt(count))) {
                maxItems = parseInt(count);
                if (scoreBox != undefined)
                    scoreBox.innerHTML = score + " / " + maxItems;
            }
        };

        // Mode Selection UI
        this.modeSelection = createElementEx("form", parent, "class", "mode-selection");
        createElementEx("input", this.modeSelection, "type", "radio", "class", "widget-mode", "id", "widget-mode", "name", "mode", "checked", "checked").addEventListener("click", function() {setMode(0);});
        createElementEx("label", this.modeSelection, "for", "widget-mode").innerHTML = " Clock Widget Mode";
        this.modeSelection.appendChild(document.createTextNode(" "));
        createElementEx("input", this.modeSelection, "type", "radio", "class", "demo-mode", "id", "demo-mode", "name", "mode").addEventListener("click", function() {setMode(1);});
        createElementEx("label", this.modeSelection, "for", "demo-mode").innerHTML = " Instruction Mode";
        this.modeSelection.appendChild(document.createTextNode(" "));
        createElementEx("input", this.modeSelection, "type", "radio", "class", "game-mode", "id", "game-mode", "name", "mode").addEventListener("click", function() {setMode(2);});
        createElementEx("label", this.modeSelection, "for", "game-mode").innerHTML = " Game Mode";

        // Clock Demo UI
        clockDemoDiv = createElementEx("div", parent, "class", "clock-demo widget-mode");
        clockWrapper = createElementEx("div", clockDemoDiv, "class", "clock-wrapper");

        // Clock Widget
        clockWrapper.appendChild(clock.obj);
        clock.interval = 100;

        // Clock Sizer
        clockSizer = createElementEx("form", clockWrapper, "class", "clock-sizer");
        createElementEx("label", clockSizer, "for", "clock-size").innerHTML = "Clock Sizer";
        createElementEx("br", clockSizer, );
        createElementEx("input", clockSizer, "type", "range", "id", "clock-size", "name", "clock-size", "min", 10, "max", 100, "value", 30).addEventListener("change", function() {clockWrapper.style.width = this.value + "%";});

        // Basic clock controls
        basicControls = createElementEx("form", clockDemoDiv, "class", "clock-basic-controls", "name", "clock-basic-controls");
        createElementEx("label", basicControls, "for", "interval").innerHTML = "Update interval (in milliseconds): ";
        createElementEx("input", basicControls, "type", "number", "min", 1, "value", 100, "name", "interval", "id", "interval", "style", "width: 4em;").addEventListener("change", function() {
            if (isNaN(parseInt(this.value)) || parseInt(this.value) <= 0 || this.value ==  "")
                this.value = 1;
            clock.interval = this.value;
        });
        createElementEx("br", basicControls, );
        createElementEx("input", basicControls, "type", "button", "id", "start-clock", "value", "Start Clock").addEventListener("click", function() {clock.startClock();});
        basicControls.appendChild(document.createTextNode(" "));
        createElementEx("input", basicControls, "type", "button", "id", "stop-clock", "value", "Stop Clock").addEventListener("click", function() {clock.stopClock();});
        basicControls.appendChild(document.createTextNode(" "));
        createElementEx("input", basicControls, "type", "button", "id", "set-clock-time", "value", "Set Time...").addEventListener("click", function() {
            var timeString = prompt("Please enter the new time setting:\r\n\r\n(Formats: h:mm, h:mm:ss, h:mm AM/PM, h:mm:ss AM/PM)", "12:00");
            if (timeString == null || timeString.trim() == "")
                return;

            try {
                var newDate = new Date((new Date()).toDateString() + " " + timeString);
                if (newDate == "Invalid Date")
                    throw newDate;

                clock.setTimeManual(newDate);
            }
            catch(err) {
                alert(err);
            }
        });
        createElementEx("br", basicControls, );
        createElementEx("input", basicControls, "type", "button", "id", "sync-clock-time", "value", "Sync with PC Time").addEventListener("click", function() {clock.syncClock();});
        basicControls.appendChild(document.createTextNode(" "));
        createElementEx("input", basicControls, "type", "button", "id", "reset-clock", "value", "Reset Clock").addEventListener("click", function() {clock.resetClock();});

        // Interactive/game controls
        gameControls = createElementEx("form", clockDemoDiv, "class", "clock-game-controls", "name", "clock-game-controls");
        createElementEx("p", gameControls, "class", "interactive-instruction").innerHTML = "<b>NOTE:</b> Use the time setter below to set the clock's time.";
        createElementEx("p", gameControls, "class", "game-instruction").innerHTML = "<b>DIRECTION:</b> Use the time setter below to match the time on the clock. Click on the <button type=\"button\">New Game</button> button to begin. Use the slider to modify the difficulty level. Good luck!";
        gameControl = createElementEx("button", gameControls, "type", "button", "id", "game-control", "name", "game-control", "style", "color: green;");
        gameControl.addEventListener("click", async function() {
            if (this.innerHTML == "<b>New Game</b>") {
                this.innerHTML = "<b>Quit Game</b>";
                this.style.color = "red";

                do {
                    setMaxItems(prompt("Please enter the number of items:", 10));
                } while(isNaN(maxItems) || maxItems < 1);

                inGame = true;
                setItemNumber(1);
                setScore(0);

                clock.setTimeManual(new Date((new Date()).toDateString()));

                submitButton.disabled = false;

                generateItem();
            }
            else {
                submitButton.disabled = true;
                inGame = false;
                await sleep(1000);

                alert("GAME OVER!\r\n\r\n" + (score == maxItems ? "Congratulations!\r\n\r\n" : "") + "Your score is " + score + " out of " + maxItems + ".");

                this.innerHTML = "<b>New Game</b>";
                this.style.color = "green";
            }
        });
        gameControl.innerHTML = "<b>New Game</b>";
        diffSetWrapper = createElementEx("span", gameControls, "class", "difficulty-setting-wrapper");
        createElementEx("label", diffSetWrapper, "for", "difficulty-setting").appendChild(document.createTextNode("Difficulty:"));
        diffSetWrapper.appendChild(document.createTextNode(" "));
        createElementEx("input", diffSetWrapper, "type", "range", "id", "difficulty-setting", "name", "difficulty-setting", "min", 0, "max", 4, "value", 2).addEventListener("change", function() {difficulty = this.value;});
        createElementEx("label", gameControls, "for", "time-value-response").appendChild(document.createTextNode("Time Setter"));
        timeSetters = createElementEx("span", gameControls, "class", "time-component");
        timeValues = createElementEx("span", timeSetters, "class", "time-value");
        (hourBox = createElementEx("input", timeValues, "type", "number", "id", "hour-value", "name", "hour-value", "min", 0, "max", 13, "value", 12)).addEventListener("change", function() {
            if (this.value == 0 || this.value.trim() == "")
                this.value = 12;
            else if (this.value > 12)
                this.value -= 12;

            if (mode != 2) {
                clock.date.setHours(this.value, clock.date.getMinutes(), 0);
                clock.setTimeManual(clock.date);
            }
        });
        createElementEx("b", timeValues, ).appendChild(document.createTextNode(":"));
        (minuteBox = createElementEx("input", timeValues, "type", "number", "id", "minute-value", "name", "minute-value", "min", -1, "max", 60, "value", "00")).addEventListener("change", function() {
            if (this.value.trim() == "")
                this.value = 0;

            if (0 <= this.value && this.value < 10)
                this.value = "0" + this.value;

            if (this.value == 60) {
                this.value = "00";
                if (hourBox.value == 12)
                    hourBox.value = 0;
                hourBox.value++;
            }
            else if (this.value == -1) {
                this.value = "59";
                if (hourBox.value == 1)
                    hourBox.value = 13;
                hourBox.value--;
            }

            if (mode != 2) {
                clock.date.setHours(hourBox.value, this.value, 0);
                clock.setTimeManual(clock.date);
            }
        });
        timeValueResponse = createElementEx("input", timeSetters, "type", "time", "id", "time-value-response", "name", "time-value-response", "value", "00:00");
        timeSetters.appendChild(document.createTextNode(" "));
        (submitButton = createElementEx("button", timeSetters, "type", "button", "id", "submit", "name", "submit", "disabled", "disabled")).addEventListener("click", function() {
            this.disabled = true;
            var date = new Date((new Date()).toDateString() + " " + timeValueResponse.value);
            date.setHours(date.getHours() % 12);
            if (clock.date.toString() == date.toString()) {
                setScore(score + 1);
            }

            if (item + 1 > maxItems)
                gameControl.click();
            else {
                setItemNumber(item + 1);
                generateItem();
                this.disabled = false;
            }
        });
        submitButton.appendChild(document.createTextNode("Submit"));
        (itemNumberBox = createElementEx("span", timeSetters, "class", "item-number")).innerHTML = "0";
        (scoreBox = createElementEx("span", timeSetters, "class", "score")).innerHTML = "0 / 0";
    }
}