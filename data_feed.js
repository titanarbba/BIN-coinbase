// TO REVIEW
// JS Example for subscribing to a channel
/* eslint-disable */
const WebSocket = require("ws");
const { sign } = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");

// Derived from your Coinbase CDP API Key
//  SIGNING_KEY: the signing key provided as a part of your API key. Also called the "SECRET KEY"
//  API_KEY: the api key provided as a part of your API key. also called the "API KEY NAME"
const API_KEY = "organizations/{b1004e13-23ef-4be3-9843-a8a5905d4dee}/apiKeys/{c65a2355-5b66-40d3-93ae-cc9ba2a70cd1}";
const SIGNING_KEY =
  "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIOiwrsBJneqZgY43O3f4jaHlMfj83vQJVLSk5nbV6RdqoAoGCCqGSM49\nAwEHoUQDQgAEdDUdC/SlwqLTn3BsOt42vVbUYmlmWT8cLgLgFPZd/CujxGIzvVN7\nT3p5vmYim2hmiu0PFEtDMbfSYIs1hh8VHg==\n-----END EC PRIVATE KEY-----\n";

const algorithm = "ES256";

if (!SIGNING_KEY.length || !API_KEY.length) {
  throw new Error("missing mandatory environment variable(s)");
}

const CHANNEL_NAMES = {
  level2: "level2",
  user: "user",
  tickers: "ticker",
  ticker_batch: "ticker_batch",
  status: "status",
  market_trades: "market_trades",
  candles: "candles",
};

// The base URL of the API
const WS_API_URL = "wss://advanced-trade-ws.coinbase.com";

function signWithJWT(message, channel, products = []) {
  const jwt = sign(
    {
      iss: "cdp",
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: API_KEY,
    },
    SIGNING_KEY,
    {
      algorithm,
      header: {
        kid: API_KEY,
        nonce: crypto.randomBytes(16).toString("hex"),
      },
    }
  );

  return { ...message, jwt: jwt };
}

const ws = new WebSocket(WS_API_URL);

function subscribeToProducts(products, channelName, ws) {
  const message = {
    type: "subscribe",
    channel: channelName,
    product_ids: products,
    
  };
  const subscribeMsg = signWithJWT(message, channelName, products);
  ws.send(JSON.stringify(subscribeMsg));
}

function unsubscribeToProducts(products, channelName, ws) {
  const message = {
    type: "unsubscribe",
    channel: channelName,
    product_ids: products,
  };
  const subscribeMsg = signWithJWT(message, channelName, products);
  ws.send(JSON.stringify(subscribeMsg));
}



const connections = [];
let sentUnsub = false;


  ws.on("open", function () {
    const products = ["BTC-USD"];
    subscribeToProducts(products, CHANNEL_NAMES.level2, ws);
    console.log('WebSocket is connected.');
  });

  
  ws.on("message", function (data) {

   
    console.log(data.toString());
 
  });



  connections.push(ws);
//}
