function displayPrimes()
{
    var rep = document.getElementById("rep").value;
    var cols = document.getElementById("cols").value;
    var max = document.getElementById("max").value;
    var opt = document.getElementById("opt").value;
    var output = ""
    document.getElementById("primecount").innerHTML = 0;
    
    for (var n = 1; n <= max; n++) {
        var prime = isPrime(n);
        if (prime) {
            var count = document.getElementById("primecount").innerHTML;
            count++;
            document.getElementById("primecount").innerHTML = count;
        }
        output += (n % cols == 1 ? "<tr>" : "");
        if (opt == "all")
            output += "<td onClick='checkPrimality(this);'>" + n + "</td>";
        else
            output += "<td class=" + (prime ? "prime" : (n == 1 ? "special" : "composite")) + ">" + (prime ? (opt == "primes" ? n : rep) : (opt == "composites" && n != 1 ? n : rep)) + "</td>";
        
        output += (n % cols == 0 ? "</tr>\r\n" : "");
    }

    document.getElementById("display").innerHTML = 
    "<table id='prime-sieve'>\r\n<caption>The Sieve of Eratosthenes</caption>\r\n<tbody>" +
    output +
    "</tbody>\r\n</table>" + document.getElementById("gamestatus").outerHTML;
}

function initDisplay()
{
    document.getElementById("opt").value = "all";
    document.getElementById("rep").value = "\u2717";
    document.getElementById("cols").value = 10;
    document.getElementById("max").value = 100;
    displayPrimes();
}

function checkPrimality(hObj)
{
    if (document.getElementById("body").className == "gamemode") {   
        var n = hObj.innerHTML;
        
        if (hObj.className != "prime") {
            hObj.className = (isPrime(n) ? "prime" : (n == 1 ? "special" : "composite"));

            if (hObj.className != "prime") {
                setTimeout(() => {alert("Game Over!\r\nPlease try again."); initDisplay();}, 1000);
            }
            else {
                document.getElementById("primecount").innerHTML--;
                
                if (document.getElementById("primecount").innerHTML == 0) {
                    setTimeout(() => {alert("You won!\r\nCongratulations!"); initDisplay();}, 1000);
                }
            }
        }
    }
}

function checkMode(hObj)
{
    if (hObj.id == "demomode") {

    }
    else if (hObj.id == "gamemode") {
        document.getElementById("opt").value = "all";
        displayPrimes();
    }
    document.getElementById('body').className = hObj.id;
}

async function animateSieve()
{
    var rep = document.getElementById("rep").value;
    rep = (rep == "" || rep == " " ? "\u00a0" : rep);
    document.getElementById("opt").value = "all";
    displayPrimes();

    // prepare
    var td = document.getElementById("prime-sieve").getElementsByTagName("TD");
    for (var i = 0; i < td.length; i++) {
        td[i].id = "num" + td[i].innerHTML;
        td[i].className = "unmarked";
    }
    
    // mark 1 as special
    document.getElementById("num1").innerHTML = rep;
    document.getElementById("num1").className = "special"
    
    // mark multiples of the next unmarked number
    for (var i = 0; i < td.length; i++) {
        var num = 0, n = 0;
        num = td[i].innerHTML * 1;
        
        for (n = num + num; n <= td.length; n = n + num) {
            var hObj = document.getElementById("num" + n);
            hObj.innerHTML = rep;
            
            if (hObj.className == "unmarked")
                hObj.className = "cross-out1";
            else if (hObj.className == "cross-out1")
                hObj.className = "cross-out2";
            else if (hObj.className == "cross-out2")
                hObj.className = "cross-out3";
            else if (hObj.className == "cross-out3")
                hObj.className = "cross-out4";
            else if (hObj.className == "cross-out4")
                hObj.className == "cross-out5";
            else if (hObj.className == "cross-out5")
                hObj.className = "cross-out6";
            else if (hObj.className == "cross-out6")
                hObj.className = "cross-out7";
            else if (hObj.className == "cross-out7")
                hObj.className = "cross-out8";
                
            await sleep(50);
        }
    }
    
    // mark all primes
    for (var i = 0; i < td.length; i++) {
        if (td[i].className == "special" || td[i].className.substring(0, 9) == "cross-out") {
            td[i].className = "cross-out";
        }
        else {
            td[i].className = "primes";
        }

        await sleep(10);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
