#!/usr/bin/env /usr/local/bin/node

// <bitbar.title>BitCoinBar</bitbar.title>
// <bitbar.version>v0.2</bitbar.version>
// <bitbar.author>Moritz Stueckler</bitbar.author>
// <bitbar.author.github>pReya</bitbar.author.github>
// <bitbar.desc>Plugin for BitBar showing your current profit/losses from your Bitcoin portfolio.</bitbar.desc>
// <bitbar.dependencies>node, npm/request</bitbar.dependencies>

var request = require('request');
var fs = require('fs');

const FILENAME = '/Users/preya/Documents/Bitbar/BitCoinBar/highlow.txt';

// Bitcoins in your portfolio. No more than three digits after the decimal point!
const BTCAMOUNT = 2.123;

// Amount of money that you paid for the complete portfolio. In Cents, to avoid floating point errors.
const PAID = 221234;

// Absolute High and low values
var maxTotal = 0;
var minTotal = 0;
 
var reqOptions = {
  url: 'https://bitcoinapi.de/widget/current-btc-price/rate.json',
};
 
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var result = JSON.parse(body);
    var price = result.price_eur;

    // Get rid of € sign
    price = price.replace(" €", '');

    // Delete decimal points and commas for cent value
    price = price.replace('.', '');
    price = price.replace(',', '');
    price = parseInt(price);

    var currentValue = parseInt(((price*(BTCAMOUNT*1000))/1000));
    var total = parseFloat((currentValue-PAID)/100);
    var percentage = parseFloat((currentValue/PAID)-1).toFixed(4)*100;

    // On first run set both max and min to current total
    if (maxTotal == 0 && minTotal == 0)
    {
        maxTotal = total;
        minTotal = total;
        writeExtremaToFile(maxTotal, minTotal);
    }
    else
    {
        // New max total
        if (total > maxTotal)
        {
            maxTotal = total;
            writeExtremaToFile(maxTotal, minTotal);
        }
        // New min total
        else if (total < minTotal)
        {
            minTotal = total;
            writeExtremaToFile(maxTotal, minTotal);    
        }
    }
    
    var color = 'red';

    if (total > 0)
    {
        color='green';
    }

    console.log(":moneybag: "  + total + " € | color=" + color);
    console.log("---");
    console.log("Percent: " + percentage + " %");
    console.log("High: " + maxTotal + " €");
    console.log("Low: " + minTotal + " €");
    console.log("---");
    console.log("Price: " + result.price_eur);
    console.log("Update: " + result.date_de);

  }
}

function writeExtremaToFile(high, low)
{
    fs.writeFileSync(FILENAME, high + ';' + low);
}

function readExtremaFromFile()
{
    var read = fs.readFileSync(FILENAME).toString();
    if (read.indexOf(";") > -1)
    {
        var arr = read.split(';');
        maxTotal = arr[0];
        minTotal = arr[1];
    }
    
}

readExtremaFromFile(); 
request(reqOptions, callback);
