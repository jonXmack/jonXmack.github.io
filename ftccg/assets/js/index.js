/*
Copyright 2018 Alexandre Trofimov

This file is part of Yaebalka external ballistics software.

Yaebalka is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Yaebalka is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Yaebalka.  If not, see <http://www.gnu.org/licenses/>.
*/

// expects includes:
// * lib.js/units.js
// * engine/ebalengine.js

// Mass is 1lb in kg
// Cal is 1in in metres
// Length is 3.28in in metres and isn't used
// cdData is mach followed by drag coefficient

var GAGtA = {
	name: "GA - from Gateway to Airguns",
// https://www.gatewaytoairguns.org/GTA/index.php?topic=159961.msg155778237#msg155778237
	mass: 0.4535924,
	cal: 0.0254,
	len: 0.083312,
	source: "std",
	cdData: [
		[.0, 0.246],
		[.1, 0.232],
		[.2, 0.217],
		[.3, 0.204],
		[.4, 0.193],
		[.5, 0.186],
		[.6, 0.186],
		[.7, 0.199],
		[.8, 0.237],
		[.9, 0.324],
		[1.0, 0.481],
	],
}

var GACustom = {
	name: "GA - from ChairGun data, CustomProfile.pro",
	mass: 0.4535924,
	cal: 0.0254,
	len: 0.083312,
	source: "std",
	cdData: [
		[0.000, 0.250],
		[0.100, 0.235],
		[0.200, 0.221],
		[0.300, 0.207],
		[0.400, 0.196],
		[0.500, 0.189],
		[0.600, 0.189],
		[0.700, 0.202],
		[0.800, 0.241],
		[0.900, 0.329],
		[1.000, 0.488],
	],

}

var G1 = {
	name: "G1 standard",
	mass: 0.4535924,
	cal: 0.0254,
	len: 0.083312,
	source: "std",
	cdData: [
		[0.0, 0.2629],
		[0.05, 0.2558],
		[0.1, 0.2487],
		[0.15, 0.2413],
		[0.2, 0.2344],
		[0.25, 0.2278],
		[0.3, 0.2214],
		[0.35, 0.2155],
		[0.4, 0.2104],
		[0.45, 0.2061],
		[0.5, 0.2032],
		[0.55, 0.202],
		[0.6, 0.2034],
		[0.7, 0.2165],
		[0.725, 0.223],
		[0.75, 0.2313],
		[0.775, 0.2417],
		[0.8, 0.2546],
		[0.825, 0.2706],
		[0.85, 0.2901],
		[0.875, 0.3136],
		[0.9, 0.3415],
		[0.925, 0.3734],
		[0.95, 0.4084],
		[0.975, 0.4448],
		[1.0, 0.4805],
	],
};

var GAChairGun = {
	name: "GA - from ChairGun Android App",
	mass: 0.4535924,
	cal: 0.0254,
	len: 0.083312,
	source: "std",
	cdData: [
		[.0, 0.2442],
		[.1, 0.2301],
		[.2, 0.216],
		[.3, 0.2036],
		[.4, 0.1928],
		[.5, 0.188],
		[.6, 0.1937],
		[.7, 0.2123],
		[.8, 0.2601],
		[.9, 0.3467],
		[1.0, 0.4901],
		[1.1, 0.593],
		[1.2, 0.6411],
		[1.3, 0.6591],
		[1.4, 0.662],
		[1.5, 0.6572],
		[1.6, 0.6472],
		[1.7, 0.6349],
		[1.8, 0.621],
		[1.9, 0.6071],
		[2.0, 0.5932],
		[2.1, 0.5802],
		[2.2, 0.5688],
		[2.3, 0.5579],
		[2.4, 0.5481],
		[2.5, 0.5398],
		[2.6, 0.5328],
		[2.7, 0.5262],
		[2.8, 0.5211],
		[2.9, 0.5169],
		[3.0, 0.5132],
		[3.1, 0.5108],
		[3.2, 0.5082],
		[3.3, 0.5069],
		[3.4, 0.5052],
		[3.5, 0.504],
		[3.6, 0.503],
		[3.7, 0.5021],
		[3.8, 0.5018],
		[3.9, 0.501],
		[4.0, 0.5008],
		[4.1, 0.5128],
	],
};

