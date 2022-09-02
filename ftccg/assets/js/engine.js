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

/*
This specific file is derivative work based on the excellent JBM
ballistic engine (released by the author, James B. Millard,
under GPL2 as CGI C code).
May grace and prosperity be with the original author; I send him
invisible rays of gratitude and happiness almost every day.
*/

// expects includes:
// * lib.js/service.js
// * lib.js/units.js
// * lib.js/vector.js

function DragModel(cdData) {
	this.dataPoints = cdData;

	// compute interpolation array
	this.curves = new Array();
	this.numpts = this.dataPoints.length;

	// first as linear approximation
	let rate = (this.dataPoints[1][1] - this.dataPoints[0][1]) / (this.dataPoints[1][0] - this.dataPoints[0][0]);
	this.curves[0] = [0, rate, this.dataPoints[0][1] - this.dataPoints[0][0] * rate];

	// rest as 2nd degree polynomials on three adjacent points
	for (var i = 1; i < this.numpts - 1; i++) {
		let x1 = this.dataPoints[i - 1][0];
		let x2 = this.dataPoints[i][0];
		let x3 = this.dataPoints[i + 1][0];
		let y1 = this.dataPoints[i - 1][1];
		let y2 = this.dataPoints[i][1];
		let y3 = this.dataPoints[i + 1][1];
		let a = ((y3 - y1) * (x2 - x1) - (y2 - y1) * (x3 - x1)) / ((x3 * x3 - x1 * x1) * (x2 - x1) - (x2 * x2 - x1 * x1) * (x3 - x1));
		let b = (y2 - y1 - a * (x2 * x2 - x1 * x1)) / (x2 - x1);
		let c = y1 - (a * x1 * x1 + b * x1);

		this.curves[i] = [a, b, c];
	}

	// last as linear
	rate = (this.dataPoints[this.numpts - 1][1] - this.dataPoints[this.numpts - 2][1]) / (this.dataPoints[this.numpts - 1][0] - this.dataPoints[this.numpts - 2][0]);
	this.curves[this.numpts - 1] = [0, rate, this.dataPoints[this.numpts - 2][1] - this.dataPoints[this.numpts - 2][0] * rate];

	this.getCdForMach = function (mach) {
		var m = 0;

		// find the right curve segment
		var mlo = 0;
		var mhi = this.numpts - 2;
		var mid;

		while (mhi - mlo > 1) {
			mid = Math.trunc((mhi + mlo) / 2);
			if (this.dataPoints[mid][0] < mach) {
				mlo = mid;
			} else {
				mhi = mid;
			}
		}
		if (this.dataPoints[mhi][0] - mach > mach - this.dataPoints[mlo][0]) {
			m = mlo;
		} else {
			m = mhi;
		}

		/* while ((this.dataPoints[m][0] < mach) && (m < this.numpts - 1)) { m = m + 1; }
            if (m > 0) {
                // find the closest midpoint
                if ((this.dataPoints[m][0] - mach) > (mach - this.dataPoints[m - 1][0])) { m = m - 1; }
            } */
		var drag = this.curves[m][2] + mach * (this.curves[m][1] + this.curves[m][0] * mach);
		return drag;
	}; // getCdForMach method
} // DragModel object

function Bullet(data, bc) {
	if (data !== undefined && data.source !== "std") {
		// this is a custom curve with bullet mass and cal specified
		this.name = data.name;
		this.mass = data.mass;
		this.cal = data.cal;
		this.len = data.len;
		if (bc) {
			console.log("achtung: using custom curve, supplied BC value '" + bc + "' is ignored");
		}
		// factor reference to std projectile (1 pound mass, 1" cal)
		this.bc = this.mass / this.cal / this.cal / (0.4535924 / 0.0254 / 0.0254);
	} else {
		// this is a standard model, using the supplied bc
		this.bc = bc;
	}
	this.dragModel = new DragModel(data.cdData);

	this.getDragForMach = function (mach) {
		const BC_PIR = 2.08551e-4; // ballistic constant
		var drag = (BC_PIR * this.dragModel.getCdForMach(mach)) / this.bc;
		// if (!isNumeric(drag)) throw "drag calculation fokedop";
		return drag;
	}; // getDragForMach function
} // Bullet object

