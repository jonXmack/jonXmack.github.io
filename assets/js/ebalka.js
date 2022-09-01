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

var GADIY = {
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


function fillResultsTable(traj, zeroElevation, realv0, minDistance) {
	// get click values in radians
	var clickV = document.getElementById("gearClickV").value;
	var clickH = document.getElementById("gearClickH").value;
	var clickInteger = 1 / clickV;
	var windSpeed = document.getElementById("tgtWindSpeed").value;
	var windDir = document.getElementById("tgtWindDir").value;
	var displayWindage = windSpeed > 0 && windDir != 0 ? true : false;

	var rifleName = document.getElementById("rifleName").value;
	var scopeName = document.getElementById("scopeName").value;
	var zeroDistance = document.getElementById("shotZero").value;
	var bcValue = document.getElementById("gearbc").value;
	var dragProfile = document.getElementById("tgtDragProfile").value;

	var chartHeaderVal = rifleName + " / " + scopeName;
	var chartFooterVal = "Zero: " + zeroDistance + " yards / BC: " + bcValue + " / Drag Profile: " + dragProfile;

	clickV = UC.from(clickV, "moa");
	clickH = UC.from(clickH, "moa");

	var outputBlock = document.getElementById("outputBlock");
	var outputChart1 = document.getElementById("outputChart1");
	var outputChart2 = document.getElementById("outputChart2");
	// erase whatever was in the output bin
	while (outputBlock.hasChildNodes()) {
		outputBlock.removeChild(outputBlock.lastChild);
	}

	while (outputChart1.hasChildNodes()) {
		outputChart1.removeChild(outputChart1.lastChild);
	}

	while (outputChart2.hasChildNodes()) {
		outputChart2.removeChild(outputChart2.lastChild);
	}

	var simpleBlockTable;
	var simpleblockRow;
	var blockCell;

	var chart1Table;
	var chart1Row;
	var chart1Cell;

	var chart2Table;
	var chart2Row;
	var chart2Cell;

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
	chart1FooterCell.innerHTML = chartFooterVal;
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
	chart2FooterCell.innerHTML = chartFooterVal;
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
	blockCell.innerHTML = "Drop, moa";
	simpleblockRow.appendChild(blockCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Clicks";
	simpleblockRow.appendChild(blockCell);

	blockCell = document.createElement("th");
	blockCell.innerHTML = "Turret";
	simpleblockRow.appendChild(blockCell);

	if (displayWindage) {
		blockCell = document.createElement("th");
		blockCell.innerHTML = "Windage, moa";
		simpleblockRow.appendChild(blockCell);
	
		blockCell = document.createElement("th");
		blockCell.innerHTML = "Clicks";
		simpleblockRow.appendChild(blockCell);
	
		blockCell = document.createElement("th");
		blockCell.innerHTML = "Turret";
		simpleblockRow.appendChild(blockCell);
	}

	simpleBlockTable.appendChild(simpleblockRow);

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

	var minDistanceYards = minDistance / 3;

	var clicksPerRev = parseInt(document.querySelector("#gearClicksRev").value);
	var maxClicks = clicksPerRev - 1;
	var separator = document.querySelector("#separator").value;
	var reminder = document.querySelector("#reminder").value;
	var chartTurret = document.querySelector("#chartTurret").checked;
	var chartClicks = document.querySelector("#chartClicks").checked;
	
	var minRange = document.getElementById("tgtRangeMin").value;
	var maxRange = document.getElementById("tgtRangeMax").value;

	var dataArr = [];

	console.log(traj);

	for (let i = minDistanceYards; i < traj.length; i++) {
		var rangeArr = [];
		var Range = UC.to(traj[i].range, "yard");
		var Time = UC.toStr(traj[i].time, "s");
		var Velocity = UC.toStr(traj[i].velocity, "fps");
		var Mach = traj[i].mach.toFixed(3);
		var Drop = UC.to(traj[i].drop, "yard");
		var Windage = UC.to(traj[i].windage, "m");
		var dropMrad = Math.round(Range) ? UC.to(Drop / Range, "mrad").toFixed(2) : "---";
		var windageMrad = Math.round(Range) ? UC.to(Windage / Range, "mrad").toFixed(2) : "---";
		var dropMoa = Math.round(Range) ? UC.to(Drop / Range, "moa").toFixed(2) : "---";
		var windageMoa = Math.round(Range) ? UC.to(Windage / Range, "moa").toFixed(2) : "---";
		var clicksY = Math.round(Range) ? (-Drop / (Range * clickV)).toFixed(0) : "---";
		var clicksYDisplay = clicksY >= 0 ? Math.floor(clicksY / clickInteger).toString() + separator + Math.floor(clicksY % clickInteger).toString() : "-" + Math.floor((clicksPerRev - Math.abs(clicksY)) / clickInteger).toString() + separator + Math.floor((clicksPerRev - Math.abs(clicksY)) % clickInteger).toString();
		var clicksX = Math.round(Range) ? (Windage / (Range * clickH)).toFixed(0) : "---";
		var clicksXDisplay = clicksY >= 0 ? Math.floor(clicksX / clickInteger).toString() + separator + Math.floor(clicksX % clickInteger).toString() : "-" + Math.floor((clicksPerRev - Math.abs(clicksX)) / clickInteger).toString() + separator + Math.floor((clicksPerRev - Math.abs(clicksX)) % clickInteger).toString();

		var turretY = clicksY > maxClicks ? Math.floor(maxClicks / clickInteger) + separator + Math.floor(maxClicks % clickInteger) + " " + reminder : clicksYDisplay;
		var turretX = clicksX > maxClicks ? Math.floor(maxClicks / clickInteger) + separator + Math.floor(maxClicks % clickInteger) + " " + reminder : clicksXDisplay;

		simpleblockRow = displayWindage ? makeTableRow("", Range.toFixed(0), Time, Velocity, dropMoa, clicksY, turretY, windageMoa, clicksX, turretX) : makeTableRow("", Range.toFixed(0), Time, Velocity, dropMoa, clicksY, turretY);
		simpleBlockTable.appendChild(simpleblockRow);

		rangeArr.push(Range);
		chartTurret ? rangeArr.push(turretY) : rangeArr.push(clicksY);

		dataArr.push(rangeArr);
	}

	var chart1RangeDone = [];
	var chart1Arr = [];
	var chart1Col1Start = 0 - 2;
	var chart1Col2Start = 14;
	var chart1Col3Start = 30;

	var chart2RangeDone = [];
	var chart2Arr = [];
	var chart2Col1Start = 0;
	var chart2Col2Start = 23;

	dataArr.forEach((e, i) => {
		var range = e[0];
		var clicks = e[1];
		var chart1Row = [];
		var chart2Row = [];

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

		if (!chart1RangeDone.includes(range)) {
			chart1Row.push(chart1Col1range);
			chart1Row.push(chart1Col1clicks);
			chart1Row.push(chart1Col2range);
			chart1Row.push(chart1Col2clicks);
			chart1Row.push(chart1Col3range);
			chart1Row.push(chart1Col3clicks);

			chart1Col1Start = chart1Col1Start + 1;
			chart1Col2Start = chart1Col2Start + 1;
			chart1Col3Start = chart1Col3Start + 1;

			chart1Arr.push(chart1Row);
			chart1RangeDone.push(chart1Col1range);
			chart1RangeDone.push(chart1Col2range);
			chart1RangeDone.push(chart1Col3range);
		}

		if (!chart2RangeDone.includes(range)) {
			chart2Row.push(chart2Col1range);
			chart2Row.push(chart2Col1clicks);
			chart2Row.push(chart2Col2range);
			chart2Row.push(chart2Col2clicks);

			chart2Col1Start = chart2Col1Start + 1;
			chart2Col2Start = chart2Col2Start + 1;

			chart2Arr.push(chart2Row);
			chart2RangeDone.push(chart2Col1range);
			chart2RangeDone.push(chart2Col2range);
		}
	});

	chart1Arr.forEach((e) => {
		chart1Row = makeTableRow("", e[0], e[1], e[2], e[3], e[4], e[5]);
		chart1Table.appendChild(chart1Row);
	});
	chart1Table.appendChild(chart1FooterRow);
	outputChart1.appendChild(chart1Table);

	chart2Arr.forEach((e) => {
		chart2Row = makeTableRow("", e[0], e[1], e[2], e[3]);
		chart2Table.appendChild(chart2Row);
	});
	chart2Table.appendChild(chart2FooterRow);
	outputChart2.appendChild(chart2Table);

	outputBlock.appendChild(simpleBlockTable);
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

	var traj = dasolver.calculateTrajectory(atmo, shotin, windo, UC.from(document.getElementById("tgtRangeMax").value, "yard"), UC.from(document.getElementById("tgtRangeStep").value, "yard"));

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
document.getElementById("btn-dotable").addEventListener("click", goTrajTable);
document.querySelectorAll("input").forEach(function (el) {
	el.addEventListener("change", goTrajTable);
});
document.querySelectorAll("select").forEach(function (el) {
	el.addEventListener("change", goTrajTable);
});

window.addEventListener("load", function () {
	goTrajTable();
});