var G1ChairGun = {
	name: "G1 - from ChairGun Android App",
	mass: 0.4535924,
	cal: 0.0254,
	len: 0.083312,
	source: "std",
	cdData: [
		[.0, 0.2629],
		[.1, 0.2487],
		[.2, 0.2344],
		[.3, 0.2214],
		[.4, 0.2104],
		[.5, 0.2032],
		[.6, 0.2034],
		[.7, 0.2165],
		[.8, 0.2546],
		[.9, 0.3415],
		[1.0, 0.4805],
		[1.1, 0.5883],
		[1.2, 0.6393],
		[1.3, 0.6589],
		[1.4, 0.6625],
		[1.5, 0.6573],
		[1.6, 0.6474],
		[1.7, 0.6347],
		[1.8, 0.621],
		[1.9, 0.6072],
		[2.0, 0.5934],
		[2.1, 0.5804],
		[2.2, 0.5685],
		[2.3, 0.5577],
		[2.4, 0.5481],
		[2.5, 0.5397],
		[2.6, 0.5325],
		[2.7, 0.5264],
		[2.8, 0.5211],
		[2.9, 0.5168],
		[3.0, 0.5133],
		[3.1, 0.5105],
		[3.2, 0.5084],
		[3.3, 0.5067],
		[3.4, 0.5054],
		[3.5, 0.504],
		[3.6, 0.503],
		[3.7, 0.5022],
		[3.8, 0.5016],
		[3.9, 0.501],
		[4.0, 0.5005],
		[4.1, 0.4788],
	],
};

// Set a couple of empty variables to populate
var clickUnit = 'moa';
var clickValue;
// Get ClickV and ClickH elements
var clickYEl = document.getElementById("gearClickV");
var clickXEl = document.getElementById("gearClickH");
// Set some values for the clicks
var moaClickValue = '0.125'
var mradClickValue = '0.05'

// Function to set the X and Y click values to defaults
function setTurretClickValue(value) {
	clickYEl.setAttribute('step', value);
	clickYEl.value = value;
	clickXEl.setAttribute('step', value);
	clickXEl.value = value;
}

function setTurretLabel(unit) {
	var clickLabel = document.getElementById('s-clickvalue')
	var clickCaption = document.getElementById('s-clickvaluecaption');
	if (unit == "moa") {
		clickLabel.innerHTML = `Click value (${unit.toUpperCase()}):`;
		clickCaption.innerHTML = `Value in ${unit.toUpperCase()} of 1 turret click. 1/8 is 0.125, 1/4 is 0.25`;
	} else {
		clickLabel.innerHTML = `Click value (${clickUnit.toUpperCase()}):`;
		clickCaption.innerHTML = `Value in ${clickUnit.toUpperCase()} of 1 turret click.`;
	}
}

window.addEventListener('load', function(){
	// Check to see which turret type it is
	if (localStorage.getItem('turretMoa')) {
		if (localStorage.getItem('turretMoa') === "true") {
			clickUnit = 'moa';
			setTurretClickValue(moaClickValue);
		} else {
			clickUnit = 'mrad';
			setTurretClickValue(mradClickValue);
		}
		setTurretLabel(clickUnit);
	}
});

// Check if MOA or MRAD and update the text
document.querySelectorAll("#turretMoa, #turretMrad").forEach(el => {
	el.addEventListener('click', function(e){
		if (e.target.id === 'turretMoa') {
			clickUnit = "moa"
			clickValue = moaClickValue
		} else {
			clickUnit = "mrad"
			clickValue = mradClickValue
		}
		setTurretLabel(clickUnit);
		setTurretClickValue(clickValue);
	});
});

