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
let rarities = ["Unity",
                "Eternity", "Infinity", "Transcendent", "Celestial", "Cosmic", "Ethereal", "Superior", "Godly", "Divine", "Exotic", 
                "Mythic", "Legendary", "Epic", "Rare", "Uncommon", "Common", "Basic", "Trash", "Garbage", "Nothing"];

//This part is purely optional. I only added it for display and it can be deleted with no issue.
let rarityColors = ["#FFFFFF",
                    "#A6682B", "#503D5C", "#BD7EAB", "#D9C868", "#32216E", "#20405C", "#890304", "#FF0000", "#BAFFFF", "#FF8000",
                    "#00FFFF", "#FFFF00", "#8000FF", "#0000FF", "#00FF00", "#FFFFFF", "#AAAAAA", "#808080", "#555555", "#404040"];

let gradients = ["linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)",
                "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", 
                "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"];

//Odds (in percentages)
//LOWEST PERCENTAGE SHOULD GO AT THE TOP
//The most common item should *should* be listed, BUT it's only used for the roll displays.
//Default behavior is to just calculate the remaining percentages not used by the other rarities.
let odds = [0.0001,
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

//Runs when the page loads, like a Start() function
window.onload = () => {
    document.getElementById("lastRollText").innerHTML = "Last Roll: NONE";
    document.getElementById("bestRollText").innerHTML = "Best Roll: NONE";
    currentCooldownTime = 0;
    CheckOdds();
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
    if (lastRollInt < bestRollInt || bestRoll == "" /* No best roll exists */) {
        bestRollInt = lastRollInt;
        bestRoll = lastRoll;
    }

    //Modify luck
    luckMulti *= 1.2;
    document.getElementById("luckText").innerHTML = "Luck: x" + String(Math.round(luckMulti * 10) / 10);

    //Give coins
    let coinsToGet = Math.floor(Math.pow(2.2, (odds.length - lastRollInt)));
    coins += coinsToGet;
    document.getElementById("coinText").innerHTML = "Coins: " + String(Math.round(coins * 1000) / 1000) + ` (+${coinsToGet})`;


    //Modify texts & colors (if custom colors exist)
    setTexts();
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

function setTexts() {
    //Get rarity color (if applicable)
    let rarityColor = (rarityColors[lastRollInt] != null) ? rarityColors[lastRollInt] : "#FFFFFF";
    //Set rarity glow (if applicable)
    let rarityGlow = setRarityGlow(rarityColor, lastRollInt);
    //Set the text for what rarity was rolled, without styling
    let rarityRolled;
    if (percentOdds) rarityRolled = `(${odds[lastRollInt]}%)`;
    else rarityRolled = `(1 in ${Math.round((1 / odds[lastRollInt]) * 100)})`;;
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
    else rarityRolled = bestRoll + ` (1 in ${Math.round((1 / odds[bestRollInt]) * 100)})`;
    //Join all parts together
    if (gradients[bestRollInt] == "none") {
        document.getElementById("bestRollText").innerHTML = "Best Roll: " + `<span style="color: ${rarityColor}; ${rarityGlow}">${rarityRolled}</span>`;
        document.getElementById("bestRollGlow").innerHTML = "";
    }
    else {
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
