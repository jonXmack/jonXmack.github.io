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

function UnitConverter() {
  const UNITS = {
    // f = factor (how many reference units in 1 factored unit), d = display precision after decimal point

    // length; reference = foot
    foot: { u: 'length', f: 1.0, d: 0 },
    inch: { u: 'length', f: 1 / 12, d: 1 },
    yard: { u: 'length', f: 3.0, d: 0 },
    mile: { u: 'length', f: 5280, d: 3 },
    mm: { u: 'length', f: 1 / 304.8, d: 0 },
    cm: { u: 'length', f: 1 / 30.48, d: 1 },
    m: { u: 'length', f: 1 / 0.3048, d: 2 },
    km: { u: 'length', f: 1 / 0.0003048, d: 3 },

    // weight; reference = gram
    gram: { u: 'weight', f: 1.0, d: 2 },
    grain: { u: 'weight', f: 0.06479891, d: 1 },

    // speed; reference = fps
    fps: { u: 'speed', f: 1.0, d: 0 },
    'm/s': { u: 'speed', f: 1 / 0.3048, d: 1 },
    mph: { u: 'speed', f: 1.4666666666667, d: 1 },
    kmh: { u: 'speed', f: 0.9113444152814232, d: 1 },

    // angle; reference = radian (rad)
    rad: { u: 'angle', f: 1.0, d: 4 },
    mrad: { u: 'angle', f: 0.001, d: 1 },
    deg: { u: 'angle', f: Math.PI / 180, d: 1 },
    moa: { u: 'angle', f: Math.PI / 180 / 60, d: 1 },
    oclock: { u: 'angle', f: Math.PI / 6, d: 1 },

    // temperature, reference = °F
    '°F': { u: 'temperature', f: 1.0, d: 1 },
    '°C': { u: 'temperature', f: null, d: 1 }, // conversion is not just a x factor; see to/from methods below

    // pressure; reference = inHg
    inHg: { u: 'pressure', f: 1.0, d: 2 },
    mmHg: { u: 'pressure', f: 0.03937008, d: 0 },
    hPa: { u: 'pressure', f: 0.02952998751, d: 1 },

    // time, reference = s
    s: { u: 'time', f: 1.0, d: 3 },

    // normal distribution, reference = sigma
    sigma: { u: 'stdev', f: 1.0, d: 2 },
    median: { u: 'stdev', f: 1 / 0.6745, d: 2 },
    r50: { u: 'stdev', f: 1 / 1.18, d: 2 },
  };

  this.to = function (val, units) {
    // from reference to specified unit
    try {
      if (units == '°C') {
        return ((val - 32) * 5) / 9;
      }
      return val / UNITS[units].f;
    } catch (err) {
      throw 'bad, bad unit! bombing out.';
    }
  };

  this.from = function (val, units) {
    // from specified unit to reference
    try {
      if (units == '°C') {
        return (val * 9) / 5 + 32;
      }
      return val * UNITS[units].f;
    } catch (err) {
      throw 'bad, bad unit! bombing out.';
    }
  };

  this.print = function (val, units) {
    try {
      return val.toFixed(UNITS[units].d);
    } catch (err) {
      throw 'bad, bad unit! bombing out.';
    }
  };

  this.toStr = function (val, units) {
    try {
      return this.to(val, units).toFixed(UNITS[units].d);
    } catch (err) {
      throw 'bad, bad unit! bombing out.';
    }
  };

  this.getUnitNames = function (measure) {
    // measure = 'lenght', 'weight', etc.
    // returns array of names of applicable units
    var result = [];
    var i = 0;
    for (var item in UNITS) {
      if (UNITS[item].u == measure) {
        result[i] = item;
        i = i + 1;
      }
    }
    return result;
  }; // getUnitNames method
} // UnitConverter object

var UC = new UnitConverter();
