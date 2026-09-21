//Rolls (DON'T TOUCH)
let lastRoll = "";
let lastRollInt; //For comparing later
let bestRoll = "";
let bestRollInt; //For comparing later

//Luck -- BEING TESTED
let luckMulti = 100000;

//Coins -- WIP
let coins = 0;

//Rarities (or what can be rolled)
//The rarest ones should be on top, the more common ones are last in the list.
let rarities = ["The One", "Chromatic", "Eternal", "Unreal", "Unity",
    "Eternity", "Infinity", "Transcendent", "Celestial", "Cosmic", "Ethereal", "Superior", "Godly", "Divine", "Exotic",
    "Mythic", "Legendary", "Epic", "Rare", "Uncommon", "Common", "Basic", "Trash", "Garbage", "Nothing"];

//This part is purely optional. I only added it for display and it can be deleted with no issue.
let rarityColors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF",
    "#A6682B", "#503D5C", "#BD7EAB", "#D9C868", "#32216E", "#20405C", "#890304", "#FF0000", "#BAFFFF", "#FF8000",
    "#00FFFF", "#FFFF00", "#8000FF", "#0000FF", "#00FF00", "#FFFFFF", "#AAAAAA", "#808080", "#555555", "#404040"];

//This will probably take up a LOT of space. But i'm sticking to "10 per line" so...
let gradients = ["linear-gradient(90deg, white, black, white)", "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)", "linear-gradient(90deg, red, orange, yellow, orange, red)", "linear-gradient(90deg, #00FF00, #004400, #00FF00)", "linear-gradient(90deg, #d8ca7d, #63a7c7, #d8ca7d)",
    "linear-gradient(90deg, #A6682B, #A6482B, #A6682B)", "linear-gradient(90deg, #813f76, #eb4ac2, #813f76)", "linear-gradient(90deg, #BD7EAB, #FFFFFF, #BD7EAB)", "linear-gradient(90deg, #D9C868, #A59746, #D9C868)", "linear-gradient(90deg, #32216E, #604CAC, #32216E)", "linear-gradient(90deg, #20405C, #386B97, #20405C)", "linear-gradient(90deg, #890304, #5A0000, #890304)", "none", "none", "none",
    "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"];

//Odds (in percentages)
//LOWEST PERCENTAGE SHOULD GO AT THE TOP
//The most common item should *should* be listed, BUT it's only used for the roll displays.
//Default behavior is to just calculate the remaining percentages not used by the other rarities.
let odds = [0.000001, 0.0000125, 0.00003, 0.00005, 0.0001,
    0.0005, 0.001, 0.006, 0.01, 0.02, 0.03, 0.05, 0.08, 0.1, 0.5,
    0.8, 1, 2, 3, 5, 10, 12, 15, 20, 30];

//Roll Cooldown
let cooldownTime = 1;
let currentCooldownTime; //The variable that changes as time counts down

//Settings Options
let autoRoll = true;
let percentOdds = true;

//Console debug if needed (shouldn't always be true)
let debugLogs = true;

//Upgrade Variables
let upg1Cost = 100;
let upg1Bought = 0;
let upg2Cost = 1e4;
let upg2Bought = 0;
let upg3Cost = 1e5;
let upg3Bought = 0;

//Runs when the page loads, like a Start() function
window.onload = () => {
    document.getElementById("lastRollText").innerHTML = "Last Roll: NONE";
    document.getElementById("bestRollText").innerHTML = "Best Roll: NONE";
    currentCooldownTime = 0;
    CheckOdds();
    setDisplay();
};

function CheckOdds() {
    //Calculate the total % of all the odds
    let totalOdds = 0;
    for (let i = 0; i < odds.length - 1; i++) {
        totalOdds += odds[i];
    }

    //Display warnings incase of faulty setup
    console.log("Probability for " + String(rarities[rarities.length - 1]) + ": " + String(100 - totalOdds) + "%");
    if ((100 - totalOdds) < odds[odds.length - 1]) {
        console.warn("The odds currently set make the 2nd rarity more common than the 1st rarity. Ignore if this was intentional.");
    }
    if (totalOdds >= 100) {
        console.error("Total odds exceed 100%. This is almost guaranteed to break the script.");
    }
}

