# api-request-simple

[![npm](https://img.shields.io/npm/v/api-request-simple.svg?style=flat-square)](https://www.npmjs.com/package/api-request-simple)
[![npm](https://img.shields.io/npm/dm/api-request-simple.svg)](https://www.npmjs.com/package/api-request-simple)

This module  wraps the request module for simple REST api interfacing with predetermined hosts

It is meant to be used in situations where you have a finite and predetermined set of hosts which you regularly interact with.  

# Example
In these cases
```js
var hosts = require("/config/hosts.json")
var api = new (require("api-request-simple"))(hosts)

var data = {foo : "bar"}
api.get("host_name", "/request/path/", data)
```

replaces

```js
var promise_request = require("require-promise");
var hosts = require("/config/hosts.json")
var data = {foo : "bar"}

// request queue id and trading id from api
var options = {
    method : 'GET',
    url: "http://" + hosts["host_name"] + "/request/path",
    json : true, // default to json
    qs : data, // convert "data" to qs
}
return promise_request(options);

```


and it particularly shines when you wish to use requests with client-certificates, where :

```js
var hosts = require(process.env.root+"/config/hosts.json");
var fs = require('fs');
var client_cert = {
    cert : fs.readFileSync(process.env.root+'/config/workhorse.pem'),
    key : fs.readFileSync(process.env.root+'/config/workhorse.key'),
    ca : fs.readFileSync(process.env.root+'/config/ca.pem'),
}
var api = new (require("api-request-simple"))({hosts:hosts, client_cert : client_cert });

var data = {foo : "bar"}
api.get("host_name", "/request/path/", data);
```


replaces

```js

var promise_request = require("require-promise");
var hosts = require(process.env.root+"/config/hosts.json");
var fs = require('fs');
var client_cert = {
    cert : fs.readFileSync(process.env.root+'/config/workhorse.pem'),
    key : fs.readFileSync(process.env.root+'/config/workhorse.key'),
    ca : fs.readFileSync(process.env.root+'/config/ca.pem'),
}

var options = {
    method : 'GET',
    url: "http://" + hosts["host_name"] + "/request/path",
    cert: client_cert.cert,
    key: client_cert.key,
    ca: client_cert.ca,
    qs : data, // convert "data" to qs
};
var promise_to_register = promise_request(options)
```
