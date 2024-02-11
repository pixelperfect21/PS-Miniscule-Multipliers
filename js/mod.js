let modInfo = {
	name: "PS: Miniscule Multipliers",
	id: "psmm",
	author: "pixelperfect12",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "Pixel's Incremental Server",
	discordLink: "https://discord.gg/sTudY5p5cV",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "The Only Content Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.mul(player.p.points.plus(1).mul(player.s.points.plus(1).mul(10).log(5).plus(1).log(5).plus(1)).log10().plus(1).log10().plus(1))
	gain = gain.mul(buyableEffect('p', 11))
	if (hasUpgrade('p', 11)) {gain = gain.mul(2)}
	if (hasUpgrade('p', 13)) {gain = gain.mul(upgradeEffect('p', 13))}
	if (hasUpgrade('m', 11)) {gain = gain.mul(upgradeEffect('m', 11))}
	gain = gain.mul(buyableEffect('b', 21))
	gain = gain.mul(buyableEffect('t', 31))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Reach 1e12 points to beat the game!"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal(1e12))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}