function Roll() {
    //Resets cooldown
    currentCooldownTime = cooldownTime;

    //Setup for determining what was rolled
    let poolSize = Math.round((100 / odds[0]));
    let cumulativeOdds = 0;

    //Rolling the number
    let numberRolled = (Math.random() * (poolSize * (1 / luckMulti)));
    if (debugLogs) {
        console.log(`Number rolled: ${numberRolled} / ${poolSize * (1 / luckMulti)}`);
    }

    //Matching rolled number with item odds
    let itemRolled = false;
    for (let i = 0; i < odds.length; i++) {
        let chance = (odds[i] / 100) * poolSize; //With the random range being predefined, adding a luck multiplier will be difficult.
        if (numberRolled >= cumulativeOdds && numberRolled <= (cumulativeOdds + chance)) {
            lastRoll = rarities[i];
            lastRollInt = i;
            itemRolled = true;
            if (debugLogs) {
                console.log("Item rolled: " + rarities[i]);
            }
        }
        cumulativeOdds += chance; //The +1 SHOULD avoid any overlap.
    }

    //Selects the most common item if no others were rolled
    if (!itemRolled) {
        lastRollInt = rarities.length - 1;
        lastRoll = rarities[lastRollInt];
        if (debugLogs) {
            console.log("Item rolled: " + rarities[rarities.length - 1]);
        }
    }

    //Change best roll (if possible)
    let prevBestRoll = bestRoll;
    if (lastRollInt < bestRollInt || bestRoll == "" /* No best roll exists */) {
        bestRollInt = lastRollInt;
        bestRoll = lastRoll;
    }

    //Modify luck
    luckMulti *= 1.2;
    document.getElementById("luckText").innerHTML = "Luck: x" + formatNumber(luckMulti, 1);

    //Give coins
    let coinsToGet = Math.floor(Math.pow(2.2, (odds.length - lastRollInt)));
    coins += coinsToGet;
    document.getElementById("coinText").innerHTML = "Coins: " + formatNumber(coins, 0) + ` (+${formatNumber(coinsToGet, 0)})`;


    //Modify texts & colors (if custom colors exist)
    setTexts(prevBestRoll);
}

function setRarityGlow(rarityColor, roll) {
    if (rarityColors[roll] == null) {
        return; //Skips adding glow if no color exists
    }
    if (roll < 5) {
        return `text-shadow: 0 0 30px ${rarityColor}`;
    }
    else if (roll < 10) {
        return `text-shadow: 0 0 20px ${rarityColor}`;
    }
    else if (roll < 15) {
        return `text-shadow: 0 0 10px ${rarityColor}`;
    }
    else {
        return "";
    }
}

function setTexts(prevBestRoll) {
    //Get rarity color (if applicable)
    let rarityColor = (rarityColors[lastRollInt] != null) ? rarityColors[lastRollInt] : "#FFFFFF";
    //Set rarity glow (if applicable)
    let rarityGlow = setRarityGlow(rarityColor, lastRollInt);
    //Set the text for what rarity was rolled, without styling
    let rarityRolled;
    if (percentOdds) rarityRolled = `(${odds[lastRollInt]}%)`;
    else rarityRolled = `(1 in ${formatNumber(Math.round((1 / odds[lastRollInt]) * 100), 1)})`;;
    //Join all parts together
    if (gradients[lastRollInt] == "none") {
        document.getElementById("lastRollText").innerHTML = `<span style="color: ${rarityColor}; ${rarityGlow}">${lastRoll}</span>`;
        document.getElementById("lastRollOdds").innerHTML = `<span style="color: ${rarityColor}; ${rarityGlow}">${rarityRolled}</span>`;
        document.getElementById("lastRollGlow").innerHTML = "";
        document.getElementById("lastRollGlow2").innerHTML = "";
    }
    else {
        let glowStyle = `background-image: ${gradients[lastRollInt]}; background-clip: text; color: transparent; background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient-flow 4s linear infinite;`
        document.getElementById("lastRollText").innerHTML = `<span style="color: ${rarityColor}; ${glowStyle}">${lastRoll}</span>`;
        document.getElementById("lastRollGlow").innerHTML = `<span style="${glowStyle}">${lastRoll}</span>`;
        document.getElementById("lastRollOdds").innerHTML = `<span style="color: ${rarityColor}; ${glowStyle}">${rarityRolled}</span>`;
        document.getElementById("lastRollGlow2").innerHTML = `<span style="${glowStyle}">${rarityRolled}</span>`;
    }


    //Get rarity color (if applicable)
    rarityColor = (rarityColors[bestRollInt] != null) ? rarityColors[bestRollInt] : "#FFFFFF";
    //Set rarity glow (if applicable)
    rarityGlow = setRarityGlow(rarityColor, bestRollInt);
    //Set the text for what rarity was rolled, without styling
    if (percentOdds) rarityRolled = bestRoll + ` (${odds[bestRollInt]}%)`;
    else rarityRolled = bestRoll + ` (1 in ${formatNumber(Math.round((1 / odds[bestRollInt]) * 100), 1)})`;
    //Join all parts together
    if (gradients[bestRollInt] == "none") {
        document.getElementById("bestRollText").innerHTML = "<span style='text-shadow: 0px 0px 10px white'>Best Roll: </span>" + `<span style="color: ${rarityColor}; ${rarityGlow}">${rarityRolled}</span>`;
        document.getElementById("bestRollGlow").innerHTML = "";
    }
    else {
        //Detect if the best roll has changed. If it hasn't, don't update the text
        //Setting the text resets the gradient's position, which looks weird if the gradient doesn't change
        if (prevBestRoll == bestRoll) {
            return;
        }
        //Ok now the gradient is set
        let glowStyle = `background-image: ${gradients[bestRollInt]}; background-clip: text; color: transparent; background-size: 200% auto;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient-flow 4s linear infinite;`
        document.getElementById("bestRollText").innerHTML = "Best Roll: " + `<span style="color: ${rarityColor}; ${glowStyle}">${rarityRolled}</span>`;
        document.getElementById("bestRollGlow").innerHTML = "Best Roll: " + `<span style="${glowStyle}">${rarityRolled}</span>`;
    }

}

