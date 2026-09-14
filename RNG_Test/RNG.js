//Rolls (DON'T TOUCH)
let lastRoll = "";
let lastRollInt; //For comparing later
let bestRoll = "";
let bestRollInt; //For comparing later

//Rarities (or what can be rolled)
//The rarest ones should be on top, the more common ones are last in the list.
let rarities = ["Godly", "Divine", "Mythic", "Legendary", "Epic", "Rare", "Uncommon", "Common", "Trash", "Garbage"];

//Odds (in percentages)
//LOWEST PERCENTAGE SHOULD GO AT THE TOP
//The most common item should *can* be listed, but it's only used for the roll displays.
//Default behavior is to just calculate the remaining percentages not used by the other rarities.
let odds = [0.01, 0.1, 0.5, 1, 3, 5, 10, 20, 25, 35];

//Roll Cooldown
let cooldownTime = 1;
let currentCooldownTime; //The variable that changes as time counts down

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
    for (let i = 0; i < odds.length; i++) {
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
    let numberRolled = Math.random() * poolSize;
    if (debugLogs) {
        console.log("Number rolled: " + String(numberRolled));
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
        cumulativeOdds += chance + 1; //The +1 SHOULD avoid any overlap.
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

    //Modify texts
    document.getElementById("lastRollText").innerHTML = "Last Roll: " + lastRoll + ` (${odds[lastRollInt]}%)`;
    document.getElementById("bestRollText").innerHTML = "Best Roll: " + bestRoll + ` (${odds[bestRollInt]}%)`;
}

// Runs function every .1 seconds
const intervalId = setInterval(() => {
    if (currentCooldownTime > 0) {
        currentCooldownTime -= 0.1;
    }

    //Set Button Text
    if (currentCooldownTime > 0.01){
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