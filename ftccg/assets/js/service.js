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

// service routines

function getFileContents(filename, callbackOnGot, respondWithNode) {
  var xrq = new XMLHttpRequest();
  xrq.onreadystatechange = function () {
    var contents = '';
    if (this.readyState == 4) {
      if (this.status == 200) {
        if (respondWithNode) {
          contents = xrq.responseXML.documentElement;
        } else {
          contents = xrq.responseText;
        }
      }
      if (!contents) {
        console.log('fokedop file read: ' + filename);
      }
      callbackOnGot(contents, filename);
    }
  };
  xrq.open('GET', filename, true);
  xrq.send();
} // function getFileContent(filename)

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
} // function isNumeric

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function validateNumericInput(evt) {
  // called on oninput of numeric input fields
  evt = evt || window.event;
  var node = evt.target || evt.srcElement;

  if (!node.value) {
    console.log('err: trying to validate numeric input without a value for ' + node);
  }
  if (isNumeric(node.value)) {
    var val = parseFloat(node.value);
  } else {
    node.value = 0;
  }
  if (node.max && val > node.max) {
    node.value = node.max;
  }
  if (node.min && val < node.min) {
    node.value = node.min;
  }
}

function triggerChange(node) {
  // fires up change evet on a given node;
  // works whether it is defined through .onchange or by addEventListener
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', true, true);
  node.dispatchEvent(evt);
} // function triggerChange(node)

function promptDownload(content, filename) {
  var contentType = 'application/octet-stream';
  var a = document.getElementById('download-file');
  var blob = new Blob([content], { type: contentType });
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  a.href = '#';
} // function promptDownload(content, filename)

function exportSvg(svgNode, filename) {
  var clone = svgNode.cloneNode(true);

  var svgDocType = document.implementation.createDocumentType('svg', '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd');
  var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
  svgDoc.replaceChild(clone, svgDoc.documentElement);
  var svgData = new XMLSerializer().serializeToString(svgDoc);
  var a = document.createElement('a');
  a.href = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
  a.download = filename;
  a.click();
} // function exportSvg(svgNode)

function makeTableRow() {
  var etr = document.createElement('tr');
  if (arguments.length < 2) {
    return etr;
  }
  var etd = document.createElement('td');
  if (arguments[0]) {
    etd.className = arguments[0];
  }
  etd.innerHTML = arguments[1];
  etr.appendChild(etd);

  for (let i = 2; i < arguments.length; i = i + 1) {
    etd = document.createElement('td');
    etd.innerHTML = arguments[i];
    etr.appendChild(etd);
  }
  return etr;
} // function makeTableRow()