function Atmosphere() {
	const ATMOS_TSTDABS = 518.67; // Standard Temperature - °R
	const ATMOS_T0 = 459.67; // Freezing Point - °R
	const ATMOS_TEMPGRAD = -3.56616e-3; // Temperature Gradient - °F/ft
	const ATMOS_PRESSEXPNT = -5.255876; // Pressure Exponent    - none
	const ATMOS_VV1 = 49.0223; // Sound Speed coefficient
	const ATMOS_A0 = 1.24871; // Vapor Pressure coefficients
	const ATMOS_A1 = 0.0988438;
	const ATMOS_A2 = 0.00152907;
	const ATMOS_A3 = -3.07031e-6;
	const ATMOS_A4 = 4.21329e-7;
	const ATMOS_ETCONV = 3.342e-4;
	const ATMOS_PRESSSTD = 29.92;
	const ATMOS_HUMSTD = 0.0;

	this.ATMOS_DENSSTD = 0.076474;

	this.temperature = 0; // temperature in °F
	this.pressure = 0; // pressure in in Hg
	this.humidity = 0; // relative humidity
	this.altitude = 0; // altitude in feet
	this.speedOfSound = 0; // mach 1.0 in feet/sec
	this.density = 0; // atmospheric density

	this.calculateDensityAndMach = function () {
		var t, p, hc, et, et0;
		t = this.temperature;
		p = this.pressure;
		h = this.humidity;

		var tc = (t - 32) * 0.555555555555555555555; // to °C
		var ppa = p * 3386.38; // to Pa
		if (h > 0.0 && h <= 1.0) {
			var pv = 610.2 * Math.pow(10, (7.5 * tc) / (tc + 237.8)) * h; // vapour pressure (saturation pressure x %H)
		} else {
			var pv = 0;
		}
		this.density = ((pv * 0.018016 + (ppa - pv) * 0.0289654) / (tc + 273.15)) * 0.007508357842; // factored in back to archaic units (lb/ft3)

		this.speedOfSound = Math.sqrt(t + ATMOS_T0) * ATMOS_VV1;
	};

	this.setReal = function (ctemperature, cpressure, chumidity, caltitude) {
		/* if (isNumeric(ctemperature) &&
                isNumeric(cpressure) &&
                isNumeric(chumidity) &&
                isNumeric(caltitude)) { */
		this.temperature = ctemperature;
		this.pressure = cpressure;
		this.humidity = chumidity;
		this.altitude = caltitude;
		this.calculateDensityAndMach();
		/* } else {
                throw "fokedop atmo params";
            } */
	}; // function setReal

	this.setStd = function (caltitude) {
		if (!isNumeric(caltitude)) {
			throw "fokedop atmo params";
		}
		this.altitude = caltitude;
		this.temperature = ATMOS_TSTDABS + caltitude * ATMOS_TEMPGRAD;
		this.pressure = ATMOS_PRESSSTD * Math.pow(ATMOS_TSTDABS / this.temperature, ATMOS_PRESSEXPNT);
		this.temperature = this.temperature - ATMOS_T0;
		this.humidity = ATMOS_HUMSTD;
		this.calculateDensityAndMach();
	};

	this.getSpeedOfSound = function (altDelta) {
		if (altDelta) {
			var atmoPlus = new Atmosphere();
			var pTemperature = this.temperature + altDelta * ATMOS_TEMPGRAD;
			var pPressure = this.pressure + ATMOS_PRESSSTD * (Math.pow(ATMOS_TSTDABS / (pTemperature + ATMOS_T0), ATMOS_PRESSEXPNT) - Math.pow(ATMOS_TSTDABS / (this.temperature + ATMOS_T0), ATMOS_PRESSEXPNT));
			atmoPlus.setReal(pTemperature, pPressure, this.humidity, this.altitude + altDelta);
			return atmoPlus.speedOfSound;
		} else {
			return this.speedOfSound;
		}
	};

	this.getDensity = function (altDelta) {
		if (altDelta) {
			var atmoPlus = new Atmosphere();
			var pTemperature = this.temperature + altDelta * ATMOS_TEMPGRAD;
			var pPressure = this.pressure + ATMOS_PRESSSTD * (Math.pow(ATMOS_TSTDABS / (pTemperature + ATMOS_T0), ATMOS_PRESSEXPNT) - Math.pow(ATMOS_TSTDABS / (this.temperature + ATMOS_T0), ATMOS_PRESSEXPNT));
			atmoPlus.setReal(pTemperature, pPressure, this.humidity, this.altitude + altDelta);
			return atmoPlus.density;
		} else {
			return this.density;
		}
	};

	this.getDensityAndSpeedOfSound = function (altDelta) {
		// both above methods at once, to save CPU cycles on Math.pow
		if (altDelta) {
			var atmoPlus = new Atmosphere();
			var pTemperature = this.temperature + altDelta * ATMOS_TEMPGRAD;
			var pPressure = this.pressure + ATMOS_PRESSSTD * (Math.pow(ATMOS_TSTDABS / (pTemperature + ATMOS_T0), ATMOS_PRESSEXPNT) - Math.pow(ATMOS_TSTDABS / (this.temperature + ATMOS_T0), ATMOS_PRESSEXPNT));
			atmoPlus.setReal(pTemperature, pPressure, this.humidity, this.altitude + altDelta);
			return { density: atmoPlus.density, speedOfSound: atmoPlus.speedOfSound };
		} else {
			return { density: this.density, speedOfSound: this.speedOfSound };
		}
	};
} // Atmosphere object

