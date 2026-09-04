//On Startup
let clicks = 100000;
let clickPower = 1;
let clicksPerSec = 0;
//Click Power Upgrade Variables
let upg1aCost = 25;
let upg1aBought = 0;
let upg2aCost = 250;
let upg2aBought = 0;
let upg3aCost = 10000;
let upg3aBought = 0;
//Clicks/s Upgrade Variables
let upg1bCost = 10;
let upg1bBought = 0;
let upg2bCost = 50;
let upg2bBought = 0;
let upg3bCost = 5000;
let upg3bBought = 0;

setDisplay();

//Basic Click & Displays
function onClick() {
    clicks += clickPower;
    setDisplay();
}

// Run a function every .1 seconds
const intervalId = setInterval(() => {
    clickPower = Math.pow((upg1aBought + 1) * (upg2aBought + 1), (upg3aBought / 10) + 1);
    clicksPerSec = Math.pow(upg1bBought * (upg2bBought + 1), (upg3bBought / 10) + 1);
    clicks += clicksPerSec / 10;
    setDisplay();
}, 100);


function setDisplay() {
    document.getElementById("mainLabel1").innerHTML = "Clicks: " + formatNumber(clicks);
    document.getElementById("mainLabel2").innerHTML = "Clicks/s: " + formatNumber(clicksPerSec);
    document.getElementById("clickLabel").innerHTML = "+" + formatNumber(clickPower) + " Clicks";
    //Click Power Displays
    document.getElementById("cost1aLabel").innerHTML = "Cost: " + String(upg1aCost);
    document.getElementById("effect1aLabel").innerHTML = "[BUY] +" + String(upg1aBought + 1) + " Click Power";
    document.getElementById("cost2aLabel").innerHTML = "Cost: " + String(upg2aCost);
    document.getElementById("effect2aLabel").innerHTML = "[BUY] x" + String(upg2aBought + 1) + " Click Power";
    document.getElementById("cost3aLabel").innerHTML = "Cost: " + String(upg3aCost);
    document.getElementById("effect3aLabel").innerHTML = "[BUY] ^" + String((upg3aBought / 10) + 1) + " Click Power";
    //Clicks/s Displays
    document.getElementById("cost1bLabel").innerHTML = "Cost: " + String(upg1bCost);
    document.getElementById("effect1bLabel").innerHTML = "[BUY] +" + String(upg1bBought) + " Clicks/s";
    document.getElementById("cost2bLabel").innerHTML = "Cost: " + String(upg2bCost);
    document.getElementById("effect2bLabel").innerHTML = "[BUY] x" + String(upg2bBought + 1) + " Clicks/s";
    document.getElementById("cost3bLabel").innerHTML = "Cost: " + String(upg3bCost);
    document.getElementById("effect3bLabel").innerHTML = "[BUY] ^" + String((upg3bBought / 10) + 1) + " Clicks/s";
}

function buyUpgrade(ID) {
    //Click Power
    if (ID == '1a') {
        if (clicks >= upg1aCost) {
            clicks -= upg1aCost;
            upg1aCost = Math.floor(upg1aCost * 1.2);
            upg1aBought++;
        }
    }

    if (ID == '2a') {
        if (clicks >= upg2aCost) {
            clicks -= upg2aCost;
            upg2aCost = Math.floor(upg2aCost * 1.25);
            upg2aBought++;
        }
    }

    if (ID == '3a') {
        if (clicks >= upg3aCost) {
            clicks -= upg3aCost;
            upg3aCost = Math.floor(upg3aCost * 5);
            upg3aBought++;
        }
    }

    //Clicks/s
    if (ID == '1b') {
        if (clicks >= upg1bCost) {
            clicks -= upg1bCost;
            upg1bCost = Math.floor(upg1bCost * 1.1);
            upg1bBought++;
        }
    }

    if (ID == '2b') {
        if (clicks >= upg2bCost) {
            clicks -= upg2bCost;
            upg2bCost = Math.floor(upg2bCost * 1.15);
            upg2bBought++;
        }
    }

    if (ID == '3b') {
        if (clicks >= upg3bCost) {
            clicks -= upg3bCost;
            upg3bCost = Math.floor(upg3bCost * 3);
            upg3bBought++;
        }
    }

    setDisplay();
}

function buyAll() {
    buyUpgrade('1a');
    buyUpgrade('2a');
    buyUpgrade('3a');
    buyUpgrade('1b');
    buyUpgrade('2b');
    buyUpgrade('3b');
}

function formatNumber(num) {
    let exponent = Math.floor(Math.log10(num));
    let mantissa = Math.round((num / 10 ** exponent) * 1000) / 1000 //Rounds the mantissa.. hopefully

    if (num < 1e6) {
        return String(Math.round(num));
    }
    else {
        return String(mantissa + "e+" + exponent)
    }
}