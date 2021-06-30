"use strict";
function doNothing()
{
    
}

function selectMode(modeObj, gameObj, doForMode, doBefore, doAfter)
{
    doBefore();
    
    doForMode(modeObj, gameObj);
    
    doAfter();
}