function fillResultsTable(traj, zeroElevation, realv0, minDistance) {
	// Get blank checkbox
	var blankTable = document.getElementById("blankTemplate").checked;
	// Get click values in radians
	var clickYValue = clickYEl.value;
	var clickXValue = clickXEl.value;
	// Convert radians to clickUnit
	var clickY = UC.from(clickYValue, clickUnit);
	var clickX = UC.from(clickXValue, clickUnit);

	// Convert radians to fractional value
	var clickInteger = 1 / clickYValue;
	// From what I can tell 0.05 mrad scopes generally have 100 clicks split into 10 divisions of 10
	// This sets the clickInteger to 10 if that is the case else it assume 5 divisions of 20 which isn't common
	// otherwise it just leaves it alone
	clickInteger = clickInteger === 20 ? 10 : clickInteger
	// Get wind speed
	var windSpeed = document.getElementById("tgtWindSpeed").value;
	// Get wind direction
	var windDir = document.getElementById("tgtWindDir").value;
	// If wind speed is set and wind direction isn't straight ahead then display windage columns
	var displayWindage = windSpeed > 0 && windDir != 0 ? true : false;

	// Get rifle name
	var rifleName = document.getElementById("rifleName").value;
	// Get scope name
	var scopeName = document.getElementById("scopeName").value;
	// Get zero distance
	var zeroDistance = document.getElementById("shotZero").value;
	// Get BC value
	var bcValue = document.getElementById("gearbc").value;
	// Get drag profile
	var dragProfile = document.getElementById("tgtDragProfile").value;
	// Get velocity
	var Velocity = document.getElementById("gearv0").value;

	// Build the chart header from the rifle and scope
	var chartHeaderVal = rifleName + " / " + scopeName;
	// Build the chart footer from the zero distance, BC and drag profile
	// unless blank checkbox is checked in which case just display zero distance
	var chartFooterZeroBcDrag = blankTable ? "Zero: " + zeroDistance + " yards" : "Zero: " + zeroDistance + " yards / BC: " + bcValue + " / Drag Profile: " + dragProfile;
	var chartFooterZeroDrag = blankTable ? "Zero: " + zeroDistance + " yards" : "Zero: " + zeroDistance + " yards / Drag Profile: " + dragProfile;
	var chartFooterZeroBcVelocity = blankTable ? "Zero: " + zeroDistance + " yards" : "Zero: " + zeroDistance + " yards / BC: " + bcValue + " / Velocity: " + Velocity + ' fps';
	var chartFooterZeroVelocity = blankTable ? "Zero: " + zeroDistance + " yards" : "Zero: " + zeroDistance + " yards / Velocity: " + Velocity + ' fps';
	
	// Get output areas
	var outputBlock = document.getElementById("outputBlock");
	var outputChart1 = document.getElementById("outputChart1");
	var outputChart2 = document.getElementById("outputChart2");
	// Erase whatever was in the output areas
	while (outputBlock.hasChildNodes()) {
		outputBlock.removeChild(outputBlock.lastChild);
	}

	while (outputChart1.hasChildNodes()) {
		outputChart1.removeChild(outputChart1.lastChild);
	}

	while (outputChart2.hasChildNodes()) {
		outputChart2.removeChild(outputChart2.lastChild);
	}

	// Setup table variables
	var simpleBlockTable;
	var simpleblockRow;
	var blockCell;
	// Setup chart variables
	var chart1Table;
	var chart1Row;
	var chart1Cell;

	var chart2Table;
	var chart2Row;
	var chart2Cell;

	// Create table, rows, and cells
	simpleBlockTable = document.createElement("table");
	simpleblockRow = document.createElement("tr");

	chart1Table = document.createElement("table");
	chart1Row = document.createElement("tr");

	chart1HeaderRow = document.createElement("tr");
	chart1HeaderCell = document.createElement("td");
	chart1HeaderCell.setAttribute("colspan", "6");
	// chart1HeaderCell.setAttribute("class", "outputTableTd");
	chart1HeaderCell.innerHTML = chartHeaderVal;
	chart1HeaderRow.appendChild(chart1HeaderCell);
	chart1Table.appendChild(chart1HeaderRow);

	chart1FooterRow = document.createElement("tr");
	chart1FooterCell = document.createElement("td");
	chart1FooterCell.setAttribute("colspan", "6");
	// chart1FooterCell.setAttribute("class", "outputTableTd");
	chart1FooterCell.innerHTML = chartFooterZeroBcVelocity;
	chart1FooterRow.appendChild(chart1FooterCell);

	chart2Table = document.createElement("table");
	chart2Row = document.createElement("tr");

	chart2HeaderRow = document.createElement("tr");
	chart2HeaderCell = document.createElement("td");
	chart2HeaderCell.setAttribute("colspan", "4");
	// chart2HeaderCell.setAttribute("class", "outputTableTd");
	chart2HeaderCell.innerHTML = chartHeaderVal;
	chart2HeaderRow.appendChild(chart2HeaderCell);
	chart2Table.appendChild(chart2HeaderRow);

	chart2FooterRow = document.createElement("tr");
	chart2FooterCell = document.createElement("td");
	chart2FooterCell.setAttribute("colspan", "4");
	chart2FooterCell.setAttribute("class", "outputTableTd");
	chart2FooterCell.innerHTML = chartFooterZeroBcVelocity;
	chart2FooterRow.appendChild(chart2FooterCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Range, yard";
	simpleblockRow.appendChild(blockCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Time, s";
	simpleblockRow.appendChild(blockCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Velocity, fps";
	simpleblockRow.appendChild(blockCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Drop, mm";
	simpleblockRow.appendChild(blockCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Clicks";
	simpleblockRow.appendChild(blockCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Turret";
	simpleblockRow.appendChild(blockCell);

	if (displayWindage) {
		blockCell = document.createElement("th");
		blockCell.innerHTML = "Windage, mm";
		simpleblockRow.appendChild(blockCell);
	
		blockCell = document.createElement("th");
		blockCell.innerHTML = "Clicks";
		simpleblockRow.appendChild(blockCell);
	
		blockCell = document.createElement("th");
		blockCell.innerHTML = "Turret";
		simpleblockRow.appendChild(blockCell);
	}

	simpleBlockTable.appendChild(simpleblockRow);

	// Set headings on chart columns
	var chartRangeHeading = "Yards";
	var chartClicksHeading = "Clicks";

	chart1Cell = document.createElement("th");
	chart1Cell.innerHTML = chartRangeHeading;
	chart1Row.appendChild(chart1Cell);
	chart1Cell = document.createElement("th");
	chart1Cell.innerHTML = chartClicksHeading;
	chart1Row.appendChild(chart1Cell);
	chart1Cell = document.createElement("th");
	chart1Cell.innerHTML = chartRangeHeading;
	chart1Row.appendChild(chart1Cell);
	chart1Cell = document.createElement("th");
	chart1Cell.innerHTML = chartClicksHeading;
	chart1Row.appendChild(chart1Cell);
	chart1Cell = document.createElement("th");
	chart1Cell.innerHTML = chartRangeHeading;
	chart1Row.appendChild(chart1Cell);
	chart1Cell = document.createElement("th");
	chart1Cell.innerHTML = chartClicksHeading;
	chart1Row.appendChild(chart1Cell);

	chart1Table.appendChild(chart1Row);

	chart2Cell = document.createElement("th");
	chart2Cell.innerHTML = chartRangeHeading;
	chart2Row.appendChild(chart2Cell);
	chart2Cell = document.createElement("th");
	chart2Cell.innerHTML = chartClicksHeading;
	chart2Row.appendChild(chart2Cell);
	chart2Cell = document.createElement("th");
	chart2Cell.innerHTML = chartRangeHeading;
	chart2Row.appendChild(chart2Cell);
	chart2Cell = document.createElement("th");
	chart2Cell.innerHTML = chartClicksHeading;
	chart2Row.appendChild(chart2Cell);

	chart2Table.appendChild(chart2Row);

	// minDistance is given to us in feet
	var minDistanceYards = UC.to(minDistance, "yard");
	// Get clicks per revolution value
	var clicksPerRev = parseInt(document.querySelector("#gearClicksRev").value);
	// Set maximum clicks to 1 click under a full revolution
	var maxClicks = clicksPerRev - 1;
	// Get separator text
	var separator = document.querySelector("#separator").value;
	// Get reminder text
	var reminder = document.querySelector("#reminder").value;
	// Check if Turret Divisions or Total Clicks is set
	var chartTurret = document.querySelector("#chartTurret").checked;
	var chartClicks = document.querySelector("#chartClicks").checked;
	// Get min and max ranges
	var minRange = parseInt(document.getElementById("tgtRangeMin").value);
	var maxRange = parseInt(document.getElementById("tgtRangeMax").value);
	var rangeStep = parseInt(document.getElementById("tgtRangeStep").value);

	// Used to build the charts
	var dataArr = [];

	// Useful to have for troubleshooting/inspecting
	console.log(traj);

	// Work out where in the traj data we need to start
	var trajStep = minDistanceYards / rangeStep;

	for (let i = 0; i < traj.length; i++) {
		// Allows us to change the range unit across a few different places
		var rangeUnit = "yard"
		// Array of ranges/clicks used to build charts
		var rangeArr = [];

		// Range is originally given to us in feet
		var RangeFeet = traj[i].range;
		// Range converted to rangeUnit
		var Range = UC.to(RangeFeet, rangeUnit);
		// Time in seconds
		var Time = UC.toStr(traj[i].time, "s");
		// Velocity in fps
		var Velocity = UC.toStr(traj[i].velocity, "fps");
		// Mach
		var Mach = traj[i].mach.toFixed(3);
		// Drop in feet
		var DropFeet = traj[i].drop;
		// Drop converted to rangeUnit - used to calculate mrad/moa drop
		var DropRangeUnit = UC.to(DropFeet, rangeUnit);
		// Windage in rangeUnit
		var Windage = UC.to(traj[i].windage, rangeUnit);
		// Drop/Windage in mrad
		var dropMrad = Math.round(Range) ? UC.to(DropRangeUnit / Range, "mrad").toFixed(2) : "---";
		var windageMrad = Math.round(Range) ? UC.to(Windage / Range, "mrad").toFixed(2) : "---";
		// Drop/Windage in moa
		var dropMoa = Math.round(Range) ? UC.to(DropRangeUnit / Range, "moa").toFixed(2) : "---";
		var windageMoa = Math.round(Range) ? UC.to(Windage / Range, "moa").toFixed(2) : "---";
		// Drop in mm
		var dropMm = UC.to(DropFeet, "mm").toFixed(2);
		// Difference in drop between current distance and next distance
		var dropDifference = traj[i+1] ? UC.to((traj[i].drop - traj[i+1].drop), "mm").toFixed(2) : "---";
		// Windage in mm
		var windageMm = UC.to(DropFeet, "mm").toFixed(2);
		// Elevation clicks
		var clicksY = Math.round(Range) ? (-DropRangeUnit / (Range * clickY)).toFixed(0) : "---";
		// Logic for displaying elevation clicks. If negative clicks add a '-' before the first number and switch some of the numbers.
		var clicksYDisplay = clicksY >= 0 ? Math.floor(clicksY / clickInteger).toString() + separator + Math.floor(clicksY % clickInteger).toString() : "-" + Math.floor((clicksPerRev - Math.abs(clicksY)) / clickInteger).toString() + separator + Math.floor((clicksPerRev - Math.abs(clicksY)) % clickInteger).toString();
		// Windage clicks
		var clicksX = Math.round(Range) ? (Windage / (Range * clickX)).toFixed(0) : "---";
		// Logic for displaying windage clicks. If negative clicks add a '-' before the first number and switch some of the numbers.
		var clicksXDisplay = clicksY >= 0 ? Math.floor(clicksX / clickInteger).toString() + separator + Math.floor(clicksX % clickInteger).toString() : "-" + Math.floor((clicksPerRev - Math.abs(clicksX)) / clickInteger).toString() + separator + Math.floor((clicksPerRev - Math.abs(clicksX)) % clickInteger).toString();

		// Elevation clicks. If clicks on turret are greater than one rotation display the reminder instead
		var turretY = clicksY > maxClicks ? Math.floor(maxClicks / clickInteger) + separator + Math.floor(maxClicks % clickInteger) + " " + reminder : clicksYDisplay;
		// Windage clicks. If clicks on turret are greater than one rotation display the reminder instead
		var turretX = clicksX > maxClicks ? Math.floor(maxClicks / clickInteger) + separator + Math.floor(maxClicks % clickInteger) + " " + reminder : clicksXDisplay;

		// Builds row. If horizontal movement is calculated it'll display extra columns, else it'll just display vertical clicks.
		simpleblockRow = displayWindage ? makeTableRow("", Range.toFixed(0), Time, Velocity, dropMm, clicksY, turretY, windageMm, clicksX, turretX) : makeTableRow("", Range.toFixed(0), Time, Velocity, dropMm, clicksY, turretY);

		// Only add data if it's over the minimum distance
		if (Range >= minDistanceYards) {
			// Add each row to the table
			simpleBlockTable.appendChild(simpleblockRow);
			// Push the range to the range array
			rangeArr.push(Range);
			// Push either the turret divisions or the clicks to the range array unless the blank checkbox is checked
			blankTable ? rangeArr.push('') : chartTurret ? rangeArr.push(turretY) : rangeArr.push(clicksY);
			// Push the range array to the data array used for building charts
			dataArr.push(rangeArr);
		}
	}

	// Setting up arrays for chart
	var chart1RangeDone = [];
	var chart1Arr = [];
	// Setting up columns for chart
	// We have to go negative if we need blank cells at the top of the column
	// We always minus our starting range
	var chart1Col1Start = 0 - 2;
	var chart1Col2Start = 24 - minRange;
	var chart1Col3Start = 40 - minRange;
	if (rangeStep == 3) {
		chart1Col1Start = 0 - 6;
		chart1Col2Start = 22 - minRange;
		chart1Col3Start = 40 - minRange;
	} else if (rangeStep == 5) {
		chart1Col1Start = 0 - minRange;
		chart1Col2Start = 20 - minRange;
		chart1Col3Start = 40 - minRange;
	}

	// Setting up arrays for chart
	var chart2RangeDone = [];
	var chart2Arr = [];
	// Setting up columns for chart
	// We have to go negative if we need blank cells at the top of the column
	// We always minus our starting range
	var chart2Col1Start = 0;
	var chart2Col2Start = 33 - minRange;
	if (rangeStep == 3) {
		chart2Col1Start = 0;
		chart2Col2Start = 34 - minRange;
	} else if (rangeStep == 5) {
		chart2Col1Start = 0;
		chart2Col2Start = 35 - minRange;
	}

	dataArr.forEach((e, i) => {
		// Getting information from the data passed
		var range = e[0];
		var clicks = e[1];
		// Empty arrays for building chart rows
		var chart1Row = [];
		var chart2Row = [];

		// Build each column based on data
		var chart1Col1range = dataArr[chart1Col1Start] ? dataArr[chart1Col1Start][0] : "";
		var chart1Col1clicks = dataArr[chart1Col1Start] ? dataArr[chart1Col1Start][1] : "";
		var chart1Col2range = dataArr[chart1Col2Start] ? dataArr[chart1Col2Start][0] : "";
		var chart1Col2clicks = dataArr[chart1Col2Start] ? dataArr[chart1Col2Start][1] : "";
		var chart1Col3range = dataArr[chart1Col3Start] ? dataArr[chart1Col3Start][0] : "";
		var chart1Col3clicks = dataArr[chart1Col3Start] ? dataArr[chart1Col3Start][1] : "";

		var chart2Col1range = dataArr[chart2Col1Start] ? dataArr[chart2Col1Start][0] : "";
		var chart2Col1clicks = dataArr[chart2Col1Start] ? dataArr[chart2Col1Start][1] : "";
		var chart2Col2range = dataArr[chart2Col2Start] ? dataArr[chart2Col2Start][0] : "";
		var chart2Col2clicks = dataArr[chart2Col2Start] ? dataArr[chart2Col2Start][1] : "";

		// Don't continue if the array includes the maximum range
		if (!chart1RangeDone.includes(maxRange)) {
			// Push all the information to the row/cells
			chart1Row.push(chart1Col1range);
			chart1Row.push(chart1Col1clicks);
			chart1Row.push(chart1Col2range);
			chart1Row.push(chart1Col2clicks);
			chart1Row.push(chart1Col3range);
			chart1Row.push(chart1Col3clicks);

			// Increment the start for each cell
			chart1Col1Start = chart1Col1Start + rangeStep;
			chart1Col2Start = chart1Col2Start + rangeStep;
			chart1Col3Start = chart1Col3Start + rangeStep;
			// Push each row to the array
			chart1Arr.push(chart1Row);
			// Push each range so we don't query it again
			chart1RangeDone.push(chart1Col1range);
			chart1RangeDone.push(chart1Col2range);
			chart1RangeDone.push(chart1Col3range);
		}

		// Don't continue if the array includes the maximum range
		if (!chart2RangeDone.includes(maxRange)) {
			// Push all the information to the row/cells
			chart2Row.push(chart2Col1range);
			chart2Row.push(chart2Col1clicks);
			chart2Row.push(chart2Col2range);
			chart2Row.push(chart2Col2clicks);

			// Increment the start for each cell
			chart2Col1Start = chart2Col1Start + rangeStep;
			chart2Col2Start = chart2Col2Start + rangeStep;
			// Push each row to the array
			chart2Arr.push(chart2Row);
			// Push all the information to the row/cells
			chart2RangeDone.push(chart2Col1range);
			chart2RangeDone.push(chart2Col2range);
		}
	});

	// Build the rows and append them to the table
	chart1Arr.forEach((e) => {
		chart1Row = makeTableRow("", e[0], e[1], e[2], e[3], e[4], e[5]);
		chart1Table.appendChild(chart1Row);
	});
	// Append the footer row
	chart1Table.appendChild(chart1FooterRow);
	// Display the table
	outputChart1.appendChild(chart1Table);
	outputChart1.classList.remove(`outputTable--1`)
	outputChart1.classList.remove(`outputTable--3`)
	outputChart1.classList.remove(`outputTable--5`)
	outputChart1.classList.add(`outputTable--${rangeStep}`)

	// Build the rows and append them to the table
	chart2Arr.forEach((e) => {
		chart2Row = makeTableRow("", e[0], e[1], e[2], e[3]);
		chart2Table.appendChild(chart2Row);
	});
	// Append the footer row
	chart2Table.appendChild(chart2FooterRow);
	// Display the table
	outputChart2.appendChild(chart2Table);
	outputChart2.classList.remove(`outputTable--1`)
	outputChart2.classList.remove(`outputTable--3`)
	outputChart2.classList.remove(`outputTable--5`)
	outputChart2.classList.add(`outputTable--${rangeStep}`)

	// Display the raw data
	!blankTable ? outputBlock.appendChild(simpleBlockTable) : null;
} // function fillResultsTable(traj)

function initGear() {
	// TODO: validate and sanitise inputs

	var bulletData = eval(document.getElementById("tgtDragProfile").value);
	var bulletBC = document.getElementById("gearbc").value;
	var bullet = new Bullet(bulletData, bulletBC);

	var v0atmo = new Atmosphere();
	var v0dt;
	if (document.getElementById("gearv0t").checked) {
		v0atmo.setReal(UC.from(document.getElementById("gearv0tr").value, "°C"), UC.from(1013.25, "hPa"), 0, 0);
		v0dt = UC.from((document.getElementById("gearv0td").value * 5) / 9, "fps");
	} else {
		v0atmo.setStd(0);
		v0dt = 0;
	}
	var v0 = new MuzzleVelocity(
		UC.from(document.getElementById("gearv0").value, "fps"),
		v0atmo,
		v0dt,
		0 // distance to chrono
	);

	var rifle = new Rifle(UC.from(document.getElementById("gearSightHeight").value, "mm"), 0);

	return { rifle: rifle, bullet: bullet, v0: v0 };
} // function initGear()

function initAtmo() {
	// TODO: validate and sanitise inputs

	var atmo = new Atmosphere();
	atmo.setReal(UC.from(document.getElementById("atmoTemp").value, "°C"), UC.from(document.getElementById("atmoPressure").value, "hPa"), document.getElementById("atmoHumidity").value / 100, UC.from(document.getElementById("atmoAltitude").value, "m"));

	return atmo;
} // function initAtmo()

// trajectory calculation routine
function goTrajTable() {
	var shotin = new ShotInitials(UC.from(document.getElementById("tgtElevation").value, "deg"), 0, 0, 0); // no cant, no elevation other than LoS, no azimuth delta
	var windo = new Wind(UC.from(document.getElementById("tgtWindSpeed").value, "m/s"), UC.from(document.getElementById("tgtWindDir").value, "deg"));

	var gear = initGear();
	var atmo = initAtmo();

	var dasolver = new Solver(gear.rifle, gear.bullet, gear.v0);
	var zeroRange = UC.from(document.getElementById("shotZero").value, "yard");
	var minDistance = UC.from(document.getElementById("tgtRangeMin").value, "yard");
	if (isNumeric(zeroRange) && zeroRange > 0) {
		var zeroElAz = dasolver.getZeroElevationAzimuth(zeroRange, atmo, null, null);
		shotin.elevation = zeroElAz.elevation;
	}

	var traj = dasolver.calculateTrajectory(atmo, shotin, windo, UC.from(document.getElementById("tgtRangeMax").value, "yard"), 3);

	fillResultsTable(traj, shotin.elevation, dasolver.v0.getRealV0(atmo, dasolver.bullet), minDistance);
} // function goTrajTable()

function hookInputValidators() {
	var allinputs = document.querySelectorAll("input");
	for (var i = 0; i < allinputs.length; i = i + 1) {
		var inputnode = allinputs[i];
		if (inputnode.type == "number") {
			allinputs[i].addEventListener("change", validateNumericInput);
		}
	}
} // function hookInputValidators()

hookInputValidators();

document.getElementById("s-btn-dotable").addEventListener("click", goTrajTable);

document.querySelectorAll("#s-btn-dotable").forEach(el => {
	el.addEventListener("click", goTrajTable);
});

document.querySelectorAll("#s-btn-doprint").forEach(el => {
	el.addEventListener("click", function() {
		window.print()
	});
});

function saveElementData(el) {
	// get element ID and value
	var elId = el.getAttribute('id');
	var elVal = el.value;
	if (el.type === 'radio') {
		if (el.value === 'moa' && el.checked) {
			elVal = true;
			localStorage.setItem('turretMrad', false);
		}
		if (el.value === 'mrad' && el.checked) {
			elVal = true;
			localStorage.setItem('turretMoa', false);
		}
		if (el.value === 'turret' && el.checked) {
			elVal = true;
			localStorage.setItem('chartClicks', false);
		}
		if (el.value === 'clicks' && el.checked) {
			elVal = true;
			localStorage.setItem('chartTurret', false);
		}
	}
	// create localStorage item
	localStorage.setItem(elId, elVal);
}

function setElementData() {
	// Loop through local storage keys
	Object.keys(localStorage).forEach(function(key){
		// get the id and value
		var elId = key;
		var elVal = localStorage.getItem(elId);
		// find the element
		var el = document.querySelector('#' + elId);
		// if it exists set the value
		if (el) {
			if (el.type === 'radio') {
				if (elId === 'turretMoa' && elVal === 'true') {
					el.checked = true;
					document.getElementById('turretMrad').removeAttribute('checked');
				}
				if (elId === 'turretMrad' && elVal == 'true') {
					el.checked = true;
					document.getElementById('turretMoa').removeAttribute('checked');
				}
				if (elId === 'chartClicks' && elVal === 'true') {
					el.checked = true;
					document.getElementById('chartClicks').removeAttribute('checked');
				}
				if (elId === 'chartTurret' && elVal === 'true') {
					el.checked = true;
					document.getElementById('chartTurret').removeAttribute('checked');
				}
			} else {
				el.value = elVal;
			}
		}
	});
}


document.querySelectorAll("input, select").forEach(function (el) {
	el.addEventListener("change", function(){
		// if dataSaved doesn't exist, set it
		!localStorage.getItem('dataSaved') ? localStorage.setItem('dataSaved', true) : null;
		// create the table
		goTrajTable();
		// save the data
		saveElementData(this);
	});
});

window.addEventListener("load", function () {
	// if the item exists set the data
	if (localStorage.getItem('dataSaved')) {
		setElementData()
	} else {
		document.querySelectorAll("input, select").forEach(function (el) {
			// save the data from each element
			saveElementData(el);
		});
	}
	// create the table
	goTrajTable();
});