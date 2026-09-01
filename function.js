//On Startup
let clicks = 0;
//Upgrade Variables
let upg1cost = 10;
let upg1bought = 0;
let upg2cost = 100;
let upg2bought = 0;
let upg3cost = 10000;
let upg3bought = 0;

setDisplay();

//Basic Click & Displays
function onClick() {
    clicks += Math.pow((upg1bought + 1) * (upg2bought + 1), (upg3bought / 10) + 1);
    setDisplay();
}

// Run a function every 20.1seconds
const intervalId = setInterval(() => {
    clicks += Math.pow((upg1bought + 1) * (upg2bought + 1), (upg3bought / 10) + 1);
    setDisplay();
}, 100);


function setDisplay() {
    document.getElementById("mainLabel").innerHTML = "Clicks: " + String(Math.round(clicks));
    document.getElementById("cost1Label").innerHTML = "Cost: " + String(upg1cost);
    document.getElementById("effect1Label").innerHTML = "[BUY] +" + String(upg1bought + 1) + " Clicks";
    document.getElementById("cost2Label").innerHTML = "Cost: " + String(upg2cost);
    document.getElementById("effect2Label").innerHTML = "[BUY] x" + String(upg2bought + 1) + " Clicks";
    document.getElementById("cost3Label").innerHTML = "Cost: " + String(upg3cost);
    document.getElementById("effect3Label").innerHTML = "[BUY] ^" + String((upg3bought / 10) + 1) + " Clicks";
}

function buyUpgrade(ID) {
    if (ID == 1) {
        if (clicks >= upg1cost) {
            clicks -= upg1cost;
            upg1cost = Math.floor(upg1cost * 1.2);
            upg1bought++;
        }
    }

    if (ID == 2) {
        if (clicks >= upg2cost) {
            clicks -= upg2cost;
            upg2cost = Math.floor(upg2cost * 1.25);
            upg2bought++;
        }
    }

    if (ID == 3) {
        if (clicks >= upg3cost) {
            clicks -= upg3cost;
            upg3cost = Math.floor(upg3cost * 5);
            upg3bought++;
        }
    }

    setDisplay();
}