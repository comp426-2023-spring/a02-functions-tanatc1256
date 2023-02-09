#!/usr/bin/env node

import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const args = minimist(process.argv.slice(2));
if (args.h) {
	 console.log("Usage: galosh.js [options] -[n|s] LATITUTE -[e|w] LONGITUTE -z TIME_ZONE");
         console.log("    -h	          Show this help message and exit.");
	 console.log("    -n, -s	  Latitute: N positive, S negative.");
	 console.log("    -e, -w	  Longitute: E positive, W negative.");
	 console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.");
	 console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
	 console.log("    -j            Echo pretty JSON from open-meteo API and exit.");
	 process.exit(0);
}

const timezone = moment.tz.guess();

let latitute = 0.0;
let longitute = 0.0;

if (args.n) {
	latitute = args.n;
}
else if (args.s) {
	latitute = -1 * (args.s);
}


if (args.e) {
	longitute = args.e;
}
else if (args.w) {
	longitute = -1 * (args.w);
}

if (args.z) {
	timezone = args.z;
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitute=' + latitute + '&longitute=' + longitute + '&hourly=temperature_2m,relativehumidity_2m,precipitation, windspeed_10m,winddirection_10m');
const data = await response.json();

if (args.j) {
	console.log(data);
	process.exit(0);
}

const days = args.d;

if (days == 0) {
	console.log("today's precipitation is " + data.daily.precipitation_hours[0]);
}
else if (days > 1) {
	console.log("in" + days + "days, the [recipitation would be " + data.daily.precipitation[days]);
}
else {
	console.log("tomorrow's precipitation is " + data.daily.precipitation[1]);
}