// rifle data
function Rifle(csightHeight, csightOffset) {
	this.sightHeight = csightHeight; // inch
	this.sightOffset = csightOffset; // inch
} // rifle data

// muzzle velocity data
function MuzzleVelocity(cv0, catmo, ctGradient, cchronoDist) {
	const TRAJ_MINCHRONO = 0.1; // minimal distance to chrono in feet, under which the velocity drop is not taken into account
	const TRAJ_NSTEPS_TOCHRONO = 100; // number of calculation steps to account for loss of speed
	this.TRAJ_ABSMAXVEL = 5000.0;

	this.v0 = cv0; // fps
	if (catmo) {
		this.atmo = catmo; // reference conditions for v0
		this.grad = ctGradient; // fps per °F
	} else {
		this.atmo = new Atmosphere();
		this.atmo.setStd(0);
		this.grad = null;
	}
	if (cchronoDist) {
		this.chronoDist = cchronoDist;
	} else {
		this.chronoDist = 0;
	} // distance to chronograph, feet

	// returns v0 adjusted for temperature and distance to chrono
	this.getRealV0 = function (catmo, bullet) {
		var dx, eq, tv, m, v, i;
		v = this.v0;

		// adjust for temperature
		if (this.grad) {
			v = v + (catmo.temperature - this.atmo.temperature) * this.grad;
		}

		// adjust for chrono distance
		if (this.chronoDist && this.chronoDist > TRAJ_MINCHRONO) {
			dx = -this.chronoDist / TRAJ_NSTEPS_TOCHRONO;
			eq = (dx * this.atmo.density) / this.atmo.ATMOS_DENSSTD;
			for (i = 0; i < TRAJ_NSTEPS_TOCHRONO; i++) {
				m = v / this.atmo.speedOfSound;
				tv = v - 0.5 * eq * v * bullet.getDragForMach(m);
				m = tv / this.atmo.speedOfSound;
				v = v - eq * tv * bullet.getDragForMach(m);
				if (v > this.TRAJ_ABSMAXVEL) break;
			}
		}
		return v;
	}; // function getRealV0, returns v0 adjusted for temperature and distance to chrono
} // muzzle velocity data

// wind data
function Wind(cspeed, cdir) {
	this.speed = cspeed; // fps
	this.dir = cdir;
	this.getSpeed = function (range, height) {
		// may be modified for more complex wind scenarios
		return this.speed;
	};
	this.getDir = function (range, height) {
		return this.dir;
	};
} // wind data

// shot data
function ShotInitials(clos, ccant, celevation, cazimuth) {
	this.losan = clos; // line of sight angle (eye-target to surface), radians
	this.cant = ccant; // horizontal cant angle, radians
	this.elevation = celevation; // to target, radians
	this.azimuth = cazimuth; // to target, radians
} // shot data

