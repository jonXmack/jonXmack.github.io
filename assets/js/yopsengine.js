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
// * lib.js/service.js
// * lib.js/units.js
// * engine/ebalengine.js

function Spreader(rifle, bullet, v0, atmo, rangeTo, sigmaV0, sigmaWind, sigmaOwn, sigmaShooter, posFactorV, posFactorH, sigmaRangeFactor, sigmaTemp, sigmaPress, sigmaTgtspd) {
	this.rifle = rifle;
	this.bullet = bullet;
	this.v0 = v0;
	this.atmo = atmo;
	this.rangeTo = rangeTo;
	this.sigmaV0 = sigmaV0;
	this.sigmaWind = sigmaWind;
	this.sigmaOwn = sigmaOwn;
	this.sigmaShooter = sigmaShooter;
	this.posFactorV = posFactorV;
	this.posFactorH = posFactorH;
	this.sigmaRangeFactor = sigmaRangeFactor;
	this.sigmaTemp = sigmaTemp;
	this.sigmaPress = sigmaPress;
	this.sigmaTgtspd = sigmaTgtspd;

	this.trajMid = null;
	this.trajTopV0 = null;
	this.trajBotV0 = null;
	this.trajTopTemperature = null;
	this.trajBotTemperature = null;
	this.trajTopPress = null;
	this.trajBotPress = null;

	this.feuerFrei = function () {
		// runs necessary trajectories calculations and initialises this.traj* attributes

		var shotin = new ShotInitials(0, 0, 0, 0);
		var wind = new Wind(UC.from(1, "m/s"), Math.PI / 2);

		// calculate middle traj with 1 m/s wind
		var solverMid = new Solver(this.rifle, this.bullet, this.v0);
		this.trajMid = solverMid.calculateTrajectory(atmo, shotin, wind, UC.from(this.rangeTo * (1 + this.sigmaRangeFactor) + 1, "m"), UC.from(1, "m"));
		if (this.trajMid.length - this.sigmaRangeFactor * this.rangeTo < this.rangeTo) {
			this.rangeTo = Math.floor(this.trajMid.length / (1 + this.sigmaRangeFactor)) - 1;
		}

		// calculate top and bottom traj, with plus/minus sigma v0
		var nv0 = new MuzzleVelocity(v0.v0 + UC.from(sigmaV0, "m/s"), v0.atmo, v0.grad, v0.chronoDist);
		var solver = new Solver(rifle, bullet, nv0);
		this.trajTopV0 = solver.calculateTrajectory(atmo, shotin, wind, UC.from(this.rangeTo, "m"), UC.from(1, "m"));
		nv0 = new MuzzleVelocity(v0.v0 - UC.from(sigmaV0, "m/s"), v0.atmo, v0.grad, v0.chronoDist);
		solver = new Solver(rifle, bullet, nv0);
		this.trajBotV0 = solver.calculateTrajectory(atmo, shotin, wind, UC.from(this.rangeTo, "m"), UC.from(1, "m"));
		if (this.trajBotV0.length < this.rangeTo) {
			this.rangeTo = this.trajBotV0.length - 1;
		}

		// calculate top and bottom traj, with plus/minus sigma temperature
		if (this.sigmaTemp != 0) {
			var atmoDif = new Atmosphere();
			atmoDif.setReal(UC.from(UC.to(atmo.temperature, "°C") + this.sigmaTemp, "°C"), atmo.pressure, atmo.humidity, atmo.altitude);
			this.trajTopTemperature = solverMid.calculateTrajectory(atmoDif, shotin, wind, UC.from(this.rangeTo, "m"), UC.from(1, "m"));
			atmoDif.setReal(UC.from(UC.to(atmo.temperature, "°C") - this.sigmaTemp, "°C"), atmo.pressure, atmo.humidity, atmo.altitude);
			this.trajBotTemperature = solverMid.calculateTrajectory(atmoDif, shotin, wind, UC.from(this.rangeTo, "m"), UC.from(1, "m"));
			if (this.trajBotTemperature.length < this.rangeTo) {
				this.rangeTo = this.trajBotTemperature.length - 1;
			}
		} else {
			this.trajTopTemperature = this.trajMid;
			this.trajBotTemperature = this.trajMid;
		}

		// calculate top and bottom traj, with plus/minus sigma pressure
		if (this.sigmaPress != 0) {
			var atmoDif = new Atmosphere();
			atmoDif.setReal(atmo.temperature, atmo.pressure + UC.from(this.sigmaPress, "hPa"), atmo.humidity, atmo.altitude);
			this.trajTopPress = solverMid.calculateTrajectory(atmoDif, shotin, wind, UC.from(this.rangeTo, "m"), UC.from(1, "m"));
			atmoDif.setReal(atmo.temperature, atmo.pressure - UC.from(this.sigmaPress, "hPa"), atmo.humidity, atmo.altitude);
			this.trajBotPress = solverMid.calculateTrajectory(atmoDif, shotin, wind, UC.from(this.rangeTo, "m"), UC.from(1, "m"));
			if (this.trajBotPress.length < this.rangeTo) {
				this.rangeTo = this.trajBotPress.length - 1;
			}
		} else {
			this.trajTopPress = this.trajMid;
			this.trajBotPress = this.trajMid;
		}
	}; // feuerFrei method

	this.getSpread = function (range) {
		// returns V and H stdev in radians for a given distance
		// and per factor distribution as .factors

		if (range > this.rangeTo || range < 0) {
			throw "fokedop spread: beyond calculated range. bombing out.";
		}
		if (!this.trajMid) {
			this.feuerFrei();
		}

		var result = {};

		// initial data preparation variance component (wind, distance, atmo, tgt speed etc.)
		var varPrepV = 0;
		var varPrepH = 0;

		// own system variance component (rifle, ammo, shooter, position, etc.)
		var varOwnV = 0;
		var varOwnH = 0;

		// initialise with own rifle spread and shooter spread, adjusted for position stability factor
		var varOwnV = this.sigmaOwn * this.sigmaOwn + this.sigmaShooter * this.sigmaShooter * this.posFactorV * this.posFactorV;
		var varOwnH = this.sigmaOwn * this.sigmaOwn + this.sigmaShooter * this.sigmaShooter * this.posFactorH * this.posFactorH;

		result["rifle"] = [sigmaOwn, sigmaOwn];
		result["shooter"] = [sigmaShooter, sigmaShooter];
		result["pos"] = [Math.sqrt(varOwnV - this.sigmaOwn * this.sigmaOwn - this.sigmaShooter * this.sigmaShooter), Math.sqrt(varOwnH - this.sigmaOwn * this.sigmaOwn - this.sigmaShooter * this.sigmaShooter)];
		if (!result["pos"][0]) {
			result["pos"][0] = 0;
		}
		if (!result["pos"][1]) {
			result["pos"][1] = 0;
		}

		var trajIndex = Math.round(range);
		var trajIndexDelta = Math.round(range * this.sigmaRangeFactor);

		// the "/ range" further down is to convert to radians

		// account for v0 spread
		var varV = UC.to(this.trajTopV0[trajIndex].drop - this.trajBotV0[trajIndex].drop, "m") / 2 / range;
		varOwnV = varOwnV + varV * varV;
		result["v0"] = [varV, 0];

		// account for temperature uncertainty
		varV = UC.to(this.trajTopTemperature[trajIndex].drop - this.trajBotTemperature[trajIndex].drop, "m") / 2 / range;
		varH = UC.to(this.trajTopTemperature[trajIndex].windage - this.trajBotTemperature[trajIndex].windage, "m") / 2 / range;
		result["temp"] = [varV, varH];
		varPrepV = varPrepV + varV * varV;
		varPrepH = varPrepH + varH * varH;

		// account for pressure uncertainty
		varV = UC.to(this.trajBotPress[trajIndex].drop - this.trajTopPress[trajIndex].drop, "m") / 2 / range;
		varH = UC.to(this.trajBotPress[trajIndex].drop - this.trajTopPress[trajIndex].drop, "m") / 2 / range;
		result["press"] = [varV, varH];
		varPrepV = varPrepV + varV * varV;
		varPrepH = varPrepH + varH * varH;

		// account for distance uncertainty
		varV = (UC.to(this.trajMid[trajIndex - trajIndexDelta].drop, "m") / (trajIndex - trajIndexDelta) - UC.to(this.trajMid[trajIndex + trajIndexDelta].drop, "m") / (trajIndex + trajIndexDelta)) / 2;
		varPrepV = varPrepV + varV * varV;
		result["dist"] = [varV, 0];

		// account for wind uncertainty
		var varH = (UC.to(this.trajMid[trajIndex].windage, "m") * this.sigmaWind) / range;
		varPrepH = varPrepH + varH * varH;
		result["wind"] = [0, varH];

		// account for target speed uncertainty
		var varH = (this.trajMid[trajIndex].time * this.sigmaTgtspd) / range;
		varPrepH = varPrepH + varH * varH;
		result["tgtspd"] = [0, varH];

		result["own"] = [Math.sqrt(varOwnV), Math.sqrt(varOwnH)];
		result["prep"] = [Math.sqrt(varPrepV), Math.sqrt(varPrepH)];
		result["total"] = [Math.sqrt(varPrepV + varOwnV), Math.sqrt(varPrepH + varOwnH)];

		return result;
	}; // getSpread method

	this.getPoiDiff = function (zeroDist, tgtDist) {
		// returns vertical difference in meters for a rifle zeroed at zeroDist when shooting at tgtDist
		if (zeroDist < 0 || tgtDist > this.rangeTo || tgtDist < 0) {
			throw "fokedop spread: beyond calculated range. bombing out.";
		}
		var solver = new Solver(this.rifle, this.bullet, this.v0);
		var shotin = new ShotInitials(0, 0, 0, 0);
		var wind = new Wind(0, 0);
		var elez = solver.getZeroElevationAzimuth(UC.from(zeroDist, "m"), this.atmo, shotin, wind).elevation;
		tgtDist = Math.round(tgtDist);
		var dy = elez * tgtDist + UC.to(this.trajMid[tgtDist].drop, "m");
		console.log("elevation diff at " + tgtDist + " with zero at " + zeroDist + " = " + dy);
		return dy;
	}; // getPoiDiff method
} // Spreader object
