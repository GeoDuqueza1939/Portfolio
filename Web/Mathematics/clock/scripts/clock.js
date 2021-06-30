"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Clock {
    constructor()
    {
        // initialize object properties
        this.data = {
            center: new Point(50, 50),
            date: null,
            timeStarted: null,
            interval: 0,
            timer: null
        };
        this.isSynced = false;
        this.isRunning = false;
        this.hideSecondHand = false; // second hand should exist before using hideSecondHand property
        this.hand = {
            hour: undefined,
            minute: undefined,
            second: undefined,
        };
        var createElementEx, createSimpleSVG, createCircle; // inline functions

        // declare and define inline functions
        createElementEx = function(xmlns, elName, parent, nextNode)
        {   // args: xmlns, elName, parent, nextNode, argNS1, argName1, argVal1, argNS2, argName2, argVal2, ...
            var el;
            if (elName == "")
                throw("Element name cannot be empty.");
            else {
                el = (xmlns == "" ? document.createElement(elName) : document.createElementNS(xmlns, elName));

                if (arguments.length > 4) {
                    // ignore last attribute if it has no paired value
                    for (var i = 4, length = arguments.length - (arguments.length + 2) % 3; i < length; i++) {
                        if (arguments[i] != "")
                            el.setAttributeNS(arguments[i], arguments[++i], arguments[++i]);
                        else
                            el.setAttribute(arguments[++i], arguments[++i]);
                    }
                }

                if (parent != null && parent != undefined) {
                    if (nextNode == null || nextNode == undefined)
                        parent.appendChild(el);
                    else
                        parent.insertBefore(el, nextNode);
                }
            }
            return el;
        }

        createSimpleSVG = function(svgObjName, className, parent)
        {
            return createElementEx("http://www.w3.org/2000/svg", svgObjName, parent, null, "", "class", className);
        }

        createCircle = function(cx, cy, r, fill, stroke, strokeWidth, parent)
        {
            return createElementEx("http://www.w3.org/2000/svg", "circle", parent, null, "", "cx", cx, "", "cy", cy, "", "r", r, "", "style", "fill: " + fill + "; stroke: " + stroke + "; stroke-width: " + strokeWidth);
        }

        // create wrapper;
        this.obj = document.createElement("span");
        this.obj.className = "clock";

        //create SVG clock face
        this.clockFace = createSimpleSVG("svg", "clock-face", this.obj);
        this.clockFace.setAttribute("viewBox", "0 0 100 100");
        this.clockFace.setAttribute("zoomAndPan", "Magnify");
        this.clockFace.setAttribute("preserveAspectRatio", "xMidYMid");
        this.maxWidth = "100%";

        createCircle(this.center.x, this.center.y, 49.5, "none", "black", 1, this.clockFace);
        createCircle(this.center.x, this.center.y, 46, "none", "blue", 1, this.clockFace);

        var minuteMarkers = createSimpleSVG("g", "minute-markers", this.clockFace);

        var txtHourMarkers = createSimpleSVG("text", "text-hour-markers", createSimpleSVG("g", "hour-markers", this.clockFace));

        for (var n = 1; n <= 60; n++) {
            var theta = -6 * (n - 15) * Math.PI / 180;
            createCircle(this.center.x + 33 * Math.cos(theta), this.center.y - 33 * Math.sin(theta), 0.5, "green", "none", 1, minuteMarkers);

            if (n % 5 == 0) {
                var numMarker = createSimpleSVG("tspan", "hour-marker", txtHourMarkers);
                numMarker.innerHTML = n / 5;

                numMarker.setAttribute("x", this.center.x + 39 * Math.cos(theta) - 2 - (n / 5 > 9 ? 2 : 0));
                numMarker.setAttribute("y", this.center.y - 39 * Math.sin(theta) + 2.5);

                createCircle(this.center.x + 33 * Math.cos(theta), this.center.y - 33 * Math.sin(theta), 1, "red", "none", 1, txtHourMarkers.parentNode);
            }
        }

        // create clock hands
        var clockHands = createSimpleSVG("g", "clock-hands", this.clockFace);
        (this.hand.hour = createSimpleSVG("polygon", "hour-hand", clockHands)).setAttribute("fill", "blue");
        (this.hand.minute = createSimpleSVG("polygon", "minute-hand", clockHands)).setAttribute("fill", "green");
        (this.hand.second = createSimpleSVG("polygon", "second-hand", clockHands)).setAttribute("fill", "red");
        createCircle(this.center.x, this.center.y, 2, "yellow", "black", 1, clockHands);

        // initialize date and time
        this.resetClock();

        this.setTime(this.date);
    }
    
    get center()
    {
        return this.data["center"];
    }

    get date()
    {
        return this.data["date"];
    }

    set date(d)
    {
        this.data["date"] = d;
    }
    
    get timeStarted()
    {
        return this.data["timeStarted"];
    }

    set timeStarted(t)
    {
        this.data["timeStarted"] = t;
    }
    
    get interval()
    {
        return this.data["interval"];
    }
    
    set interval(i)
    {
        if (!isNaN(parseInt(i)))
            this.data["interval"] = i;
        
        if (this.isRunning != undefined && this.isRunning) {
            var isSynced = this.isSynced;
            
            this.stopClock();
            
            if (isSynced)
                this.syncClock();
            
            this.startClock();
        }
    }
    
    get timer()
    {
        return this.data["timer"];
    }

    set timer(tm)
    {
        this.data["timer"] = tm;
    }

    get maxWidth()
    {
        return this.clockFace.style.maxWidth;
    }

    set maxWidth(w)
    {
        this.clockFace.style.maxWidth = w;
    }

    get hideSecondHand()
    {
        return (this.hand.second.getAttribute("visibility") == "hidden");
    }

    set hideSecondHand(x)
    {
        if (this.hand != undefined && this.hand.second != undefined)
            this.hand.second.setAttribute("visibility", (x ? "hidden" : "visible"));
    }

    startClock()
    {
        if (!this.isRunning) {
            // if clock hasn't been started before
            if (this.timeStarted == null)
                this.timeStarted = this.date;

            // if clock time is not synchronized with PC time
            if (!this.isSynced) {
                this.date = new Date();
            }

            // set interval if none is set
            if (this.interval <= 0) {
                var newInterval;
                do {
                    newInterval = parseInt(prompt("Please set clock update interval (in milliseconds):"));
                } while (isNaN(newInterval) || newInterval == 0);

                if (newInterval != null)
                    this.interval = newInterval;
            }

            var thisClock = this; // for passing the "this" context into a lambda expression

            this.timer = setInterval(function() {
                if (thisClock.isSynced) {
                    thisClock.syncClock();
                    thisClock.setTime(thisClock.date);
                }
                else {
                    thisClock.setTime(new Date(thisClock.timeStarted.valueOf() + (new Date()).valueOf() - thisClock.date.valueOf()));
                }
            }, this.interval);

            this.isRunning = true;
        }
    }

    stopClock()
    {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.timer = null;
            this.isSynced = false;

            if (this.timeStarted == null)
                this.timeStarted = new Date((new Date()).valueOf() - this.date.valueOf());
            else
                this.timeStarted = new Date(this.timeStarted.valueOf() + (new Date()).valueOf() - this.date.valueOf());

            this.date = this.timeStarted;
            this.isRunning = false;
        }
    }

    syncClock()
    {
        this.setTime(this.timeStarted = this.date = new Date());
        this.isSynced = true;
    }

    resetClock()
    {
        this.setTimeManual(new Date((new Date()).toDateString()));
    }

    setTime(date)
    {
        var theta;
        var points = [];
        var hr = (date == 0 ? 0 : date.getHours()), min = (date == 0 ? 0 : date.getMinutes()), sec = (date == 0 ? 0 : date.getSeconds() + date.getMilliseconds() / 1000);

        // Second hand update
        points = [new Point(0,10), new Point(-1,-10), new Point(0,-40), new Point(1,-10)];
        theta = -6 * (sec) * Math.PI / 180;
        this.adjustTimeHand(this.hand.second, theta, points);

        // Minute hand update
        points = [new Point(0,5), new Point(-1.5,-7), new Point(0,-38), new Point(1.5,-7)];
        theta = -6 * (min) * Math.PI / 180 + theta / 60;
        this.adjustTimeHand(this.hand.minute, theta, points);

        // Hour hand update
        points = [new Point(0,3), new Point(-2,-5), new Point(0,-30), new Point(2,-5)];
        theta = -30 * (hr) * Math.PI / 180 + theta / 12;
        this.adjustTimeHand(this.hand.hour, theta, points);
    }

    setTimeManual(date)
    {
        var isRunning = this.isRunning;

        if (isRunning)
            this.stopClock();

        this.setTime(this.timeStarted = this.date = date);

        if (isRunning)
            this.startClock();

        this.isSynced = false;
    }

    adjustTimeHand(timeHand, theta, pointSet)
    {
        var pointRotate = new Point(Math.cos(theta), Math.sin(theta));
        var pointPath = "";

        pointSet.forEach(function(point, index, points) {
            pointPath += (index == 0 ? "" : " ") +
                (point.x * pointRotate.x + point.y * pointRotate.y + this.center.x) + "," +
                (-point.x * pointRotate.y + point.y * pointRotate.x + this.center.y);
        }, this);

        timeHand.setAttribute("points", pointPath);
    }

    toString()
    {
        return "Clock Widget\r\n\r\nDate: " + this.date.toDateString() + "\r\nTime: " + this.date.toTimeString() + "\r\n\r\nCode: " + this.obj.outerHTML;
    }
}