// trajectory point object
function TrajectoryPointInfo(crange, ctime, cvelocity, cmach, cdrop, cwindage) {
	this.range = crange; // feet
	this.time = ctime; // time of flight, s
	this.velocity = cvelocity; // fps
	this.mach = cmach;
	this.drop = cdrop; // feet
	this.windage = cwindage; // feet

	this.printHeader = function (units) {
		if (units == "modern") {
			console.log('"Range,m",' + '"Time,s",' + '"Velocity,m/s",' + '"Velocity,Mach",' + '"Drop,m",' + '"Windage,m"');
		} // modern units, all in meters
		else if ((units = "archaic")) {
			console.log('"Range,yd",' + '"Time,s",' + '"Velocity,fps",' + '"Velocity,Mach",' + '"Drop,in",' + '"Windage,in"');
		} // archaic units
		else {
			// raw, all in feet
			console.log('"Range,ft",' + '"Time,s",' + '"Velocity,fps",' + '"Velocity,Mach",' + '"Drop,ft",' + '"Windage,ft"');
		} // raw, all in feet
	}; // printHeader function

	this.print = function (units) {
		if (units == "modern") {
			console.log(this.range * 0.3048 + "," + this.time + "," + this.velocity * 0.3048 + "," + this.mach + "," + this.drop * 0.3048 + "," + this.windage * 0.3048);
		} // modern units, all in meters
		else if ((units = "archaic")) {
			console.log(
				this.range / 3 +
					"," + // yards
					this.time +
					"," +
					this.velocity +
					"," +
					this.mach +
					"," +
					this.drop * 12 +
					"," + // inches
					this.windage * 12
			);
		} // archaic units
		else {
			// raw, all in feet
			console.log(this.range + "," + this.time + "," + this.velocity + "," + this.mach + "," + this.drop + "," + this.windage);
		} // raw, all in feet
	}; // print function
} // trajectory point object

