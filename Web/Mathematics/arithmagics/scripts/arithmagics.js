"use strict";
class ArithMagics
{
    constructor(parent)
    {
        var Components, temp, temp1, temp2, tempFunc, isPrime, generateItems, clearItems, msgBox;

        Components = function () {
            this.ui = null;
            this.parent = parent;
            this.splashUI = null;
            this.mainUI = null;
            this.quizUI = null;
            this.msgUI = null;
            this.username = null;
            this.score = null;
            this.item = []; // array
        };

        isPrime = function(i) {
            var prime = true;
            var n = 3;

            prime = !(i < 2 || (i != 2 && i % 2 == 0));

            while (prime && n * n <= i) {
                if (i % n == 0) prime = false;
                n += 2;
            }

            return prime;
        };

        msgBox = function(msg) {
            alert(msg);
        };

        this.components = new Components();
        this.components.ui = createElementEx("", "div", this.components.parent, null, "", "class", "arithmagics");
        this.components.splashUI = createElementEx("", "div", this.components.ui, null, "", "class", "arithmagics-splash hidden");
        this.components.mainUI = createElementEx("", "div", this.components.ui, null, "", "class", "arithmagics-main hidden");
        this.components.quizUI = createElementEx("", "div", this.components.ui, null, "", "class", "arithmagics-quiz hidden");

        // splashUI (CAN BE MODIFIED ACCORDING TO PREFERENCE)
        addText("ArithMagics", createElementEx("", "div", this.components.splashUI));

        // mainUI
        this.components.mainUI.operation = 0;
        this.components.mainUI.operationDisplay = [];
        this.components.mainUI.digit = [1, 1];
        this.components.mainUI.digitDisplay = [];
        this.components.mainUI.digitBox = [];

        temp = createElementEx("", "form", this.components.mainUI, null);
        temp1 = createElementEx("", "fieldset", temp, null, "", "class", "arithmagics-main-operations");
        addText("Operation:", createElementEx("", "legend", temp1));

        ["Addition", "Subtraction", "Multiplication", "Division"].forEach((value, index, array) => {
            temp2 = createElementEx("", "span", temp1, null, "", "class", "input-label");
            var operation = createElementEx("", "input", temp2, null, "", "type", "radio", "", "name", "arithmagics-main-operation", "", "id", "arithmagics-op-" + value.toLowerCase(), "", "value", index);
            if (index == 0) {
                operation.checked = true;
            }
            ["change", "click"].forEach((event) => {
                operation.addEventListener(event, () => {
                    if (operation.checked) {
                        this.components.mainUI.operation = parseInt(operation.value);
                        this.components.mainUI.operationDisplay[0].innerHTML = value;
                        this.components.mainUI.operationDisplay[1].innerHTML = (index > 1 ? "by" : "to");
                    }
                });
            });
            addText(" ", temp2);
            addText(value, createElementEx("", "label", temp2, null, "", "for", "arithmagics-op-" + value.toLowerCase()));
            if (index < 3)
                createElementEx("", "br", temp2);
        });

        temp1 = createElementEx("", "fieldset", temp, null, "", "class", "arithmagics-main-digitsize");
        addText("Number of Digits:", createElementEx("", "legend", temp1));
        addText("Addition", this.components.mainUI.operationDisplay[this.components.mainUI.operationDisplay.push(createElementEx("", "span", temp1)) - 1]);
        addText(" of ", temp1);
        
        [createElementEx("", "input", null, null, "", "type", "number", "", "min", 1, "", "max", 5, "", "value", 1), createElementEx("", "input", null, null, "", "type", "number", "", "min", 1, "", "max", 5, "", "value", 1)].forEach((value, index, array) => {
            temp1.appendChild(value);

            ["blur", "change"].forEach(function (value2, index2, array2) {
                value.addEventListener(value2, () => {
                    if (index2 == 0) {
                        if (value.value < 1) {
                            value.value = 1;
                        }

                        if (parseInt(value.value) > parseInt(value.max)) {
                            value.value = value.max;
                        }
                    }

                    this.components.mainUI.digit[index] = parseInt(value.value);
                    this.components.mainUI.digitDisplay[index].innerHTML = "digit" + (parseInt(value.value) > 1 ? "s" : "");
                });
            }, this);

            addText(" ", temp1);
            addText("digit", this.components.mainUI.digitDisplay[this.components.mainUI.digitDisplay.push(createElementEx("", "span", temp1)) - 1]);
            
            if (index == 0) {
                addText(" ", temp1);
                addText("to", this.components.mainUI.operationDisplay[this.components.mainUI.operationDisplay.push(createElementEx("", "span", temp1)) - 1]);
                addText(" ", temp1);
            }
        });

        clearItems = () => {
            // reset list
            this.components.quizUI.itemList.item.splice(0, this.components.quizUI.itemList.item.length);
            this.components.quizUI.itemList.innerHTML = "";
        };

        generateItems = () => {
            var op, n1, n2, result, item, ntemp, isDiv, adjDir, hasSwitchedDir;
            console.log("Create Quiz clicked");
            
            clearItems();

            // Generate operands
            for (var i = 0; i < 10; i++) {
                n1 = Math.floor(Math.random() * (Math.pow(10, this.components.mainUI.digit[0]) - Math.pow(10, this.components.mainUI.digit[0] - 1))) + Math.pow(10, this.components.mainUI.digit[0] - 1);
                n2 = Math.floor(Math.random() * (Math.pow(10, this.components.mainUI.digit[1]) - Math.pow(10, this.components.mainUI.digit[1] - 1))) + Math.pow(10, this.components.mainUI.digit[1] - 1);
                switch (this.components.mainUI.operation) {
                    case 0: // Addition
                        op = "+";
                        result = n1 + n2;
                        break;
                    case 1: // Subtraction
                        if (n2 > n1) { // switch operands to avoid negative differences
                            n1 += n2;
                            n2 = n1 - n2;
                            n1 -= n2;
                        }
                        op = "-";
                        result = n1 - n2;
                        break;
                    case 2: // Multiplication
                        op = "\u00d7";
                        result = n1 * n2;
                        break;
                    case 3: // Division
                        op = "\u00f7";
                        isDiv = false;
                        hasSwitchedDir = false;
                        do {
                            if (n2 > n1) { // switch operands to avoid fractions
                                n1 += n2;
                                n2 = n1 - n2;
                                n1 -= n2;
                            }
                            if (isDiv = (n1 % n2 == 0)) // break if divisible;
                                break;

                            adjDir = (Math.floor(Math.random() * 2) == 1);
                            if (isPrime(n1)) {
                                if (!isDiv && adjDir && this.components.mainUI.digit[0] == this.components.mainUI.digit[1]) {
                                    n2 = n1;
                                    isDiv = true;
                                }
                                else if (!isDiv && !adjDir && this.components.mainUI.digit[1] == 1) {
                                    n2 = 1;
                                    isDiv = true;
                                }
                            }
                            else { // n1 is not prime
                                isDiv = (n1 % n2 == 0); // check if divisible;
                                ntemp = n2;
                                while (!isDiv) {
                                    if (!hasSwitchedDir && ((!adjDir && n2 <= Math.pow(10, this.components.mainUI.digit[1] - 1)) || (adjDir && n2 >= Math.pow(10, this.components.mainUI.digit[1]) - 1))) {
                                        n2 = ntemp;
                                        adjDir = !adjDir;
                                        hasSwitchedDir = true;
                                    }
                                    else {
                                        break;
                                    }
                                    n2 += (adjDir ? 1 : -1);
                                    isDiv = (n1 % n2 == 0); // check if divisible;
                                }
                            }

                            if (!isDiv) {
                                n1 = Math.floor(Math.random() * (Math.pow(10, this.components.mainUI.digit[0]) - Math.pow(10, this.components.mainUI.digit[0] - 1))) + Math.pow(10, this.components.mainUI.digit[0] - 1);
                                n2 = Math.floor(Math.random() * (Math.pow(10, this.components.mainUI.digit[1]) - Math.pow(10, this.components.mainUI.digit[1] - 1))) + Math.pow(10, this.components.mainUI.digit[1] - 1);
                            }
                        } while (!isDiv);

                        result = n1 / n2;
                        break;
                }

                item = createElementEx("", "li", this.components.quizUI.itemList, null, "", "class", "arithmagics-quiz-item");
                addText(n1 + " " + op + " " + n2 + " = ", createElementEx("", "span", item, null, "", "class", "mathexp"));
                this.components.quizUI.itemList.item.push([
                    createElementEx("", "input", item, null, "", "class", "arithmagics-quiz-item-blank", "", "type", "number", "", "min", 0), 
                    parseInt(n1), 
                    op, 
                    parseInt(n2), 
                    parseInt(result),
                    createElementEx("", "span", item, null, "", "class", "check-mark")
                ]);
            }

            this.components.mainUI.classList.toggle("hidden", true);
            this.components.quizUI.classList.toggle("hidden", false);
        };

        createElementEx("", "input", createElementEx("", "div", temp, null, "", "class", "arithmagics-main-buttons"), null, "", "type", "button", "", "value", "Create Quiz").addEventListener("click", generateItems);

        // quizUI
        addText("Evaluate the following expressions:", createElementEx("", "p", this.components.quizUI, null, "", "class", "arithmagics-direction"));
        this.components.quizUI.itemList = createElementEx("", "ol", this.components.quizUI, null, "", "class", "arithmagics-quiz-item-list");
        this.components.quizUI.itemList.item = [];
        [createElementEx("", "div", this.components.quizUI, null, "", "class", "arithmagics-quiz-buttons")].forEach((quizButtons) => {
            createElementEx("", "input", quizButtons, null, "", "type", "button", "", "value", "Generate Items").addEventListener("click", generateItems);
            addText(" ", quizButtons);
            createElementEx("", "input", quizButtons, null, "", "type", "button", "", "value", "Check").addEventListener("click", () => {
                var score = 0;
                
                this.components.quizUI.itemList.item.forEach(item => {
                    if (item[0].value == item[4]) {
                        item[5].classList.toggle("correct", true);
                        item[5].innerHTML = "\u2714";
                        score++;
                    }
                    else {
                        item[5].classList.toggle("correct", false);
                        item[5].innerHTML = "\u2718"
                    }
                });
                
                msgBox("Your score is " + score + "/10");
            });
            addText(" ", quizButtons);
            createElementEx("", "input", quizButtons, null, "", "type", "button", "", "value", "Back to Home").addEventListener("click", () => {
                clearItems();
                this.components.mainUI.classList.toggle("hidden", false);
                this.components.quizUI.classList.toggle("hidden", true);
            });
        });

        // Initialize
        this.components.splashUI.classList.toggle("hidden", false);
        setTimeout(() => {
            this.components.mainUI.classList.toggle("hidden", false);
            this.components.splashUI.classList.toggle("hidden", true);
        }, 2000);
    }

}
