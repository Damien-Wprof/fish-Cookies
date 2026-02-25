'use strict';

const hours = [
  '6am', '7am', '8am', '9am', '10am', '11am',
  '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
  '6pm', '7pm'
];

const tableElement = document.getElementById('sales-table');

const state = {
  allCookieStands: [],
};

// Constructor
function CookieStand(locationName, minCustomersPerHour, maxCustomersPerHour, avgCookiesPerSale) {
  this.locationName = locationName;
  this.minCustomersPerHour = minCustomersPerHour;
  this.maxCustomersPerHour = maxCustomersPerHour;
  this.avgCookiesPerSale = avgCookiesPerSale;
  this.customersEachHour = [];
  this.cookiesEachHour = [];
  this.totalDailyCookies = 0;
}

// Utility
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate customers
CookieStand.prototype.calcCustomersEachHour = function () {
  for (let i = 0; i < hours.length; i++) {
    this.customersEachHour.push(
      random(this.minCustomersPerHour, this.maxCustomersPerHour)
    );
  }
};

// ✅ CRITICAL FIX: reset state before calculating
CookieStand.prototype.calcCookiesEachHour = function () {
  this.customersEachHour = [];
  this.cookiesEachHour = [];
  this.totalDailyCookies = 0;

  this.calcCustomersEachHour();

  for (let i = 0; i < hours.length; i++) {
    const oneHour = Math.ceil(
      this.customersEachHour[i] * this.avgCookiesPerSale
    );
    this.cookiesEachHour.push(oneHour);
    this.totalDailyCookies += oneHour;
  }
};

// Render one store row
CookieStand.prototype.render = function () {
  this.calcCookiesEachHour();

  const tableRow = document.createElement('tr');

  let td = document.createElement('td');
  td.textContent = this.locationName;
  tableRow.appendChild(td);

  for (let i = 0; i < hours.length; i++) {
    td = document.createElement('td');
    td.textContent = this.cookiesEachHour[i];
    tableRow.appendChild(td);
  }

  td = document.createElement('td');
  td.textContent = this.totalDailyCookies;
  tableRow.appendChild(td);

  tableElement.appendChild(tableRow);
};

// Data
const seattle = new CookieStand('Seattle', 23, 65, 6.3);
const tokyo = new CookieStand('Tokyo', 3, 24, 1.2);
const paris = new CookieStand('Paris', 11, 38, 3.7);
const brazil = new CookieStand('Brazil', 20, 38, 2.3);
const quebec = new CookieStand('Quebec', 2, 16, 4.6);

state.allCookieStands.push(
  seattle,
  tokyo,
  paris,
  brazil,
  quebec
);

// Header row
function makeHeaderRow() {
  const tableRow = document.createElement('tr');

  let th = document.createElement('th');
  th.textContent = 'Locations';
  tableRow.appendChild(th);

  for (let i = 0; i < hours.length; i++) {
    th = document.createElement('th');
    th.textContent = hours[i];
    tableRow.appendChild(th);
  }

  th = document.createElement('th');
  th.textContent = 'Location Totals';
  tableRow.appendChild(th);

  tableElement.appendChild(tableRow);
}

// Footer row
function makeFooterRow() {
  const tableRow = document.createElement('tr');

  let th = document.createElement('th');
  th.textContent = 'Hourly Totals for All Locations';
  tableRow.appendChild(th);

  let totalOfTotals = 0;

  for (let i = 0; i < hours.length; i++) {
    let hourlyTotal = 0;

    for (let j = 0; j < state.allCookieStands.length; j++) {
      hourlyTotal += state.allCookieStands[j].cookiesEachHour[i];
      totalOfTotals += state.allCookieStands[j].cookiesEachHour[i];
    }

    th = document.createElement('th');
    th.textContent = hourlyTotal;
    tableRow.appendChild(th);
  }

  th = document.createElement('th');
  th.textContent = totalOfTotals;
  tableRow.appendChild(th);

  tableElement.appendChild(tableRow);
}

// Render table
(function renderTable() {
  makeHeaderRow();

  for (let i = 0; i < state.allCookieStands.length; i++) {
    state.allCookieStands[i].render();
  }

  makeFooterRow();
})();