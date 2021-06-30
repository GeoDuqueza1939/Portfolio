function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createSimpleElement(xmlns, elName, className, parent)
{
    var el;
    if (xmlns != "")
        el = document.createElementNS(xmlns, elName);
    else
        el = document.createElement(elName);

    if (className != "")
        el.setAttribute("class", className);

    if (arguments.length > 4)
        parent.insertBefore(el, arguments[4]);
    else
        parent.appendChild(el);

    return el;
}

function createElementEx(xmlns, elName, parent, nextNode)
{   // args: xmlns, elName, parent, nextNode, argNS1, argName1, argVal1, argNS2, argName2, argVal2, ...
    var el = null;
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

function addText(text, container, nextSibling = null)
{
    var textNode = null;
    if (arguments.length < 2 || arguments.length > 3) {
        throw("Incorrect number of arguments.");
    }
    else if (container == null || container == undefined) {
        throw("Container element cannot be null or undefined.");
    }
    else {
        textNode = document.createTextNode(text);
        if (nextSibling == null || nextSibling == undefined)
            container.appendChild(textNode);
        else
            container.insertBefore(textNode, nextSibling);
    }

    return textNode;
}