// the actual ballistic solver object
function Solver(crifle, cbullet, cv0) {
	const TRAJ_ERROR = 0.02 / 12.0; // max error in ft to zero
	const TRAJ_ABSMINVX = 50.0;
	const TRAJ_ABSMINY = -199999.9 / 12.0;
	const TRAJ_MINSTEP = 0.01;
	const TRAJ_MAXITCNT = 10; // max number of iterations to find zero
	const TRAJ_GM = -32.17; // gravity
	const TRAJ_MAXRANGE = 30000;

	this.rifle = crifle;
	this.bullet = cbullet;
	this.v0 = cv0;

	// returns an array of TrajectoryPointInfo objects
	this.calculateTrajectory = function (atmo, shotInitials, wind, rangeTo, rangeStep) {
		var stopAtGround = false;
		if (rangeTo < 0) {
			console.log("starting trajectory calculations to ground level with " + shotInitials.elevation + " radians elevation");
			rangeTo = TRAJ_MAXRANGE;
			stopAtGround = true;
		} else {
			console.log("starting trajectory calculations to " + rangeTo + " ft, every " + rangeStep);
		}
		// all distances/lengths/heights in feet
		var traj = new Array(); // result

		var timeStart = new Date();

		var cl = Math.cos(shotInitials.losan);
		var sl = Math.sin(shotInitials.losan);
		var cc = Math.cos(shotInitials.cant);
		var sc = Math.sin(shotInitials.cant);

		// gravity vector
		var vgrav = new Vector(TRAJ_GM * sl, TRAJ_GM * cl * cc, -TRAJ_GM * cl * sc);

		// wind vector
		var vwind0 = new Vector(wind.speed * Math.cos(wind.dir), 0, wind.speed * Math.sin(wind.dir)); // flat fire: no inclination or cant
		var tmp = vwind0.y * cl - vwind0.x * sl;
		var vwind = new Vector(vwind0.x * cl + vwind0.y * sl, tmp * cc + vwind0.z * sc, vwind0.z * cc - tmp * sc);

		// position: x - distance covered towards target, y - drop, z - widage.
		var pos = new Vector(0.0, -this.rifle.sightHeight, 0.0); // the reference frame is the rifle

		var time = 0.0;

		// muzzle velocity adjusted for atmosphere and distance to chrono
		var svelo = this.v0.getRealV0(atmo, this.bullet);
		var vvelo = vectorLogic.multiply(svelo, new Vector(Math.cos(shotInitials.elevation) * Math.cos(shotInitials.azimuth), Math.sin(shotInitials.elevation), Math.cos(shotInitials.elevation) * Math.sin(shotInitials.azimuth)));

		var speedOfSound = atmo.getSpeedOfSound(0);

		if (!isNumeric(rangeTo) || rangeTo < TRAJ_MINSTEP) {
			rangeTo = -1;
		}
		if (!rangeStep) {
			rangeStep = rangeTo;
		}
		// calculation step in x direction
		// var TRAJ_DX = rangeStep / 10;
		// while (TRAJ_DX > 1) { // at least 10 iterations per foot
		//     TRAJ_DX = TRAJ_DX / 10;
		// }
		var TRAJ_DX = 0.25; // 4 iterations per foot

		var iteration = 0;
		var nextRecordRange = 0;
		var recordNumber = 0;

		// main loop: here it goes downrange
		while (pos.x <= rangeTo + TRAJ_DX) {
			//if bullet too slow or fell too low - stop
			if (svelo < TRAJ_ABSMINVX || pos.y < TRAJ_ABSMINY) {
				console.log("bullet too slow or fell too low - stop at speed " + svelo + " fps and traj " + pos.y + " ft");
				break;
			}
			//if the next range record is reached
			if (pos.x >= nextRecordRange) {
				//save range
				var rpoint = new TrajectoryPointInfo(pos.x, time, svelo, svelo / speedOfSound, pos.y, pos.z);
				traj[recordNumber] = rpoint;
				nextRecordRange = nextRecordRange + rangeStep;
				recordNumber = recordNumber + 1;
			}

			// if calculating for ground, and ground is reached
			if (stopAtGround && pos.y < -this.rifle.sightHeight) {
				traj[recordNumber] = new TrajectoryPointInfo(pos.x, time, svelo, svelo / speedOfSound, pos.y, pos.z);
				recordNumber = recordNumber + 1;
				console.log("ground reached at range " + pos.x);
				rangeTo = pos.x;
				break;
			}

			// air density factor for drag calculation
			var dAlt = cc * (pos.x * sl + pos.y * cl);
			var dandsos = atmo.getDensityAndSpeedOfSound(dAlt);
			var eq = dandsos.density / atmo.ATMOS_DENSSTD;
			speedOfSound = dandsos.speedOfSound; // same

			// calculate velocity change for 1/2 of a step.
			var dt = (0.5 * TRAJ_DX) / vvelo.x; // time needed to fly through half of step
			var vvinair = vectorLogic.subtract(vvelo, vwind); // velocity relative to air
			svelo = vectorLogic.vlength(vvinair);
			var drg = eq * svelo * this.bullet.getDragForMach(svelo / speedOfSound); // drag (change of velocity)
			var vvelo2 = vectorLogic.subtract(
				vvelo, // velocity (relative to ground) at half-step
				vectorLogic.multiply(
					dt, // total velocity change
					vectorLogic.subtract(
						// total acceleration
						vectorLogic.multiply(drg, vvinair), // air drag acceleration (negative)
						vgrav
					)
				)
			);

			// calculate velocity change for another 1/2 of a step.
			dt = TRAJ_DX / vvelo2.x;
			vvinair = vectorLogic.subtract(vvelo2, vwind);
			svelo = vectorLogic.vlength(vvinair);
			drg = eq * svelo * this.bullet.getDragForMach(svelo / speedOfSound);

			// final velocity at the end of step
			var vvelo = vectorLogic.subtract(vvelo, vectorLogic.multiply(dt, vectorLogic.subtract(vectorLogic.multiply(drg, vvinair), vgrav)));

			// new position
			var dpos = new Vector(TRAJ_DX, vvelo.y * dt, vvelo.z * dt);
			pos = vectorLogic.add(pos, dpos);
			svelo = vectorLogic.vlength(vvelo);
			// and time in fly
			time = time + vectorLogic.vlength(dpos) / svelo;

			iteration = iteration + 1;
		} // main loop: here it goes downrange

		var timeEnd = new Date();
		console.log("traj done: " + rangeTo + " ft, " + iteration + " iterations, " + (timeEnd - timeStart) + " ms");
		return traj;
	}; // calculateTrajectory method

	this.getMaxRange = function (atmo) {
		// if catmo is not supplied, does a very conservative estimate of max range: flat fire in highest pressure and lowest temp
		const MAX_RANGE_DIFF = UC.from(10, "m"); // if range difference is below that -- stop calculations
		const MAX_ITERATIONS = 100; // max iterations (number of trajectory calculations) to converge to maxrange

		var vation = Math.PI / 4; // 45° initial elevation
		var estep = Math.PI / 36; // 5° initial step
		var stepdir = -1; // initially decrease elevation
		var range = 0;
		var newrange = 0;
		var iteration = 1;
		var traj;

		if (!atmo) {
			atmo = new Atmosphere();
			atmo.setReal(UC.from(-89.2, "°C"), UC.from(1086.8, "hPa"), 0, 0); // Earth's surface records for low temp and high press
		}

		var shotin = new ShotInitials(0, 0, vation, 0);
		var windo = new Wind(0, 0);

		while (true) {
			shotin.elevation = vation;
			traj = this.calculateTrajectory(atmo, shotin, windo, -1, null); // calculate where it hits the ground
			newrange = traj[traj.length - 1].range;
			if (Math.abs(newrange - range) < MAX_RANGE_DIFF) {
				console.log("max range determined at " + newrange + " ft = " + UC.to(newrange, "m") + " m after " + iteration + " iterations");
				return newrange;
			}
			iteration = iteration + 1;
			if (iteration > MAX_ITERATIONS) {
				console.log("max number of iterations (" + MAX_ITERATIONS + ") exceeded when determining max range. Error =  " + Math.abs(newrange - range));
				return newrange;
			}
			if (newrange < range) {
				estep = estep / 2;
				stepdir = -stepdir;
			}
			range = newrange;
			vation = vation + stepdir * estep;
		}
	}; // getMaxRange method

	this.getZeroElevationAzimuth = function (zeroRange, atmo, cshotInitials, cwind) {
		// all distances/lengths/heights in feet
		if (!zeroRange) {
			return 0.0;
		}

		var shot, wind;
		if (!cshotInitials) {
			shot = new ShotInitials(0, 0, 0, 0);
		} else {
			shot = cshotInitials;
		}
		if (!cwind) {
			wind = new Wind(0, 0);
		} else {
			wind = cwind;
		}

		var elerr = 0.0; // running error to find zero elevation
		var ntries = 0; // running number of iterations to find zero
		var traj;

		while ((elerr > TRAJ_ERROR && ntries < TRAJ_MAXITCNT) || ntries == 0) {
			traj = this.calculateTrajectory(atmo, shot, wind, zeroRange, null);
			elerr = Math.abs(traj[1].drop);
			shot.elevation = shot.elevation - traj[1].drop / zeroRange; // for small angles in radians
			ntries = ntries + 1;
		}
		if (ntries == TRAJ_MAXITCNT) {
			console.log("ACHTUNG: exceeded max iterations to calculate zero elevation. Zero elevation is wrong.");
		}

		console.log("initial [zero], radians: elevation " + shot.elevation + ", azimuth " + Math.atan(traj[1].windage / zeroRange));

		return { elevation: shot.elevation, azimuth: Math.atan(traj[1].windage / zeroRange) };
	}; // getZeroElevationAzimuth method

	this.getRangeTable = function (atmo, shotInitials, wind, rangeTo, rangeStep, zeroRange, zeroAtmo, zeroInitials, zeroWind) {
		// all distances/lengths/heights in feet
		// sanity
		if (!atmo) {
			throw "fokedop atmosphere arg, no place for space marines";
		}
		if (!wind) {
			throw "fokedop wind arg";
		}
		if (!isNumeric(rangeTo) || !isNumeric(rangeStep) || rangeStep < 0 || rangeTo < 0 || rangeStep > rangeTo) {
			throw "fokedop range args";
		}
		if (!shotInitials) {
			shotInitials = new ShotInitials(0, 0, 0, 0);
		}

		// get zero elevation, if needed
		if (isNumeric(zeroRange) && zeroRange > 0) {
			var za;
			if (zeroAtmo) {
				za = zeroAtmo;
			} else {
				za = atmo;
			}
			var zeroElAz = this.getZeroElevationAzimuth(zeroRange, za, zeroInitials, zeroWind);
			shotInitials.elevation = zeroElAz.elevation;
			shotInitials.azimuth = zeroElAz.azimuth;
		}

		return this.calculateTrajectory(atmo, shotInitials, wind, rangeTo, rangeStep);
	}; // getRangeTable method
} // Solver -- the actual ballistic solver object
