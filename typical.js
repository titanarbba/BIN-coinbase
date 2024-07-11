//****
CREAT AN ORDER WITH A TOKEN JAVASCRIPT

//****

const { sign } = require('jsonwebtoken');
const crypto = require('crypto');


const key_name = "organizations/{b1004e13-23ef-4be3-9843-a8a5905d4dee}/apiKeys/{c65a2355-5b66-40d3-93ae-cc9ba2a70cd1}";
const key_secret  =
  "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIOiwrsBJneqZgY43O3f4jaHlMfj83vQJVLSk5nbV6RdqoAoGCCqGSM49\nAwEHoUQDQgAEdDUdC/SlwqLTn3BsOt42vVbUYmlmWT8cLgLgFPZd/CujxGIzvVN7\nT3p5vmYim2hmiu0PFEtDMbfSYIs1hh8VHg==\n-----END EC PRIVATE KEY-----\n";



const request_method = 'POST';
const url = 'api.coinbase.com';
const request_path = '/api/v3/brokerage/orders';

const algorithm = 'ES256';
const uri = request_method + ' ' + url + request_path;

const token = sign(
		{
			iss: 'cdp',
			nbf: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 120,
			sub: key_name,
			uri,
		},
		key_secret,
		{
			algorithm,
			header: {
				kid: key_name,
                nonce: crypto.randomBytes(16).toString('hex'),
			},
		}
);
  
const raw = JSON.stringify({
    "client_order_id": "1234",
    "product_id": "XRP-USDC",
    "side": "BUY",
    "order_configuration": {
      "market_market_ioc": {
        "quote_size": "1"
      }
    }
  });
  
  const requestOptions = {
    method: "POST",
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    body: raw,
    redirect: "follow"
  };
  
  fetch("https://api.coinbase.com/api/v3/brokerage/orders", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  




return token
