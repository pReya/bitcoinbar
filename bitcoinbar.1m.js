#!/usr/bin/env /usr/local/bin/node

// <bitbar.title>BitCoinBar</bitbar.title>
// <bitbar.version>v0.1</bitbar.version>
// <bitbar.author>Moritz Stueckler</bitbar.author>
// <bitbar.author.github>pReya</bitbar.author.github>
// <bitbar.desc>Plugin for BitBar showing your current profit/losses from your Bitcoin portfolio.</bitbar.desc>
// <bitbar.dependencies>node, npm/request</bitbar.dependencies>

var request = require('request');

// Bitcoins in your portfolio. No more than three digits after the decimal point!
const BTCAMOUNT = 2.287;

// Amount of money that you paid for the complete portfolio. In Cents, to avoid floating point errors.
const PAID = 35666 + 207456;
 
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
    var color = 'red';

    if (total > 0)
    {
        color='green';
    }

    console.log(":moneybag: "  + total + " € | color=" + color);
    console.log("---");
    console.log("Price: " + result.price_eur);
    console.log("Update: " + result.date_de);
  }
}
 
request(reqOptions, callback);