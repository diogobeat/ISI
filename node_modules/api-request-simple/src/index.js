var promise_request = require("request-promise")

var Api = function(params, defaults){
    this.hosts = params; // assume that the whole object is hosts
    if(typeof params.hosts != "undefined") this.hosts = params.hosts; // but if hosts is explicitly defined in params then redefine hosts
    if(typeof params.client_cert != "undefined") this.client_cert = params.client_cert; // define client_cert if it is given
    this.defaults = (typeof defaults == "undefined")? {} : defaults; // set the defaults if they exist
}

Api.prototype = {
    get : function(host, route, data){
        var request_options = {};
        request_options.qs = data;
        request_options.method = "GET"; // define the method
        return this.request(host, route, request_options); // make general request
    },
    post : function(host, route, data){
        var request_options = {};
        if(this.defaults.json == true){
            request_options.body = data; // define as body if json is true
        } else {
            request_options.form = data; // define as form otherwise
        }
        request_options.method = "POST"; // define the method
        return this.request(host, route, request_options); // make general request
    },
    request : function(host, route, request_options){
        // validate request
        if(typeof this.hosts[host] == "undefined") throw "host (" + host + ") is not defined";

        // normalize route - it should always start with a "/"
        if(route[0] !== "/") route = "/" + route;

        // begin options with defaults
        var options = this.defaults;

        // append user defined options, overwrite defaults
        var options = Object.assign(options, request_options)

        // append client_cert parameters if client_cert is defined
        if(typeof this.client_cert != "undefined"){
            options.ssl = true; // enforce that we use https protocol
            options.cert = this.client_cert.cert;
            options.key = this.client_cert.key;
            options.ca = this.client_cert.ca;
        }

        // define protocol - should ssl be used or not
        var protocol = (options.ssl === true)? "https://" : "http://";
        options.ssl = null; // remove from options so it does not have any unintended consequences in request-promise

        // generate uri and define it in options and append client_cert if define
        var uri = protocol + this.hosts[host] + route;
        options.uri = uri;

        // pass the modified options to the request module
        return promise_request(options);
    }
}

module.exports = Api;
