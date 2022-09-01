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
ballistic engine (released by the author,James B. Millard,
under GPL2 as CGI C code).
May grace and prosperity be with the original author; I send him
invisible rays of gratitude and happiness almost every day.
*/

// vector object and logic

function Vector(x, y, z) {
	if (!x) {
		this.x = 0;
	} else {
		this.x = x;
	}

	if (!y) {
		this.y = 0;
	} else {
		this.y = y;
	}

	if (!z) {
		this.z = 0;
	} else {
		this.z = z;
	}
}

function VectorLogic() {
	this.dotX = function (v1, v2) {
		return v1.x * v2.x;
	};
	this.dotY = function (v1, v2) {
		return v1.y * v2.y;
	};
	this.dotZ = function (v1, v2) {
		return v1.z * v2.z;
	};
	this.dot = function (v1, v2) {
		return dotX(v1, v2) + dotY(v1, v2) + dotZ(v1, v2);
	};

	this.add = function (v1, v2) {
		var result = new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
		return result;
	};

	this.subtract = function (v1, v2) {
		var result = new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
		return result;
	};

	this.multiply = function (scalar, vector) {
		var result = new Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
		return result;
	};

	this.reverse = function (vector) {
		var result = new Vector(-vector.x, -vector.y, -vector.z);
		return result;
	};

	this.modulus = function (vector) {
		return this.dot(vector, vector);
	};

	this.vlength = function (vector) {
		return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
	};

	this.distance = function (v1, v2) {
		return this.vlength(this.subtract(v1, v2));
	};

	this.normalize = function (vector) {
		var len = this.vlength(vector);
		if (len > 0) {
			return this.multiply(1.0 / len, vector);
		} else {
			return new Vector();
		}
	};
} // vectorLogic object

// global object init
var vectorLogic = new VectorLogic();