// Runs function every .1 seconds
const intervalId = setInterval(() => {
    //Run cooldown timer
    if (currentCooldownTime > 0) {
        currentCooldownTime -= 0.1;
    }

    //Run autoroll if possible
    if (currentCooldownTime <= 0.01 && autoRoll) {
        Roll();
    }

    //Set Button Text
    if (currentCooldownTime > 0.01) {
        document.getElementById("rollButton").innerHTML = `ROLL (${Math.round(currentCooldownTime * 10) / 10}s)`;
    }
    else {
        document.getElementById("rollButton").innerHTML = "ROLL";
    }
}, 100);

//This is set to run in the HTML file.
function onClick() {
    if (currentCooldownTime <= 0.01) //Accounts for any floating point precision errors that may occur
    {
        Roll();
    }
    else {
        console.warn("Roll on cooldown!");
    }
}

//This is to toggle the auto-roll
function toggleAuto() {
    autoRoll = !autoRoll;
    document.getElementById("autoButton").innerHTML = (autoRoll) ? "Auto Roll: ON" : "Auto Roll: OFF";
}

//This will toggle the odds display
function toggleOdds() {
    percentOdds = !percentOdds;
    document.getElementById("oddsButton").innerHTML = (percentOdds) ? "Odds: Percentage" : "Odds: Fraction"
    setTexts();
}

//
//Below is all shop related stuff
//

function setDisplay() {
    //Click Power Displays
    document.getElementById("cost1Label").innerHTML = "Cost: " + formatNumber(upg1Cost, 1);
    document.getElementById("effect1Label").innerHTML = "[BUY] " + String(upg1Bought + 1) + "x Luck Multi";
    document.getElementById("cost2Label").innerHTML = "Cost: " + formatNumber(upg2Cost, 1);
    document.getElementById("effect2Label").innerHTML = "[BUY] " + String(upg2Bought + 1) + "x Coin Boost";
    document.getElementById("cost3Label").innerHTML = "Cost: " + formatNumber(upg3Cost, 1);
    document.getElementById("effect3Label").innerHTML = "[BUY] " + String((upg3Bought / 10) + 1) + "x Roll Speed";
}

function buyUpgrade(ID) {
    if (ID == '1') {
        if (coins >= upg1Cost) {
            coins -= upg1Cost;
            upg1Cost = Math.floor(upg1Cost * 1.2);
            upg1Bought++;
        }
    }

    if (ID == '2') {
        if (coins >= upg2Cost) {
            coins -= upg2Cost;
            upg2Cost = Math.floor(upg2Cost * 1.25);
            upg2Bought++;
        }
    }

    if (ID == '3') {
        if (coins >= upg3Cost) {
            coins -= upg3Cost;
            upg3Cost = Math.floor(upg3Cost * 5);
            upg3Bought++;
        }
    }

    setDisplay();
}

function buyAll() {
    buyUpgrade('1');
    buyUpgrade('2');
    buyUpgrade('3');
}

// Formats numbers so you dont just see 8734595046 etc etc
function formatNumber(num, precision) {
    let exponent = Math.floor(Math.log10(num));
    let mantissa = Math.round((num / 10 ** exponent) * 1000) / 1000; //Rounds the mantissa.. hopefully
    let rounding = 10 ** precision;
    let roundedNum;

    if (num < 1e9) {
        roundedNum = Math.round(num * rounding) / rounding;
        if (num >= 1e6) return `${Math.floor(roundedNum / 1e6)},${Math.floor((roundedNum / 1000) % 1000).toString().padStart(3, '0')},${Math.floor(roundedNum % 1000).toString().padStart(3, '0')}`;
        else if (num >= 1e3) return `${Math.floor(roundedNum / 1000)},${(Math.floor(roundedNum % 1000)).toString().padStart(3, '0')}`;
        else return String(roundedNum);
    }
    else {
        return String(mantissa + "e" + exponent)
    }
}